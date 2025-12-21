/**
 * Composable for formatting experience data
 * @returns {Object} Formatter functions
 */
export function useExperienceFormatter() {
	/**
	 * Formats a single position
	 * @param {Object} position - Position object
	 * @returns {string} Formatted string
	 */
	const formatPosition = (position) => {
		const { period, title, current } = position;
		const endDate = current ? 'current' : period.end;
		return `${period.start} - ${endDate.padEnd(10, ' ')}&emsp; > ${title}`;
	};

	/**
	 * Formats array of positions
	 * @param {Array} positions - Array of positions
	 * @returns {string} HTML formatted string
	 */
	const formatPositions = (positions) => {
		return positions.map(formatPosition).join('<br>');
	};

	return {
		formatPosition,
		formatPositions,
	};
}
