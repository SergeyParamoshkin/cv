<template>
	<div class="terminal-input-container">
		<div class="terminal-input-line">
			<span class="terminal-apple">
				<font-awesome-icon :icon="['fab', 'apple']" />
			</span>
			<span class="prompt">~/code/go</span>
			<span class="prompt-arrow">❯</span>
			<input
				ref="input"
				v-model="currentInput"
				placeholder="Type 'help' for commands..."
				autofocus
				@keydown.enter="submit"
				@keydown.up.prevent="navigateUp"
				@keydown.down.prevent="navigateDown"
			/>
		</div>
	</div>
</template>

<script>
import { toRef } from 'vue';
import { useCommandHistory } from '@/composables/useCommandHistory';

/**
 * Terminal input component with command history navigation
 * @component
 */
export default {
	name: 'TerminalInput',
	props: {
		/** @type {Array<string>} Command history array */
		commandHistory: {
			type: Object,
			required: true,
		},
	},
	emits: ['command'],
	setup(props, { emit }) {
		const { currentInput, navigateUp, navigateDown, reset } = useCommandHistory(
			toRef(props, 'commandHistory')
		);

		/**
		 * Submit command
		 */
		const submit = () => {
			if (currentInput.value.trim()) {
				emit('command', currentInput.value);
				currentInput.value = '';
				reset();
			}
		};

		return {
			currentInput,
			submit,
			navigateUp,
			navigateDown,
		};
	},
};
</script>

<style scoped>
.terminal-input-container {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: var(--color-bg-primary);
	border-top: 1px solid #333;
	padding: var(--spacing-md);
	max-width: var(--max-width-content);
	z-index: 100;
}

.terminal-input-line {
	display: flex;
	align-items: center;
	gap: var(--spacing-sm);
}

.terminal-input-line .terminal-apple {
	color: var(--color-white);
	font-size: var(--font-size-icon-apple);
}

.terminal-input-line input {
	flex: 1;
	background: transparent;
	border: none;
	color: var(--color-text-primary);
	font-family: var(--font-mono);
	font-size: var(--font-size-base);
	outline: none;
}

.terminal-input-line input::placeholder {
	color: #666;
}

.prompt {
	color: var(--color-accent-blue);
}

.prompt-arrow {
	color: var(--color-accent-green);
}

/* Mobile optimizations */
@media (max-width: 768px) {
	.terminal-input-container {
		padding: var(--spacing-sm);
	}
}

@media (max-width: 480px) {
	.terminal-input-container {
		padding: var(--spacing-xs);
	}

	.terminal-input-line input {
		font-size: 16px; /* Prevents iOS zoom on focus */
	}

	.prompt {
		font-size: 0.9em;
	}

	.terminal-apple {
		font-size: 0.9em !important;
	}
}
</style>
