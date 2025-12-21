<template>
	<div class="education-list">
		<!-- Degrees -->
		<div v-if="data.degrees && data.degrees.length" class="education-section">
			<h3>Education</h3>
			<div v-for="degree in data.degrees" :key="degree.id" class="education-item">
				<div class="degree-period">{{ degree.period.start }} - {{ degree.period.end }}</div>
				<div class="degree-title">{{ degree.degree }}</div>
				<div class="degree-institution">{{ degree.institution }}</div>
				<div v-if="degree.gpa" class="degree-gpa">GPA: {{ degree.gpa }}</div>
			</div>
		</div>

		<!-- Certifications -->
		<div v-if="data.certifications && data.certifications.length" class="education-section">
			<h3>Certifications</h3>
			<div v-for="cert in data.certifications" :key="cert.id" class="certification-item">
				<span class="cert-name">{{ cert.name }}</span>
				<span class="cert-issuer"> - {{ cert.issuer }}</span>
				<span class="cert-date"> ({{ cert.date }})</span>
			</div>
		</div>
	</div>
</template>

<script>
/**
 * Education list formatter component
 * @component
 */
export default {
	name: 'EducationList',
	props: {
		/** @type {Object} Education data object */
		data: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style scoped>
.education-list {
	display: inline-block;
}

.education-section {
	margin-bottom: var(--spacing-md);
}

.education-section h3 {
	color: var(--color-accent-blue);
	margin-bottom: var(--spacing-sm);
	font-size: var(--font-size-base);
	font-weight: bold;
}

.education-item {
	margin-bottom: var(--spacing-md);
	margin-left: var(--spacing-md);
	line-height: 1.8;
}

.degree-period {
	color: var(--color-accent-green);
}

.degree-title {
	color: var(--color-text-primary);
	font-weight: bold;
}

.degree-institution {
	color: #999;
}

.degree-gpa {
	color: #999;
	font-size: 14px;
}

.certification-item {
	margin-bottom: var(--spacing-sm);
	margin-left: var(--spacing-md);
	line-height: 1.8;
}

.cert-name {
	color: var(--color-text-primary);
	font-weight: bold;
}

.cert-issuer {
	color: #999;
}

.cert-date {
	color: var(--color-accent-green);
}
</style>
