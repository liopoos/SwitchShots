<template>
  <div>
    <v-checkbox v-model="setting.custom_file_name" label="使用自定义文件名" @change="checkFileFormat"></v-checkbox>
    <v-select
        v-model="setting.custom_file_name"
        :items="fileNames"
        :disabled="!setting.custom_file_name"
        @change="changeFileFormat"
        dense
        label="自定义文件名"
        outlined
    ></v-select>
  </div>
</template>

<script>
export default {
  name: "FileFormat",
  data() {
    return {
      fileName: '',
      fileNames: [{
        text: '仅保留截图时间',
        value: 'time'
      }, {
        text: '游戏名称-截图时间',
        value: 'game+time'
      }, {
        text: '游戏名称-当前时间',
        value: 'game+now'
      }]
    }
  },
  computed: {
    setting() {
      return this.$store.getters.setting
    }
  },
  methods: {
    checkFileFormat() {
      this.setting.custom_file_name = this.setting.custom_file_name ? 'time' : '';
      this.changeFileFormat();
    },
    changeFileFormat() {
      this.$model.setting.setSetting(this.setting);
    }
  }
}
</script>

<style scoped>

</style>