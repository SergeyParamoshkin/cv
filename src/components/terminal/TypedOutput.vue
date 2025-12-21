<template>
	<span ref="typedElement" class="typed-output"></span>
</template>

<script>
import Typed from 'typed.js';

/**
 * Typed animation output component
 * @component
 */
export default {
	name: 'TypedOutput',
	props: {
		/** @type {string[]} Array of strings to type */
		strings: {
			type: Array,
			required: true,
		},
		/** @type {number} Typing speed in milliseconds */
		typeSpeed: {
			type: Number,
			default: 15,
		},
	},
	emits: ['complete'],
	data() {
		return {
			typed: null,
		};
	},
	mounted() {
		this.initTyped();
	},
	beforeUnmount() {
		if (this.typed) {
			this.typed.destroy();
		}
	},
	methods: {
		initTyped() {
			const options = {
				strings: this.strings,
				typeSpeed: this.typeSpeed,
				backSpeed: 0,
				showCursor: false,
				fadeOut: false,
				loop: false,
				contentType: 'html',
				onComplete: () => {
					this.$emit('complete');
				},
			};
			this.typed = new Typed(this.$refs.typedElement, options);
		},
	},
};
</script>

<style scoped>
.typed-output {
	display: inline-block;
}

.typed-output::after {
	content: '▋';
	animation: blink 1s step-end infinite;
	margin-left: var(--spacing-xs);
}

@keyframes blink {
	0%,
	50% {
		opacity: 1;
	}
	51%,
	100% {
		opacity: 0;
	}
}
</style>
