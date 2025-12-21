<template>
	<div class="terminal-header">
		<div class="header-line">
			<span class="terminal-apple">
				<font-awesome-icon :icon="['fab', 'apple']" />
			</span>
			<span class="terminal-path">{{ path }}</span>
		</div>
		<div class="header-line">
			<span class="terminal-prompt">❯</span>
		</div>
		<div class="header-line">
			<span class="terminal-command">{{ command }}</span>
		</div>
	</div>
</template>

<script>
/**
 * Terminal header component displaying prompt line
 * @component
 */
export default {
	name: 'TerminalHeader',
	props: {
		/** @type {string} Terminal path to display */
		path: {
			type: String,
			default: '~/code/go',
		},
		/** @type {string} Command to display */
		command: {
			type: String,
			default: '# 2011 - начало моей карьеры',
		},
	},
};
</script>

<style scoped>
.terminal-header {
	margin-bottom: var(--spacing-md);
}

.header-line {
	display: flex;
	gap: var(--spacing-sm);
	align-items: center;
}

.terminal-apple {
	color: var(--color-white);
	font-size: var(--font-size-icon-apple);
}

.terminal-path {
	color: var(--color-accent-blue);
}

.terminal-prompt {
	color: var(--color-accent-green);
}

.terminal-command {
	color: var(--color-text-primary);
}
</style>
