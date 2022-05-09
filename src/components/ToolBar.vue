<template>
  <div class="toolbar d-flex flex-column">
    <div class="toolbar-setting">
      <v-checkbox
          v-model="setting.keep_origin"
          class="mt-0"
          @change="saveSetting"
          label="保留原始截图"
      ></v-checkbox>
      <v-checkbox
          v-model="setting.keep_format"
          class="mt-0"
          @change="saveSetting"
          label="按文件类型分类"
      ></v-checkbox>
      <v-text-field
          outlined
          dense
          prepend-icon="mdi-folder"
          label="保存路径"
          readonly
          :hide-details="true"
          :value="setting.save_path"
          @click="chooseFilePath"
      ></v-text-field>
      <file-format/>
    </div>
    <game-database-updater/>
    <div class="toolbar-btn mt-auto">
      <v-btn block color="primary" :disabled="!fileLen || Boolean(process)" @click="startConvert"
             v-show="!isProcessDone">
        {{ btnText }}
      </v-btn>
      <v-btn block color="teal darken-2" @click="startNew" v-show="isProcessDone">开始新的转换
      </v-btn>
    </div>
  </div>
</template>

<script>
import path from "path";
import GameDatabaseUpdater from "./module/GameDatabaseUpdater";
import FileFormat from "./module/FileFormat";
import async from "async";
import assets from '../config/assets';

export default {
  name: "ToolBar",
  props: ['process'],
  components: {
    GameDatabaseUpdater, // 更新库
    FileFormat, // 文件格式
  },
  data() {
    return {
      main_folder: 'SwitchShots',
      convert_path: '',
      setting: {
        keep_origin: true,
        keep_format: false,
        save_path: '',
      },
      fail_files: [],
    }
  },
  created() {
    this.setting = this.$store.getters.setting;
  },
  computed: {
    fileLen() {
      return this.$store.getters.file_list_len;
    },
    isProcessDone() {
      return this.$store.getters.process_done;
    },
    btnText() {
      return process > 0 ? '正在转换' : ((this.setting.keep_origin ? '转换' : '转换并移动') + (this.fileLen ? this.fileLen + '个文件' : ''));
    }
  },
  methods: {
    chooseFilePath() {
      this.$electron.remote.dialog.showOpenDialog({
        title: '请选择一个保存路径',
        defaultPath: this.filePath + '../',
        properties: ['openDirectory', 'createDirectory'],
        buttonLabel: '选择'
      }).then(path => {
        this.setting.save_path = path.filePaths[0] || this.setting.save_path
        this.saveSetting();
      })
    },
    // 保存设置
    saveSetting() {
      this.$model.setting.setSetting(this.setting);
    },
    // 新的转换
    startNew() {
      this.$store.dispatch('setFileList', []); // 清除文件列表
      this.$store.dispatch('setConvertList', {}); // 清除转换列表
      this.$store.dispatch('setProcessDone', false);
      this.$store.dispatch('setFilePath', ''); // 清空文件路径
    },
    // 开始进行转换
    startConvert() {
      // 验证保存路径有效性
      if (!this.$ft.isFolderExisted(this.setting.save_path)) {
        this.$help.showMessage('保存路径无效');
        return;
      }
      // 创建应用主目录
      this.convert_path = path.join(this.setting.save_path, this.main_folder);
      if (!this.$ft.isFolderExisted(this.convert_path) && !this.$ft.createFolder(this.convert_path)) {
        this.$help.showMessage('创建主目录失败');
        return;
      }
      // 检查数据库版本
      if (!this.$model.game.getVersion()) {
        this.$help.showMessage('🙁 无GameTitleID文件，请点击「更新GAMETITLEID」进行更新');
        return;
      }

      // 定义队列
      const queue = async.queue((file, callback) => {
        setTimeout(() => {
          let convertList = this.$store.getters.convert_list;
          let rs = this.convertFile(file, convertList);
          let screenId = rs.screenId;
          let status = rs.status;
          // 如果screenId不为空才算成功
          if (screenId) {
            // 列表数push
            convertList[screenId].list.push({
              file,
              status: status ? 'success' : 'fail'
            });
          }
          if (!status) {
            this.fail_files.push(file);
          }
          this.$store.dispatch('setConvertList', convertList); // 本次队列的转换列表
          callback(convertList);
        }, 50)
      }, 1);

      // 计算进度条步进
      let step = 100 / this.$store.getters.file_list_len;
      let process = 0;

      this.$store.getters.file_list.forEach((file) => {
        queue.push(file, () => {
          // 执行当前任务完成后
          process += step;
          this.$emit('update:process', process);
        })
      })

      // 转换完成处理事件
      queue.drain = () => {
        this.$emit('update:process', 0);
        this.$store.dispatch('setProcessDone', true);
        let fail_num = this.fail_files.length;
        let text = '🎉 转换完成';
        this.$help.showMessage(text + (fail_num > 0 ? '，失败' + fail_num + '个，请点击封面图查看错误文件' : ''), 'green');
      }
    },
    // 转换文件
    convertFile(file, convertList) {
      // 取出文件名
      let fileName = this.$ft.getFileName(file);
      if (!fileName) {
        return {
          screenId: 0,
          status: false
        };
      }
      let screenId = this.$ft.getNintendoScreenShotId(fileName);
      // 检查转换列表中是否有数据
      let convertIds = Object.keys(convertList);
      if (convertIds.indexOf(screenId) < 0) {
        let gameData = this.$model.game.getGame(screenId);
        if (gameData) {
          convertList[gameData.id] = {
            id: gameData.id,
            name: gameData.name,
            icon: gameData.icon,
            list: []
          };
        } else {
          // 未知分类
          screenId = 'F34422BCDC47F03049914F8980595636'; // md5('hades')
          if (convertIds.indexOf(screenId) < 0) {
            convertList[screenId] = {
              id: screenId,
              name: '未知截图',
              icon: assets.switch_logo, // 未知分类截图
              list: []
            };
          }
        }
      }
      let gameName = convertList[screenId].name.replace(':', ' -');
      // 判断目标文件夹是否存在
      let sourcePath = path.join(this.convert_path, gameName);

      // 判断是否按文件类型分类
      let partByFileExt = this.setting.keep_format;
      if (partByFileExt) {
        let fileExt = this.$ft.getFileExt(file);
        sourcePath = path.join(sourcePath, fileExt);
      }

      // 创建目标文件夹
      if (!this.$ft.isFolderExisted(sourcePath)) {
        this.$ft.createFolder(sourcePath);
      }

      // 获取自定义文件名
      let newFileName = '';
      if (this.setting.custom_file_name) {
        newFileName = this.$ft.customFileName(this.setting.custom_file_name, fileName, gameName);
      }

      sourcePath = path.join(sourcePath, newFileName || fileName);

      // 开始复制或移动文件
      if (this.setting.keep_origin) {
        // 仅复制
        if (!this.$ft.copyFile(file, sourcePath)) {
          return {
            screenId: screenId,
            status: false
          };
        }
      } else {
        // 移动
        if (!this.$ft.moveFile(file, sourcePath)) {
          return {
            screenId: screenId,
            status: false
          };
        }
      }

      return {
        screenId: screenId,
        status: true
      };
    }
  }
}
</script>

<style scoped lang="scss">
.toolbar {
  margin: 0 10px;
  height: 100%;
}
</style>