module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        "appId": "com.hadesapp.switchshots",
        "productName": "SwitchShots",
        "directories": {
          "output": "build"
        },
        "extraResources": [{
          "from": "./resources/",
          "to": "resources",
          "filter": [
            "**/*"
          ]
        }],
        "mac": {
          "icon": "resources/icons/icon.icns"
        },
        "win": {
          "icon": "resources/icons/icon.ico"
        },
        "linux": {
          "icon": "resources/icons"
        },
        "dmg": {
          "contents": [
            {
              "x": 410,
              "y": 150,
              "type": "link",
              "path": "/Applications"
            },
            {
              "x": 130,
              "y": 150,
              "type": "file"
            }
          ]
        },
      }
    }
  },
  transpileDependencies: [
    'vuetify'
  ],
}
