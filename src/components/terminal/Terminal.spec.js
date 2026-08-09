import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Terminal from './Terminal.vue';

const AUTOPLAY_COMMANDS = ['experience', 'skills', 'education', 'contact'];

// font-awesome-icon is registered globally in main.js, which tests do not run.
const global = { stubs: { 'font-awesome-icon': true } };

describe('Terminal autoplay', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it('starts the autoplay with the first command typed', async () => {
		const wrapper = mount(Terminal, { global });

		expect(wrapper.vm.outputHistory).toHaveLength(0);

		await vi.advanceTimersByTimeAsync(700);

		expect(wrapper.vm.outputHistory).toHaveLength(1);
		expect(wrapper.vm.outputHistory[0].command).toBe(AUTOPLAY_COMMANDS[0]);
		expect(wrapper.vm.outputHistory[0].renderType).toBe('typed');
	});

	it('reveals every remaining command at once on a keypress', async () => {
		const wrapper = mount(Terminal, { global });
		await vi.advanceTimersByTimeAsync(700);

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
		await wrapper.vm.$nextTick();

		const commands = wrapper.vm.outputHistory.map((entry) => entry.command);
		expect(commands).toEqual(AUTOPLAY_COMMANDS);

		// Everything the visitor has not seen yet is rendered without animation.
		const skipped = wrapper.vm.outputHistory.slice(1);
		expect(skipped.every((entry) => entry.renderType === 'static')).toBe(true);
	});

	it('reveals everything on a pointer press as well', async () => {
		const wrapper = mount(Terminal, { global });
		await vi.advanceTimersByTimeAsync(700);

		window.dispatchEvent(new Event('pointerdown'));
		await wrapper.vm.$nextTick();

		expect(wrapper.vm.outputHistory).toHaveLength(AUTOPLAY_COMMANDS.length);
	});

	it('gives every entry a distinct key when skipping within one millisecond', async () => {
		const wrapper = mount(Terminal, { global });
		await vi.advanceTimersByTimeAsync(700);

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
		await wrapper.vm.$nextTick();

		const ids = wrapper.vm.outputHistory.map((entry) => entry.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('hides the skip hint once the autoplay is over', async () => {
		const wrapper = mount(Terminal, { global });
		await vi.advanceTimersByTimeAsync(700);

		expect(wrapper.find('.skip-hint').exists()).toBe(true);

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
		await wrapper.vm.$nextTick();

		expect(wrapper.find('.skip-hint').exists()).toBe(false);
	});

	it('stops queueing more output after the autoplay was skipped', async () => {
		const wrapper = mount(Terminal, { global });
		await vi.advanceTimersByTimeAsync(700);

		window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
		await wrapper.vm.$nextTick();

		// Any animation finishing late must not append the queue a second time.
		wrapper.vm.onAnimationComplete('cmd_1');
		await vi.advanceTimersByTimeAsync(2000);

		expect(wrapper.vm.outputHistory).toHaveLength(AUTOPLAY_COMMANDS.length);
	});
});
