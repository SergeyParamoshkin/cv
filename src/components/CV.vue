<template>
	<div class="cv-container">
		<TerminalHeader path="~/code/go" command="tail -n +0 -f paradox_cv" />
		<ExperienceList :positions="experienceData.positions">
			<template #default="{ formattedString }">
				<TypedOutput :strings="[formattedString]" :type-speed="15" />
			</template>
		</ExperienceList>
	</div>
</template>

<script>
import TerminalHeader from './terminal/TerminalHeader.vue';
import TypedOutput from './terminal/TypedOutput.vue';
import ExperienceList from './experience/ExperienceList.vue';
import experienceData from '@/data/experience.json';

/**
 * Main CV component orchestrating terminal and experience display
 * @component
 */
export default {
	name: 'CVComponent',
	components: {
		TerminalHeader,
		TypedOutput,
		ExperienceList,
	},
	data() {
		return {
			experienceData,
		};
	},
};
</script>

<style scoped>
.cv-container {
	position: relative;
}
</style>
