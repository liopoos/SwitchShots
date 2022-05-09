import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueElectron from 'vue-electron'
import fetch from './request'
import model from './model'

const fileTools = require('./utils/filetools');
const helpers = require('./utils/helpers');

Vue.config.productionTip = false;
Vue.prototype.$ft = fileTools;
Vue.prototype.$help = helpers;
Vue.prototype.$fetch = fetch;
Vue.prototype.$model = model;

Vue.use(VueElectron);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
