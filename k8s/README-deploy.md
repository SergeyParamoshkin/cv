# Deploying the CV site

Target: Yandex Cloud Managed Kubernetes, cloud `cloud` (`b1g6odbp4pgvn6ud4blm`),
folder `default` (`b1g57hlukjsl0m5tiud3`), yc profile `psvpro`.

| Resource | Id |
| --- | --- |
| Cluster | `cv-cluster` (zonal, `ru-central1-d`) |
| Registry | `cv-registry` — `crpgccd19gdlj8e2k90t` |
| Image | `cr.yandex/crpgccd19gdlj8e2k90t/cv` |
| Cluster SA | `cv-k8s-cluster` |
| Node SA | `cv-k8s-node` (pulls from the registry) |
| CI SA | `cv-ci` (pushes images, deploys) |

## One-time cluster setup

```sh
yc managed-kubernetes cluster get-credentials cv-cluster --external --force

helm repo add jetstack https://charts.jetstack.io
helm repo add envoy-gateway oci://docker.io/envoyproxy --force-update 2>/dev/null || true
helm repo update

helm upgrade --install cert-manager jetstack/cert-manager \
  --namespace cert-manager --create-namespace --set crds.enabled=true

helm upgrade --install envoy-gateway oci://docker.io/envoyproxy/gateway-helm \
  --namespace envoy-gateway-system --create-namespace
```

Cloudflare API token (scope `Zone:DNS:Edit` on `psvpro.ru`) — never commit it,
`k8s/secret*.yaml` is gitignored:

```sh
kubectl -n cert-manager create secret generic cloudflare-api-token \
  --from-literal=api-token='<TOKEN>'
```

Platform resources (cluster-scoped, not part of the kustomization):

```sh
kubectl apply -f clusterissuer.yaml
kubectl apply -f envoyproxy.yaml
kubectl apply -f gatewayclass.yaml
```

## Application

```sh
kubectl apply -k .
```

The load balancer address comes from the Envoy service; point the
`cv.psvpro.ru` A record at it:

```sh
kubectl -n envoy-gateway-system get svc -o wide
```

## Continuous deployment

`.github/workflows/deploy.yml` builds on pushes to `main` and `v*` tags, pushes
to the registry tagged with the commit sha, then applies the manifests and rolls
the deployment. It needs one repository secret:

- `YC_SA_JSON_CREDENTIALS` — authorized-key JSON for the `cv-ci` service account:

```sh
yc iam key create --service-account-name cv-ci --output cv-ci-key.json
```
