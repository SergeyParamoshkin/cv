<template>
	<div class="experience-list">
		<div v-for="pos in data.positions" :key="pos.id" class="experience-item">
			{{ pos.period.start }} - {{ formatEndDate(pos) }} &emsp; > {{ pos.title }}
		</div>
	</div>
</template>

<script>
/**
 * Experience list formatter component
 * @component
 */
export default {
	name: 'ExperienceList',
	props: {
		/** @type {Object} Experience data object */
		data: {
			type: Object,
			required: true,
		},
	},
	methods: {
		formatEndDate(position) {
			return position.current ? 'current' : position.period.end;
		},
	},
};
</script>

<style scoped>
.experience-list {
	display: inline-block;
	line-height: 1.8;
}

.experience-item {
	margin-bottom: var(--spacing-xs);
}
</style>
