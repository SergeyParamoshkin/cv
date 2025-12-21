<template>
	<div class="terminal-header">
		<span class="terminal-apple">
			<font-awesome-icon :icon="['fab', 'apple']" />
		</span>
		<span class="terminal-console"> <font-awesome-icon icon="folder-open" />{{ path }} </span>
		<span class="terminal-arrow">
			<font-awesome-icon icon="angle-right" />
		</span>
		{{ command }}
		<br />
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
			default: 'tail -n +0 -f paradox_cv',
		},
	},
};
</script>
