var allPaths = new Object()




function pathToString(pp) {
    var s = ""
    for (  var aa = 0  ;  aa < pp.length  ;  aa ++  ) {
        s += pp[aa]
        if (aa < pp.length -1) {
            s += "."
        }
    }
    return s
}





function addToPaths(path) {

    var cpath = pathToString(path)
    if (!allPaths[cpath]) {

        allPaths[cpath] = {
            count: 0,
            path: path
        }
    }

    allPaths[cpath].count ++
}




function isMap(o) {
    try {
        Map.prototype.has.call(o); // throws if o is not an object or has no [[MapData]]
        return true;
    } catch(e) {
        if (typeof o === 'object') {
            return true
        }
        return false;
    }
}



function findJsonPaths(currentPath,jsonNode) {
    addToPaths(currentPath)

    if (Array.isArray(jsonNode)) {
        //console.log("Found node: " )
        for (var k = 0 ; k < jsonNode.length ; k++) {

            //console.log("Key: " + k)
            var newPath = currentPath.concat(["[]"])
            findJsonPaths( newPath, jsonNode[k])
        }

    }  else if (isMap(jsonNode)) {
        var keys = Object.keys(jsonNode)
        //console.log("Found map:.. " + keys.length)
        for (var k = 0 ; k < keys.length ; k++) {

            //console.log("Key: " + keys[k])
            var newPath = currentPath.concat([keys[k]])

            findJsonPaths( newPath, jsonNode[keys[k]])
        }


    }  else if (typeof jsonNode === 'object') {
        //console.log("Found object: " )



    } else {
        //console.log("Found other: " + JSON.stringify(jsonNode,null,2))
    }
}





var a = {
  "services": {
    "service": [
      {
        "id": "2555417834325",
        "account_id": "2445582847204",
        "name": "API",
        "state": "incomplete",
        "system_name": "api",
        "backend_version": "1",
        "intentions_required": "false",
        "buyers_manage_apps": "true",
        "buyers_manage_keys": "true",
        "referrer_filters_required": "false",
        "custom_keys_enabled": "true",
        "buyer_key_regenerate_enabled": "true",
        "mandatory_app_key": "true",
        "buyer_can_select_plan": "false",
        "buyer_plan_change_permission": "request",
        "deployment_option": "hosted",
        "support_email": "a@b.com",
        "end_user_registration_required": "true",
        "metrics": {
          "metric": [
            {
              "id": "2555418407956",
              "name": "hits",
              "system_name": "hits",
              "friendly_name": "Hits",
              "service_id": "2555417834325",
              "description": "Number of API hits",
              "unit": "hit"
            },
            {
              "id": "2555418408699",
              "name": "SASASA",
              "system_name": "SASASA",
              "friendly_name": "aaa",
              "service_id": "2555417834325",
              "unit": "XS"
            }
          ],
          "method": [
            {
              "id": "2555418408700",
              "name": "hello",
              "system_name": "hello",
              "friendly_name": "jkjkjjkjkjk",
              "service_id": "2555417834325",
              "metric_id": "2555418407956"
            },
            {
              "id": "2555418408703",
              "name": "moo",
              "system_name": "moo",
              "friendly_name": "moo",
              "service_id": "2555417834325",
              "metric_id": "2555418407956"
            }
          ]
        }
      },
      {
        "id": "2555417834330",
        "account_id": "2445582847204",
        "name": "dsasd",
        "state": "incomplete",
        "system_name": "dsds",
        "backend_version": "1",
        "intentions_required": "false",
        "buyers_manage_apps": "true",
        "buyers_manage_keys": "true",
        "referrer_filters_required": "false",
        "custom_keys_enabled": "true",
        "buyer_key_regenerate_enabled": "true",
        "mandatory_app_key": "true",
        "buyer_can_select_plan": "false",
        "buyer_plan_change_permission": "request",
        "deployment_option": "hosted",
        "support_email": "a@b.com",
        "end_user_registration_required": "true",
        "metrics": {
          "metric": {
            "id": "2555418407980",
            "name": "hits",
            "system_name": "hits",
            "friendly_name": "Hits",
            "service_id": "2555417834330",
            "description": "Number of API hits",
            "unit": "hit"
          }
        }
      }
    ]
  }
}

function main() {




    findJsonPaths(  [], a)
    debugger
    console.log(JSON.stringify(allPaths,null,2))
}

main()
