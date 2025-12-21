import { ref } from 'vue';

/**
 * Terminal state management composable
 * @returns {Object} Terminal state and methods
 */
export function useTerminalState() {
	const outputHistory = ref([]);
	const commandHistory = ref([]);
	const currentPath = ref('~/code/go');

	/**
	 * Add command and output to history
	 * @param {string} command - Command string
	 * @param {string|Object} output - Output content
	 * @param {'typed'|'static'|'component'|'clear'} renderType - Render type
	 * @param {string|null} renderComponent - Component name for type='component'
	 */
	const addToHistory = (command, output, renderType = 'typed', renderComponent = null) => {
		const entry = {
			id: `cmd_${Date.now()}`,
			command,
			prompt: currentPath.value,
			output,
			renderType,
			renderComponent,
			timestamp: Date.now(),
			isAnimating: renderType === 'typed',
			animationComplete: false,
		};

		outputHistory.value.push(entry);

		// Add to command history for navigation
		if (command.trim()) {
			commandHistory.value.push(command);
		}
	};

	/**
	 * Clear output history
	 */
	const clearHistory = () => {
		outputHistory.value = [];
	};

	/**
	 * Mark animation as complete for specific entry
	 * @param {string} entryId - Entry ID
	 */
	const markAnimationComplete = (entryId) => {
		const entry = outputHistory.value.find((e) => e.id === entryId);
		if (entry) {
			entry.isAnimating = false;
			entry.animationComplete = true;
		}
	};

	return {
		outputHistory,
		commandHistory,
		currentPath,
		addToHistory,
		clearHistory,
		markAnimationComplete,
	};
}
