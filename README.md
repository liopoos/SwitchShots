# SwitchShots

通过**SwitchShots**，你可以很方便的将 Switch 中杂乱的截图文件名按照游戏名称进行整理。该项目使用 [Electron](http://electron.atom.io/) 、[Vue2](https://vuejs.org/) 进行开发。

## 截图

![软件截图](https://raw.githubusercontent.com/mayuko2012/SwitchShots/master/screenshots/screenshots_windows.png)

## 原理

Switch 的截图文件名格式为：时间随机数 - GameID。GameID为加密过的32位字符串，并且唯一。

**SwitchShots** 将通过GameID 识别每一张截图的原始游戏名称并进行重命名。

## 安装

**通过 Release 版本安装**

- macOS：✅arm64  ✅x64

## 构建

**环境**

- 安装 [Node.js](https://nodejs.org/en/)
- 安装 [yarn](https://yarn.bootcss.com/)
- 在项目根目录下，运行`yarn install`安装依赖

**开发**

```bash
yarn electron:serve
```

**打包**

**SwitchShots** 基于 electron-builder 进行打包，可直接运行命令：

```bash
yarn electron:build
```

打包完成后，将在`项目根目录/build`中找到构建好的应用。

## 使用

将 `Nintendo/Album/*` 拖入到文件区或点击添加图标进行添加，等待识别后即可转换。转换后的文件将在 `设置的保存路径/SwitchShots`文件夹中。

### 选项

- 保留原始截图：勾选后将复制到目的路径中
- 按文件类型分类：是否将图片和视频放在单独的文件夹中
- 使用自定义文件名：是否重命名文件

### 更新GameTitleID

GameTitleID 数据库存储了 GameID 对应的游戏名称以及游戏封面图。如果转换的截图没有正确识别，建议通过「更新GameTitleID」按钮更新 GameTitleID。

## 版权

**SwitchShots** 是一个免费开源软件，基于 MIT 协议发布。
