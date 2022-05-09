import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg',
  },
  theme: {
    dark: false,
    themes: {
      light: {
        primary: '#409eff',
        secondary: '#2F2E31',
        accent: '#9c27b0',
        error: '#f44336',
        warning: '#ff5722',
        info: '#607d8b',
        success: '#4caf50'
      },
      dark: {
        primary: '#409eff',
        secondary: '#2F2E31',
        accent: '#409eff',
        error: '#FF443B',
        warning: '#FFD509',
        info: '#607d8b',
        success: '#4caf50'
      }
    }
  }
});
