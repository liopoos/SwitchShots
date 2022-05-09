import store from '../store/index';
import fetch from '../request';

const DOWNLOAD_URL = 'https://switch-proxy.vercel.app/games/gamedata.json';

// 显示错误弹窗
function showMessage(text, color = 'red darken-2') {
  store.dispatch('setSnackBar', {
    text,
    color: color + ' darken-2'
  }).then()
}

// 下载NS game database
function downloadNSGameTitles() {
  return fetch(DOWNLOAD_URL);
}

// 生成随机数
function getRandom(num = 5) {
  return Math.floor((Math.random() + Math.floor(Math.random() * 9 + 1)) * Math.pow(10, num - 1));
}

export {
  showMessage,
  downloadNSGameTitles,
  getRandom
}