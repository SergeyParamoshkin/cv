<template>
  <CV msg="Sergey Paramoshkin" />
</template>

<script>
import CV from './components/CV.vue'

export default {
  name: 'App',
  components: {
    CV
  },
}
</script>

<style>
body {
  background-color: black;
}

p {
  font-size: 15px;
  display: inline;
}

span.apple {
  color: white;
  margin-right: 5px;
}

span.arrow {
  color: rgb(38, 165, 38);
  margin-left: 3px;
}

span.console {
  color: #538ac2;
}


#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: white;
  margin-top: 5%;
  margin-left: 5%;
}
</style>