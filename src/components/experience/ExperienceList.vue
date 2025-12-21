<template>
	<div class="experience-list">
		<slot :formatted-string="formattedString" />
	</div>
</template>

<script>
/**
 * Experience list component - formats positions for display
 * @component
 */
export default {
	name: 'ExperienceList',
	props: {
		/** @type {Array<Object>} Array of position objects */
		positions: {
			type: Array,
			required: true,
		},
	},
	computed: {
		formattedString() {
			return this.positions
				.map((pos) => {
					const endDate = pos.current ? 'current' : pos.period.end;
					return `${pos.period.start} - ${endDate.padEnd(10, ' ')}&emsp; > ${pos.title}`;
				})
				.join('<br>');
		},
	},
};
</script>

<style scoped>
.experience-list {
	display: inline-block;
}
</style>
