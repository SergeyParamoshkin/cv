<template>
	<div class="terminal-container">
		<div ref="scrollContainer" class="terminal-scrollable">
			<TerminalOutput
				:history="outputHistory"
				:show-welcome="showWelcome"
				@animation-complete="onAnimationComplete"
			/>
		</div>

		<TerminalInput :command-history="commandHistory" @command="handleCommand" />
	</div>
</template>

<script>
import TerminalOutput from './TerminalOutput.vue';
import TerminalInput from './TerminalInput.vue';
import { useTerminalState } from '@/composables/useTerminalState';
import { useAutoScroll } from '@/composables/useAutoScroll';
import { commandProcessor } from '@/services/commandProcessor';
import { ref, onMounted } from 'vue';

/**
 * Main terminal component
 * @component
 */
export default {
	name: 'Terminal',
	components: {
		TerminalOutput,
		TerminalInput,
	},
	setup() {
		const { outputHistory, commandHistory, addToHistory, clearHistory } = useTerminalState();
		const scrollContainer = ref(null);
		const { scrollToBottom } = useAutoScroll(scrollContainer);
		const showWelcome = ref(true);
		const commandQueue = ref(['experience', 'skills', 'education', 'contact']);
		const currentCommandIndex = ref(-1);

		/**
		 * Handle command execution
		 * @param {string} cmd - Command string
		 */
		const handleCommand = (cmd) => {
			const result = commandProcessor.processCommand(cmd);

			if (!result) return;

			if (result.renderType === 'clear') {
				clearHistory();
				showWelcome.value = false;
			} else {
				addToHistory(cmd, result.output, result.renderType, result.renderComponent);
			}

			scrollToBottom();
		};

		/**
		 * Execute next command in queue
		 */
		const executeNextCommand = () => {
			currentCommandIndex.value++;
			if (currentCommandIndex.value < commandQueue.value.length) {
				const nextCmd = commandQueue.value[currentCommandIndex.value];
				handleCommand(nextCmd);
			}
		};

		/**
		 * Handle animation completion
		 * @param {string} entryId - Entry ID
		 */
		const onAnimationComplete = (entryId) => {
			console.log('Animation complete:', entryId);
			// Execute next command after animation completes
			setTimeout(() => {
				executeNextCommand();
			}, 500);
		};

		onMounted(() => {
			// Start auto-execution of commands
			setTimeout(() => {
				executeNextCommand();
			}, 1000);
		});

		return {
			outputHistory,
			commandHistory,
			scrollContainer,
			showWelcome,
			handleCommand,
			onAnimationComplete,
		};
	},
};
</script>

<style scoped>
.terminal-container {
	display: flex;
	flex-direction: column;
	height: 100vh;
	background-color: var(--color-bg-primary);
	overflow: hidden;
}

.terminal-scrollable {
	flex: 1;
	overflow-y: auto;
	padding: var(--spacing-md);
	padding-bottom: 100px;
}

/* Scrollbar styling */
.terminal-scrollable::-webkit-scrollbar {
	width: 8px;
}

.terminal-scrollable::-webkit-scrollbar-track {
	background: var(--color-bg-primary);
}

.terminal-scrollable::-webkit-scrollbar-thumb {
	background: #424242;
	border-radius: 4px;
}

.terminal-scrollable::-webkit-scrollbar-thumb:hover {
	background: #4e4e4e;
}

/* Mobile optimizations */
@media (max-width: 768px) {
	.terminal-scrollable {
		padding: var(--spacing-sm);
		padding-bottom: 120px;
	}
}

@media (max-width: 480px) {
	.terminal-container {
		height: 100dvh; /* Dynamic viewport height for mobile browsers */
	}

	.terminal-scrollable {
		padding: var(--spacing-xs);
		padding-bottom: 140px;
		font-size: 0.9em;
	}
}
</style>
