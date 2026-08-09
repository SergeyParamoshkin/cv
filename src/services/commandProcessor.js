import experienceData from '@/data/experience.json';
import skillsData from '@/data/skills.json';
import contactData from '@/data/contact.json';
import educationData from '@/data/education.json';

/**
 * Escape a string for interpolation into HTML output.
 *
 * Command output is rendered with v-html, so echoing raw input back would let
 * whatever is typed into the prompt render as markup.
 * @param {string} value - Untrusted string
 * @returns {string}
 */
function escapeHtml(value) {
	return String(value).replace(
		/[&<>"']/g,
		(char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
	);
}

/**
 * Command result class
 */
class CommandResult {
	/**
	 * @param {Object} params
	 * @param {string|Object} params.output - Output content
	 * @param {'typed'|'static'|'component'|'clear'} params.renderType - Render type
	 * @param {string|null} params.renderComponent - Component name for type='component'
	 */
	constructor({ output, renderType = 'typed', renderComponent = null }) {
		this.output = output;
		this.renderType = renderType;
		this.renderComponent = renderComponent;
	}
}

/**
 * Base command class
 */
class Command {
	/**
	 * @param {string} name - Command name
	 * @param {string} description - Command description
	 * @param {Function} handler - Command handler function
	 */
	constructor(name, description, handler) {
		this.name = name;
		this.description = description;
		this.handler = handler;
	}

	/**
	 * Execute command
	 * @param {Array} args - Command arguments
	 * @returns {CommandResult}
	 */
	execute(args) {
		return this.handler(args);
	}
}

/**
 * Command registry
 */
const commandRegistry = new Map();

// Register commands
commandRegistry.set(
	'help',
	new Command('help', 'Display available commands', () => {
		const helpText = Array.from(commandRegistry.values())
			.map(
				(cmd) => `  <span class="command-name">${cmd.name.padEnd(12)}</span> - ${cmd.description}`
			)
			.join('<br>');

		return new CommandResult({
			output: `Available commands:<br><br>${helpText}`,
			renderType: 'typed',
		});
	})
);

commandRegistry.set(
	'experience',
	new Command('experience', 'Show work experience', () => {
		// Format experience data to string for typed animation
		const formatted = experienceData.positions
			.map((pos) => {
				const endDate = pos.current ? 'current' : pos.period.end;
				return `${pos.period.start} - ${endDate}  &emsp; > ${pos.title}`;
			})
			.join('<br>');

		return new CommandResult({
			output: formatted,
			renderType: 'typed',
		});
	})
);

commandRegistry.set(
	'skills',
	new Command('skills', 'Display technical skills', () => {
		// Format skills data to string for typed animation
		const formatted = skillsData.categories
			.map((category) => {
				const skillsList = category.skills
					.map((skill) => {
						const levelInfo = skill.level ? ` [${skill.level}]` : '';
						const yearsInfo = skill.years ? ` (${skill.years} years)` : '';
						return `  • ${skill.name}${levelInfo}${yearsInfo}`;
					})
					.join('<br>');
				return `<br><span class="skill-category">${category.name}:</span><br>${skillsList}`;
			})
			.join('<br>');

		return new CommandResult({
			output: formatted,
			renderType: 'typed',
		});
	})
);

commandRegistry.set(
	'contact',
	new Command('contact', 'Show contact information', () => {
		// Format contact data to string for typed animation
		const formatted = contactData.contacts
			.map((contact) => {
				return `  ${contact.label.padEnd(12)} : <a href="${contact.link}" class="contact-link">${contact.value}</a>`;
			})
			.join('<br>');

		return new CommandResult({
			output: formatted,
			renderType: 'typed',
		});
	})
);

commandRegistry.set(
	'education',
	new Command('education', 'Display educational background', () => {
		// Format education data to string for typed animation
		let formatted = '';

		if (educationData.degrees && educationData.degrees.length > 0) {
			formatted += educationData.degrees
				.map((deg) => {
					return `${deg.period.start} - ${deg.period.end}  &emsp; > ${deg.degree}<br>  ${deg.institution}`;
				})
				.join('<br><br>');
		}

		if (educationData.certifications && educationData.certifications.length > 0) {
			formatted += '<br><br><span class="skill-category">Certifications:</span><br>';
			formatted += educationData.certifications
				.map((cert) => {
					return `  • ${cert.name} - ${cert.issuer} (${cert.date})`;
				})
				.join('<br>');
		}

		return new CommandResult({
			output: formatted,
			renderType: 'typed',
		});
	})
);

commandRegistry.set(
	'download',
	new Command('download', 'Download CV as PDF', () => {
		// No PDF is published yet, so this deliberately renders no link at all -
		// a dead one is worse than an honest message.
		return new CommandResult({
			output:
				'A downloadable PDF is not published yet. Use <span class="command-name">contact</span> to reach me directly.',
			renderType: 'typed',
		});
	})
);

commandRegistry.set(
	'clear',
	new Command('clear', 'Clear terminal screen', () => {
		return new CommandResult({
			output: null,
			renderType: 'clear',
		});
	})
);

/**
 * Main command processor
 */
export class CommandProcessor {
	/**
	 * Process command string
	 * @param {string} commandString - Command to process
	 * @returns {CommandResult|null}
	 */
	processCommand(commandString) {
		const trimmed = commandString.trim();

		if (!trimmed) {
			return null;
		}

		const [commandName, ...args] = trimmed.split(' ');
		const command = commandRegistry.get(commandName.toLowerCase());

		if (!command) {
			return new CommandResult({
				output: `Command not found: <span class="error">${escapeHtml(commandName)}</span><br>Type 'help' for available commands.`,
				renderType: 'static',
			});
		}

		return command.execute(args);
	}

	/**
	 * Get list of available commands
	 * @returns {string[]}
	 */
	getAvailableCommands() {
		return Array.from(commandRegistry.keys());
	}

	/**
	 * Get command suggestions for partial input
	 * @param {string} partial - Partial command string
	 * @returns {string[]}
	 */
	getCommandSuggestions(partial) {
		const commands = this.getAvailableCommands();
		return commands.filter((cmd) => cmd.startsWith(partial.toLowerCase()));
	}
}

/**
 * Singleton instance
 */
export const commandProcessor = new CommandProcessor();
