<template>
	<div class="terminal-container">
		<div ref="scrollContainer" class="terminal-scrollable">
			<TerminalOutput
				:history="outputHistory"
				:show-welcome="showWelcome"
				:skip="skipAnimation"
				@animation-complete="onAnimationComplete"
			/>
		</div>

		<p v-if="autoplayRunning" class="skip-hint">Press any key to show everything at once</p>

		<TerminalInput :command-history="commandHistory" @command="handleCommand" />
	</div>
</template>

<script>
import TerminalOutput from './TerminalOutput.vue';
import TerminalInput from './TerminalInput.vue';
import { useTerminalState } from '@/composables/useTerminalState';
import { useAutoScroll } from '@/composables/useAutoScroll';
import { commandProcessor } from '@/services/commandProcessor';
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

const AUTOPLAY_COMMANDS = ['experience', 'skills', 'education', 'contact'];
const AUTOPLAY_START_DELAY = 600;
const AUTOPLAY_GAP = 250;

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
		const commandQueue = ref([...AUTOPLAY_COMMANDS]);
		const currentCommandIndex = ref(-1);
		const skipAnimation = ref(false);
		const autoplayDone = ref(false);
		let pendingTimeout = null;

		/** Autoplay is on screen only while it still has something to reveal. */
		const autoplayRunning = computed(() => !skipAnimation.value && !autoplayDone.value);

		/**
		 * Handle command execution
		 * @param {string} cmd - Command string
		 * @param {boolean} instant - Render without the typing animation
		 */
		const handleCommand = (cmd, instant = false) => {
			const result = commandProcessor.processCommand(cmd);

			if (!result) return;

			if (result.renderType === 'clear') {
				clearHistory();
				showWelcome.value = false;
			} else {
				const renderType = instant && result.renderType === 'typed' ? 'static' : result.renderType;
				addToHistory(cmd, result.output, renderType, result.renderComponent);
			}

			scrollToBottom();
		};

		/**
		 * Execute next command in queue
		 */
		const executeNextCommand = () => {
			currentCommandIndex.value++;
			if (currentCommandIndex.value < commandQueue.value.length) {
				handleCommand(commandQueue.value[currentCommandIndex.value]);
			} else {
				autoplayDone.value = true;
			}
		};

		/**
		 * Abandon the intro animation and reveal the rest of the autoplay at once.
		 *
		 * Typing the whole CV takes more than twenty seconds, which is far longer
		 * than a visitor will wait to find the contact details, so any interaction
		 * ends it.
		 */
		const skipAutoplay = () => {
			if (skipAnimation.value || autoplayDone.value) return;

			skipAnimation.value = true;
			clearTimeout(pendingTimeout);

			while (currentCommandIndex.value + 1 < commandQueue.value.length) {
				currentCommandIndex.value++;
				handleCommand(commandQueue.value[currentCommandIndex.value], true);
			}

			autoplayDone.value = true;
			scrollToBottom();
		};

		/**
		 * Handle animation completion
		 * @param {string} entryId - Entry ID
		 */
		const onAnimationComplete = () => {
			if (skipAnimation.value || autoplayDone.value) return;

			pendingTimeout = setTimeout(executeNextCommand, AUTOPLAY_GAP);
		};

		onMounted(() => {
			window.addEventListener('keydown', skipAutoplay);
			window.addEventListener('pointerdown', skipAutoplay);

			pendingTimeout = setTimeout(executeNextCommand, AUTOPLAY_START_DELAY);
		});

		onBeforeUnmount(() => {
			window.removeEventListener('keydown', skipAutoplay);
			window.removeEventListener('pointerdown', skipAutoplay);
			clearTimeout(pendingTimeout);
		});

		return {
			outputHistory,
			commandHistory,
			scrollContainer,
			showWelcome,
			skipAnimation,
			autoplayRunning,
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
	position: relative;
}

.terminal-scrollable {
	flex: 1;
	overflow-y: auto;
	padding: var(--spacing-md);
	padding-bottom: 100px;
}

.skip-hint {
	position: absolute;
	right: var(--spacing-md);
	bottom: 72px;
	margin: 0;
	font-size: 0.8em;
	opacity: 0.55;
	pointer-events: none;
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

	.skip-hint {
		display: none;
	}
}
</style>
