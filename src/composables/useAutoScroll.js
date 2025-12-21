import { nextTick } from 'vue';

/**
 * Auto-scroll composable for terminal
 * @param {import('vue').Ref<HTMLElement>} scrollContainer - Scroll container ref
 * @returns {Object} Scroll methods
 */
export function useAutoScroll(scrollContainer) {
	/**
	 * Scroll to bottom of container
	 */
	const scrollToBottom = async () => {
		await nextTick();
		if (scrollContainer.value) {
			scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
		}
	};

	return {
		scrollToBottom,
	};
}
