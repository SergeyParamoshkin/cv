<template>
	<div class="hello">
		<span class="apple">
			<font-awesome-icon v-bind:icon="['fab', 'apple']" />
		</span>
		<span class="console">
			<font-awesome-icon icon="folder-open" />~/code/go
		</span>
		<span class="arrow">
			<font-awesome-icon icon="angle-right" />
		</span> tail -n +0 -f paradox_cv
		<br>
		<span class="typed" />
	</div>
</template>

<script>
import Typed from 'typed.js';

export default {
	name: 'CV',
	mounted() {
		const options = {
			strings: [
				'2011-05 - 2014-03 &emsp; > Specialist PCRS Support team<br>' +
				'2014-05 - 2016-03 &emsp; > Lead specialist PCRS Support team<br>' +
				'2016-03 - 2017-08 &emsp; > DevOps BigData team MTS Group<br>' +
				'2017-08 - 2018-12 &emsp; > Lead analyst PCRF development team PJSC MTS<br>' +
				'2018-12 - 2021-07 &emsp; > Team lead development team PJSC MTS<br>' +
				'2021-07 - 2022-03 &emsp; > Head of development team MTS Digital<br>' +
				'2022-03 - 2023-07 &emsp; > Technical manager in Yandex Team<br>' + 
				'2022-03 - &nbsp; current &emsp; > Technical manager in Yandex Cloud, IaaS Core team<br>'
			],
			typeSpeed: 20,
			backSpeed: 0,
		};
		new Typed('.typed', options);
	}
};
</script>

<style scoped>
ul {
	list-style-type: none;
	padding: 0;
}

li {
	margin: 0 10px;
}
</style>
