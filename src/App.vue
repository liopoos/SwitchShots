<template>
  <v-app>
    <v-app-bar app flat dark>
      <v-spacer></v-spacer>
      <v-img
          max-height="18"
          max-width="18"
          :src="logo"
      ></v-img>
      <div class="s-header__title subtitle-1">SwitchShots</div>
      <v-spacer></v-spacer>
      <v-btn text icon @click="changeDarkOrLightMode">
        <v-icon>{{ setting.dark_mode ? 'mdi-brightness-4' : 'mdi-brightness-6' }}</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import assets from './config/assets';

export default {
  name: 'App',
  data() {
    return {
      logo: assets.app_logo,
      setting: this.$model.setting.getSetting()
    }
  },
  created() {
    this.$vuetify.theme.dark = this.setting.dark_mode;
    this.$store.dispatch('setSetting', this.setting);
  },
  methods: {
    // 打开或取消暗黑模式
    changeDarkOrLightMode() {
      this.setting.dark_mode = !this.setting.dark_mode;
      this.$vuetify.theme.dark = this.setting.dark_mode;
      this.$model.setting.setSetting(this.setting);
    }
  }
};
</script>

<style lang="scss">
::-webkit-scrollbar {
  display: none;
}

.v-toolbar__content {
  -webkit-app-region: drag;
}

body {
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  user-select: none;
}

.s-header__title {
  margin-left: 5px;
}
</style>
