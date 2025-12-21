import { ref } from 'vue';

/**
 * Command history navigation composable
 * @param {import('vue').Ref<string[]>} commandHistory - Command history array
 * @returns {Object} Navigation methods and state
 */
export function useCommandHistory(commandHistory) {
	const historyIndex = ref(-1);
	const currentInput = ref('');
	const savedInput = ref(''); // Saves current input when navigating

	/**
	 * Navigate up in history (older commands)
	 */
	const navigateUp = () => {
		if (commandHistory.value.length === 0) return;

		if (historyIndex.value < commandHistory.value.length - 1) {
			// Save current input before first navigation
			if (historyIndex.value === -1) {
				savedInput.value = currentInput.value;
			}

			historyIndex.value++;
			currentInput.value =
				commandHistory.value[commandHistory.value.length - 1 - historyIndex.value];
		}
	};

	/**
	 * Navigate down in history (newer commands)
	 */
	const navigateDown = () => {
		if (historyIndex.value > 0) {
			historyIndex.value--;
			currentInput.value =
				commandHistory.value[commandHistory.value.length - 1 - historyIndex.value];
		} else if (historyIndex.value === 0) {
			// Restore saved input
			historyIndex.value = -1;
			currentInput.value = savedInput.value;
		}
	};

	/**
	 * Reset navigation state
	 */
	const reset = () => {
		historyIndex.value = -1;
		savedInput.value = '';
	};

	return {
		currentInput,
		historyIndex,
		navigateUp,
		navigateDown,
		reset,
	};
}
