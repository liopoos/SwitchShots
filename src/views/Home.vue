<template>
  <div>
    <v-container>
      <v-row no-gutters>
        <v-col cols="12" sm="8">
          <file-content/>
        </v-col>
        <v-col cols="12" sm="4">
          <tool-bar v-bind:process.sync="processBar"/>
        </v-col>
      </v-row>
    </v-container>
    <v-progress-linear :value="processBar" color="white" v-show="processBar"></v-progress-linear>
    <v-snackbar v-model="snackBar.status" app :timeout="2000" :color="snackBar.color" dark>
      {{ snackBar.text }}
    </v-snackbar>
  </div>
</template>

<script>
import FileContent from '../components/FileContent'
import ToolBar from '../components/ToolBar'

export default {
  name: 'Home',
  data() {
    return {
      processBar: 0
    }
  },
  components: {
    FileContent,
    ToolBar
  },
  computed: {
    snackBar() {
      return this.$store.getters.snack_bar;
    }
  },
}
</script>
