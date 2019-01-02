// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App'
import Login from './components/login'
import router from './router.js';



//import { Button, Container } from 'element-ui';

//Vue.use(Button);
//Vue.use(Container);

//Vue.use(ElementUI);
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
    el: '#container_main',
    router,
    components: { App },
    template: '<App/>',
});
