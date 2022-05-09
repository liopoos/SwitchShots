import Datastore from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import {app, remote} from 'electron'
import tables from "./model/tables";

const os = require('os');
const helper = require('./utils/helpers');
const isDevelopment = process.env.NODE_ENV !== 'production';

// 根据process.type来分辨在哪种模式使用哪种模块
const APP = process.type === 'renderer' ? remote.app : app
const STORE_PATH = APP.getPath('userData')
const USER_HOME = process.env.HOME || process.env.USERPROFILE || os.homedir()

if (process.type !== 'renderer') {
  if (!fs.pathExistsSync(STORE_PATH)) {
    fs.mkdirpSync(STORE_PATH)
  }
}

// 初始化lowdb读写的json文件名以及存储路径
const adapter = new FileSync(path.join(STORE_PATH, '/database.json'))
const db = Datastore(adapter)

const defaultSetting = {
  keep_origin: true, // 保留原始截图
  keep_format: false, // 按文件格式分类
  save_path: USER_HOME, // 保存路径
  dark_mode: true, // 是否是暗黑模式
  custom_file_name: '', // 自定义文件夹
};

// 初始化数据库
if (!db.has(tables.game).value()) {
  // 加载游戏数据
  let gameData = {};
  let gamePath = path.join(isDevelopment ? process.cwd() : process.resourcesPath, 'resources', 'gamedata.json');
  try {
    gameData = fs.readFileSync(gamePath, 'utf8');
    gameData = JSON.parse(gameData);
  } catch (error) {
    console.log(error);
    gameData = {};
  }
  // 如果本地数据加载失败从线上获取数据
  if (Object.keys(gameData).length === 0) {
    helper.downloadNSGameTitles().then((res) => {
      gameData = res.data;
      if (res.data.version) {
        defaultSetting.game_data_version = res.data.version;
        db.set(tables.game, gameData).write();
      }
    })
  } else {
    defaultSetting.game_data_version = gameData['version'];
    db.set(tables.game, gameData).write();
  }
}
// 加载设置
if (!db.has(tables.setting).value()) {
  db.set(tables.setting, defaultSetting).write();
} else {
  // 之后新增的设置条目需要添加
  let setting = db.get(tables.setting).value();
  let diff = Object.keys(defaultSetting).filter(function (key) {
    return Object.keys(setting).indexOf(key) === -1
  })
  // 填充正确的setting
  diff.forEach((key) => {
    setting[key] = defaultSetting[key];
  })
  db.set(tables.setting, setting).write();
}

export default db;