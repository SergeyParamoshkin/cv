<template>
	<div class="skills-grid">
		<div v-for="category in data.categories" :key="category.id" class="skill-category">
			<h3 class="category-title">{{ category.name }}</h3>
			<div class="skills-list">
				<div v-for="skill in category.skills" :key="skill.name" class="skill-item">
					<span class="skill-name">{{ skill.name }}</span>
					<span v-if="skill.level" class="skill-level">[{{ skill.level }}]</span>
					<span v-if="skill.years" class="skill-years">({{ skill.years }} years)</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
/**
 * Skills grid formatter component
 * @component
 */
export default {
	name: 'SkillsGrid',
	props: {
		/** @type {Object} Skills data object */
		data: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style scoped>
.skills-grid {
	display: inline-block;
}

.skill-category {
	margin-bottom: var(--spacing-md);
}

.category-title {
	color: var(--color-accent-blue);
	margin-bottom: var(--spacing-sm);
	font-size: var(--font-size-base);
	font-weight: bold;
}

.skills-list {
	margin-left: var(--spacing-md);
}

.skill-item {
	margin-bottom: var(--spacing-xs);
	line-height: 1.8;
}

.skill-name {
	color: var(--color-text-primary);
}

.skill-level {
	color: var(--color-accent-green);
	margin-left: var(--spacing-sm);
}

.skill-years {
	color: #999;
	margin-left: var(--spacing-sm);
}
</style>
