const path=require('path')

module.exports = {
    "make_targets": {
        "win32": [
          "squirrel"
        ]
    }
    ,
    "electronPackagerConfig": {
        "packageManager": "npm",
        "extraResources": [
          "src/",
          "visifile/"
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
