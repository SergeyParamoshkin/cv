<template>
	<span ref="typedElement" class="typed-output" :class="{ 'is-finished': finished }"></span>
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
		/** @type {boolean} Finish the animation immediately, showing the full text */
		skip: {
			type: Boolean,
			default: false,
		},
	},
	emits: ['complete'],
	data() {
		return {
			typed: null,
			finished: false,
		};
	},
	watch: {
		skip(value) {
			if (value) {
				this.finish();
			}
		},
	},
	mounted() {
		if (this.skip) {
			this.finish();
		} else {
			this.initTyped();
		}
	},
	beforeUnmount() {
		this.destroyTyped();
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
					this.finished = true;
					this.$emit('complete');
				},
			};
			this.typed = new Typed(this.$refs.typedElement, options);
		},
		destroyTyped() {
			if (this.typed) {
				this.typed.destroy();
				this.typed = null;
			}
		},
		/**
		 * Drop the animation and render the full text at once.
		 */
		finish() {
			if (this.finished) return;

			this.destroyTyped();
			this.$refs.typedElement.innerHTML = this.strings.join('');
			this.finished = true;
			this.$emit('complete');
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

/* The caret belongs to text still being typed, not to finished output. */
.typed-output.is-finished::after {
	content: none;
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
