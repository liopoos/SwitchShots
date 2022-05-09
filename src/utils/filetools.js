const fs = require('fs');
const path = require('path');
const helper = require('./helpers');

// 遍历文件夹
function travel(dir, callback) {
  fs.readdirSync(dir).forEach((file) => {
    const path_name = path.join(dir, file)
    if (fs.statSync(path_name).isDirectory()) {
      travel(path_name, callback)
    } else {
      callback(path_name)
    }
  })
}

// 是否是文件夹
function isFolder(path_name) {
  const stat = fs.lstatSync(path_name);
  return stat.isDirectory();
}

// 是否是switch的文件夹格式
function isNintendoAlbumFolder(path_name) {
  const search = path_name.search(/Nintendo\/Album/i);
  return search >= 0;
}

// 是否是switch的截图格式
function isNintendoScreenShot(path_name) {
  const search = path_name.search(/\d{16}-[A-Z0-9]{32}\.(jpg|mp4)$/i);
  return search >= 0;
}

// 同步判断文件夹是否存在
function isFolderExisted(path_name) {
  try {
    fs.accessSync(path_name);
    return true;
  } catch (error) {
    return false;
  }
}

// 获取switch截图ID
function getNintendoScreenShotId(file_name) {
  let screen = file_name.match(/[A-Z0-9]{32}(?=\.(jpg|mp4)$)/i);
  return screen[0];
}

// 同步创建文件夹
function createFolder(path_name) {
  try {
    fs.mkdirSync(path_name, {recursive: true});
    return true;
  } catch (error) {
    return false;
  }
}

// 获取文件名
function getFileName(path_name) {
  try {
    return path.basename(path_name);
  } catch (error) {
    return '';
  }
}

// 获取文件扩展名
function getFileExt(path_name) {
  try {
    return path.extname(path_name).replace('.', '');
  } catch (error) {
    return '';
  }
}

// 同步删除文件
function remove(path_name) {
  try {
    fs.unlinkSync(path_name);
    return true;
  } catch (error) {
    return false;
  }
}

// 同步复制文件
function copyFile(origin_path, source_path) {
  try {
    fs.writeFileSync(source_path, fs.readFileSync(origin_path));
    return true;
  } catch (error) {
    return false;
  }
}

// 同步移动文件
function moveFile(origin_path, source_path) {
  if (copyFile(origin_path, source_path)) {
    return remove(origin_path);
  }

  return false;
}

// 自定义文件名
function customFileName(file_type, file_name, game_name) {
  let fileExt = path.extname(file_name) // 扩展名
  file_name = path.basename(file_name, fileExt); // 文件名
  const time = (file_name) => {
    return file_name.split('-').shift();
  }

  const now = () => {
    let date = new Date();
    return date.getTime() + helper.getRandom();
  }

  const game = (game_name) => {
    return game_name;
  }

  let type = file_type.split('+');
  let name = [];
  type.forEach((t) => {
    switch (t) {
      case 'time':
        name.push(time(file_name));
        break;
      case 'game':
        name.push(game(game_name));
        break;
      case 'now':
        name.push(now());
        break;
      default:
        name.push(file_name);
    }
  })

  return name.join('-') + fileExt;
}


export {
  travel,
  isFolder,
  isNintendoAlbumFolder,
  isNintendoScreenShot,
  getNintendoScreenShotId,
  isFolderExisted,
  getFileName,
  getFileExt,
  createFolder,
  copyFile,
  moveFile,
  customFileName,
}