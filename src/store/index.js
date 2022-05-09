import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  setting: {}, // 设置
  process_done: 0, // 任务是否完成
  file_path: '', // 选择的文件列表
  file_list: [], // 待转换文件列表
  convert_list: {}, // 转换列表
  snack_bar: {
    status: false,
    color: 'red',
    text: 'Error'
  }, // 提示弹窗
};

const getters = {
  setting: state => state.setting,
  process_done: state => state.process_done,
  convert_list: state => state.convert_list,
  convert_array: state => {
    return Object.values(state.convert_list);
  },
  file_path: state => state.file_path,
  file_list: state => state.file_list,
  file_list_len: state => {
    if (!state.file_list) {
      return 0;
    }
    return state.file_list.length;
  },
  snack_bar: state => state.snack_bar,
}

const mutations = {
  SET_PROCESS_DONE(state, value) {
    state.process_done = value;
  },
  SET_SNACK_BAR(state, value) {
    if (value.text) {
      value.status = true;
    }
    state.snack_bar = value;
  },
  SET_SETTING(state, value) {
    state.setting = value;
  },
  SET_FILE_LIST(state, value) {
    state.file_list = value;
  },
  SET_FILE_PATH(state, value) {
    state.file_path = value;
  },
  SET_CONVERT_LIST(state, value) {
    if (!Object.keys(value).length) {
      state.convert_list = Object.assign({});
    }
    state.convert_list = Object.assign({}, state.convert_list, value);
    // Vue.set(state, 'convert_list', value);
  },
};

const actions = {
  setProcessDone({commit}, data) {
    commit('SET_PROCESS_DONE', data);
  },
  setSnackBar({commit}, data) {
    commit('SET_SNACK_BAR', data);
  },
  setSetting({commit}, value) {
    commit('SET_SETTING', value);
  },
  setFilePath({commit}, value) {
    commit('SET_FILE_PATH', value);
  },
  setFileList({commit}, value) {
    commit('SET_FILE_LIST', value);
  },
  setConvertList({commit}, value) {
    commit('SET_CONVERT_LIST', value);
  },
};


export default new Vuex.Store({
  getters,
  state,
  mutations,
  actions,
  modules: {}
})
