<template>
	<div class="contact-list">
		<div v-for="contact in data.contacts" :key="contact.id" class="contact-item">
			<font-awesome-icon :icon="contact.icon" class="contact-icon" />
			<span class="contact-label">{{ contact.label }}:</span>
			<a
				v-if="contact.link"
				:href="contact.link"
				target="_blank"
				rel="noopener noreferrer"
				class="contact-link"
			>
				{{ contact.value }}
			</a>
			<span v-else class="contact-value">{{ contact.value }}</span>
		</div>
	</div>
</template>

<script>
/**
 * Contact list formatter component
 * @component
 */
export default {
	name: 'ContactList',
	props: {
		/** @type {Object} Contact data object */
		data: {
			type: Object,
			required: true,
		},
	},
};
</script>

<style scoped>
.contact-list {
	display: inline-block;
	line-height: 2;
}

.contact-item {
	margin-bottom: var(--spacing-sm);
}

.contact-icon {
	color: var(--color-accent-green);
	margin-right: var(--spacing-sm);
	width: 16px;
}

.contact-label {
	color: var(--color-accent-blue);
	margin-right: var(--spacing-sm);
}

.contact-link {
	color: var(--color-accent-green);
	text-decoration: none;
	border-bottom: 1px dashed;
}

.contact-link:hover {
	color: var(--color-white);
}

.contact-value {
	color: var(--color-text-primary);
}
</style>
