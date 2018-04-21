const path        = require('path')
var isWin         = /^win/.test(process.platform);

module.exports = {
    "make_targets": {
        "win32": [
          "squirrel"
        ]
    }
    ,
    "electronPackagerConfig": {
        "asar": (isWin?true:false),// Mac OS X does not work with ASAR files
        "extendInfo": path.resolve(__dirname,"src/info.plist"),
        "packageManager": "npm",
        "extraResources": [
          "src/",
          "node_viewerjs",
          "public/"
        ],
        "icon": path.resolve(__dirname,"src/visifile.ico")
    }
    ,
    "electronRebuildConfig": {}
    ,
    "electronWinstallerConfig": {
        "setupIcon": path.resolve(__dirname,"src/visifile.ico")
    }
}
