<template>
	<div class="output-line">
		<!-- Typed анимация -->
		<TypedOutput
			v-if="type === 'typed'"
			:strings="[content]"
			:type-speed="typeSpeed"
			@complete="$emit('complete')"
		/>

		<!-- Статический вывод -->
		<div v-else-if="type === 'static'" v-html="content" />

		<!-- Компонент -->
		<component
			:is="componentMap[renderComponent]"
			v-else-if="type === 'component' && componentMap[renderComponent]"
			:data="content"
		/>
	</div>
</template>

<script>
import TypedOutput from './TypedOutput.vue';
import ExperienceList from '../formatters/ExperienceList.vue';
import SkillsGrid from '../formatters/SkillsGrid.vue';
import ContactList from '../formatters/ContactList.vue';
import EducationList from '../formatters/EducationList.vue';

/**
 * Universal output line renderer
 * @component
 */
export default {
	name: 'OutputLine',
	components: {
		TypedOutput,
		ExperienceList,
		SkillsGrid,
		ContactList,
		EducationList,
	},
	props: {
		/** @type {string|Object} Output content */
		content: {
			type: [String, Object],
			required: true,
		},
		/** @type {'typed'|'static'|'component'} Render type */
		type: {
			type: String,
			default: 'typed',
		},
		/** @type {string|null} Component name for type='component' */
		renderComponent: {
			type: String,
			default: null,
		},
		/** @type {number} Typing speed for typed output */
		typeSpeed: {
			type: Number,
			default: 15,
		},
	},
	emits: ['complete'],
	data() {
		return {
			componentMap: {
				ExperienceList: 'ExperienceList',
				SkillsGrid: 'SkillsGrid',
				ContactList: 'ContactList',
				EducationList: 'EducationList',
			},
		};
	},
};
</script>

<style scoped>
.output-line {
	margin-bottom: var(--spacing-sm);
}
</style>
