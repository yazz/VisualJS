const path=require('path')

module.exports = {
    "make_targets": {
        "win32": [
          "squirrel"
        ]
    }
    ,
    "electronPackagerConfig": {
        "asar": true,
        "packageManager": "npm",
        "extraResources": [
          "src/",
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
