<template>
  <div class="dropzone dropzone-container">
    <v-container class="text-center" v-show="!convertList.length">
      <v-row align="center" id="dropzone"
             :class="{'dropzone-container': true, 'dropzone-hover': hoverClass}">
        <v-col>
          <v-btn text icon @click="chooseFilePath" :ripple="false">
            <v-icon size="65">
              mdi-image-plus
            </v-icon>
          </v-btn>
          <div class="dropzone-message mt-7">
            <p class="text-subtitle-2 font-italic ma-2 grey--text">{{ filePath || '拖动Album文件夹到这里或者点击图标选择' }}</p>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="convert-container pa-0" v-show="convertList.length">
      <v-row no-gutters>
        <v-col v-for="file in convertList" cols="4" :key="file.id">
          <v-img class="ma-2 rounded" :src="file.icon" :eager="true"
                 gradient="to top, rgba(0,0,0,.7) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 100%"
                 aspect-ratio="1" @click="openListDialog(file.list)">
            <div class="d-inline-flex flex-column-reverse fill-height" style="width: 100%">
              <p class="caption ma-1 text-right align-end white--text">{{ file.list.length }}张</p>
            </div>
            <template v-slot:placeholder>
              <v-row class="fill-height ma-2" align="center" justify="center">
                <v-img class="ma-2 rounded" :src="imagePlaceholder" aspect-ratio="1"></v-img>
              </v-row>
            </template>
          </v-img>
          <p class="text-center subtitle-2 text-no-wrap text-truncate cover-title">{{ file.name }}</p>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="fileDialog" max-width="600">
      <template>
        <v-card>
          <v-list dense flat>
            <v-list-item v-for="item in list" :key="item.file">
              <v-list-item-icon>
                <v-icon>{{ getFileExt(item.file) === 'mp4' ? 'mdi-video-box' : 'mdi-image' }}</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>{{ item.file }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-icon :color="item.status === 'success' ? 'green' : 'red'">
                  {{ item.status === 'success' ? 'mdi-check' : 'mdi-close' }}
                </v-icon>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>

<script>
// const fs = require('fs');
import logo_dark from '@/assets/images/ns_logo_outline_dark.png';
import logo from '@/assets/images/ns_logo_outline.png';

export default {
  name: "FileContent",
  data() {
    return {
      hoverClass: false,
      helperText: '',
      files: [],
      fileDialog: false,
      list: [],
    }
  },
  computed: {
    fileLen() {
      return this.$store.getters.file_list_len;
    },
    convertList() {
      return this.$store.getters.convert_array;
    },
    filePath() {
      return this.$store.getters.file_path;
    },
    imagePlaceholder() {
      return this.$vuetify.theme.dark ? logo : logo_dark;
    }
  },
  mounted() {
    const dragWrapper = document.getElementById('dropzone');
    let lastEnter = null; // 最后进入的拖拽元素
    dragWrapper.addEventListener('dragenter', (e) => {
      lastEnter = e.target;
      this.hoverClass = true;
    });
    dragWrapper.addEventListener('dragleave', (e) => {
      if (lastEnter === e.target) {
        this.hoverClass = false;
      }
    });
    dragWrapper.addEventListener('dragover', (e) => {
      e.preventDefault();
    });
    dragWrapper.addEventListener('drop', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.hoverClass = false;
      const files = e.dataTransfer.files;
      if (!files || files.length <= 0) {
        this.showErrorBar('读取文件夹错误');
        return;
      }

      const path = files[0].path;
      if (!this.checkPath(path)) {
        return;
      }

      this.$store.dispatch('setFilePath', path);
      this.files = this.filterFiles(path);
    })
  },
  methods: {
    chooseFilePath() {
      this.$electron.remote.dialog.showOpenDialog({
        title: '请选择Nintendo/Album文件夹',
        defaultPath: this.filePath,
        properties: ['openDirectory'],
        buttonLabel: '选择'
      }).then(path => {
        if (path.canceled) {
          return;
        }
        if (!this.checkPath(path.filePaths[0])) {
          return;
        }

        this.$store.dispatch('setFilePath', path.filePaths[0]);
        this.files = this.filterFiles(path.filePaths[0]);
      })
    },
    // 显示错误信息
    showErrorBar(text) {
      this.$help.showMessage(text);
    },
    // 验证文件夹路径
    checkPath(path) {
      if (!this.$ft.isFolder(path)) {
        this.showErrorBar('😑 这不是一个文件夹');
        return false;
      }

      if (!this.$ft.isNintendoAlbumFolder(path)) {
        this.showErrorBar('😑 请选择Nintendo/Album/*文件夹');
        return false;
      }

      return true;
    },
    // 筛选出有效的文件
    filterFiles(path) {
      let total = 0;
      let files = [];
      this.$ft.travel(path, (file) => {
        total++;
        if (this.$ft.isNintendoScreenShot(file)) {
          files.push(file);
        }
      })
      this.helperText = '已检索' + total + '个文件，待转换' + files.length + '个';
      this.$store.dispatch('setFileList', files);
      return files;
    },
    openListDialog(list) {
      this.list = list;
      this.fileDialog = true;
    },
    getFileExt(item) {
      return this.$ft.getFileExt(item);
    }
  }
}
</script>

<style scoped lang="scss">
.dropzone-container {
  height: 515px;
}

.convert-container {
  height: 510px;
  overflow: auto;
}

.dropzone-prevent {
  pointer-events: none;
}

.dropzone {
  border: 2px dashed #272727;
  border-radius: 5px;
}

.dropzone-button {
  cursor: pointer;
}

.dropzone-hover {
  background: rgba(100, 100, 100, 0.1);
}

.cover-shoot-chip {
  width: 100%;
  height: 100%;
}

.cover-title {
  width: 70%;
  margin-left: 15%;
}
</style>