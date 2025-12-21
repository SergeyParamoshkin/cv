<template>
	<div class="terminal-output">
		<!-- Welcome message -->
		<div v-if="showWelcome" class="welcome-message">
			<pre class="ascii-art">
    ____                                        _     _    _
   |  _ \ __ _ _ __ __ _ _ __ ___   ___  ___| |__ | | _(_)_ __
   | |_) / _` | '__/ _` | '_ ` _ \ / _ \/ __| '_ \| |/ / | '_ \
   |  __/ (_| | | | (_| | | | | | | (_) \__ \ | | |   &lt;| | | | |
   |_|   \__,_|_|  \__,_|_| |_| |_|\___/|___/_| |_|_|\_\_|_| |_|

   ____
  / ___|  ___ _ __ __ _  ___ _   _
  \___ \ / _ \ '__/ _` |/ _ \ | | |
   ___) |  __/ | | (_| |  __/ |_| |
  |____/ \___|_|  \__, |\___|\__, |
                  |___/      |___/</pre
			>
			<div class="welcome-text">
				<p class="welcome-hint">
					Type <span class="command-highlight">'help'</span> to see available commands
				</p>
			</div>
		</div>

		<!-- История команд -->
		<template v-for="entry in history" :key="entry.id">
			<div class="output-command-line">
				<span class="terminal-apple">
					<font-awesome-icon :icon="['fab', 'apple']" />
				</span>
				<span class="prompt">{{ entry.prompt }}</span>
				<span class="prompt-arrow">❯</span>
				{{ entry.command }}
			</div>
			<OutputLine
				:content="entry.output"
				:type="entry.renderType"
				:render-component="entry.renderComponent"
				@complete="$emit('animation-complete', entry.id)"
			/>
		</template>
	</div>
</template>

<script>
import OutputLine from './OutputLine.vue';

/**
 * Terminal output component - renders history
 * @component
 */
export default {
	name: 'TerminalOutput',
	components: {
		OutputLine,
	},
	props: {
		/** @type {Array} Output history */
		history: {
			type: Array,
			required: true,
		},
		/** @type {boolean} Show welcome message */
		showWelcome: {
			type: Boolean,
			default: true,
		},
	},
	emits: ['animation-complete'],
};
</script>

<style scoped>
.terminal-output {
	margin-bottom: var(--spacing-md);
}

/* Welcome message styling */
.welcome-message {
	margin-bottom: var(--spacing-lg);
}

.ascii-art {
	color: var(--color-accent-green);
	font-size: 0.75em;
	line-height: 1.1;
	margin: 0;
	overflow-x: auto;
}

@media (max-width: 768px) {
	.ascii-art {
		font-size: 0.5em;
	}
}

@media (max-width: 480px) {
	.ascii-art {
		font-size: 0.4em;
		line-height: 1.05;
	}
}

.welcome-text {
	margin-top: var(--spacing-md);
	line-height: 1.8;
}

.welcome-hint {
	color: var(--color-text-primary);
}

.command-highlight {
	color: var(--color-accent-green);
	font-weight: bold;
	background: rgba(106, 190, 48, 0.1);
	padding: 2px 6px;
	border-radius: 3px;
}

.output-command-line {
	margin-top: var(--spacing-md);
	color: var(--color-text-primary);
	display: flex;
	gap: var(--spacing-sm);
	align-items: center;
}

.output-command-line .terminal-apple {
	color: var(--color-white);
	font-size: var(--font-size-icon-apple);
}

.output-command-line .prompt {
	color: var(--color-accent-blue);
}

.output-command-line .prompt-arrow {
	color: var(--color-accent-green);
}
</style>
