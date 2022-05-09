<template>
  <div>
    <div>
      <v-input prepend-icon="mdi-database" append-icon="mdi-information-outline"
               @click:append="info_dialog = !info_dialog"
               :messages="database_version || '无数据库文件，请点击更新按钮'">
        GAMETITLEID版本
      </v-input>
    </div>
    <div class="mt-3">
      <v-btn block outlined :loading="update_game_data" :disabled="update_game_data" @click="updateGameData">
        更新GAMETITLEID
        <v-icon right>
          mdi-update
        </v-icon>
      </v-btn>
    </div>
    <v-dialog v-model="info_dialog" width="500">
      <v-card>
        <v-card-title class="text-h6">
          关于GAMETITLEID
        </v-card-title>
        <v-card-text>
          NS的截图文件名格式为：时间随机数-GAMEID。GAMEID为加密过的32位字符串，并且唯一。GAMETITLEID数据库存储了GAMEID对应的游戏名称以及游戏封面图。
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "Updater",
  data() {
    return {
      update_game_data: false,
      database_version: this.$model.game.getVersion(),
      info_dialog: false
    }
  },
  methods: {
    // 更新游戏数据库
    updateGameData() {
      this.update_game_data = true;
      this.$help.downloadNSGameTitles().then((res) => {
        if (!this.database_version || res.data.version > this.database_version) {
          this.$model.game.setGame(res.data);
          this.database_version = res.data.version;
          this.$help.showMessage('🎉 数据库更新成功', 'green');
          return;
        }
        this.$help.showMessage('😬 数据库版本一致，暂无更新', 'orange');
      }).catch(() => {
        this.$help.showMessage('😭 数据库更新失败，请使用魔法');
      }).finally(() => {
        this.update_game_data = false;
      })
    }
  }
}
</script>

<style scoped>

</style>