<template>
	<CVComponent msg="Sergey Paramoshkin" />
</template>

<script>
import CVComponent from './components/CV.vue';

export default {
	name: 'App',
	components: {
		CVComponent,
	},
};
</script>

<style>
@import './styles/global.css';
@import './styles/utilities.css';
</style>
