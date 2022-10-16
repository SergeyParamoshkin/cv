import { createApp } from 'vue'
import App from './App.vue'

import { library } from '@fortawesome/fontawesome-svg-core';
import { faFolderOpen, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faApple } from '@fortawesome/free-brands-svg-icons';

library.add(faApple, faFolderOpen, faAngleRight);


createApp(App)
    .component('font-awesome-icon', FontAwesomeIcon)
    .mount('#app')

