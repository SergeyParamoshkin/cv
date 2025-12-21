<template>
	<Terminal />
</template>

<script>
import Terminal from './components/terminal/Terminal.vue';

export default {
	name: 'App',
	components: {
		Terminal,
	},
};
</script>

<style>
@import './styles/global.css';
@import './styles/utilities.css';
@import './styles/terminal.css';
</style>
