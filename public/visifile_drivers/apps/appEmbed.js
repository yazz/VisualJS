async function(args) {
/*
is_app(true)
display_name("Embed an app in your site")
description("This will return the app embedder app")
base_component_id("appEmbed")
hide_header(true)
load_once_from_file(true)
*/

    var argBaseComponentId = args.base_component_id

    Vue.component("app_embed",
    {
      template: `<div>
                    <div>
                        <h2  class='caption' style='display: inline-block;'>Embedding {{app_component_name}} </h2>
                    </div>
                    <div  v-if="!base_component_id">
                        A component must be selected to embed

                    </div>

                    <div v-if="base_component_id">
                        Copy and paste the following code into your webpage to embed this widget:

                        <br><br>

                        <code>
                            &lt;iframe width="600"
                                    height="500"
                                    src="{{embed_code}}"
                                    scrolling="no"
                                    marginheight="0"
                                    marginwidth="0"&gt;&lt;/iframe&gt;
                        </code>

                        <br><br>
                        <br><br>


                        Or directly link to the app with:

                        <br><br>
                        <code>
                            {{embed_code}}
                        </code>

                        <br><br>

                        From this link you can select "Save As ..." and download and run the application on your PC
                    </div>
      </div>
       `
       ,
       data: function() {
           return {
               app_component_name:  null,
               base_component_id:   null,
               embed_code: ""
           }
       }


       ,


       methods: {
               }



       ,


       mounted: async function () {
           var mm = this
           mm.base_component_id = argBaseComponentId
           if (argBaseComponentId) {

                  var sql =    "select  display_name as name from  system_code  where " +
                               "        component_type = 'app' and base_component_id = '" + mm.base_component_id + "'" +
                               "        and code_tag = 'LATEST' "

                  //alert( sql )

                  var results = await callApp(
                      {
                           driver_name:    "systemFunctions2",
                           method_name:    "sql"
                      }
                      ,
                      {
                          sql: sql
                      })


                  if (results) {
                      //alert(JSON.stringify(results,null,2))
                      if (results.length > 0) {

                        mm.app_component_name = results[0].name
                      }
                  }




                  mm.embed_code = "http://" + location.hostname + ":" + location.port + "/app/" + mm.base_component_id + ".html"
            }
       }
   })
   return {name: "app_embed"}

}
