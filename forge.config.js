const path=require('path')

module.exports = {
    "make_targets": {
        "win32": [
          "squirrel"
        ]
    }
    ,
    "electronPackagerConfig": {
        "asar": false,
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
