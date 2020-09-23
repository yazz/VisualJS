function(args) {
/*
is_app(true)
component_type("VB")
display_name("postgres client control")
description("This will return the postgres control")
base_component_id("postgres_client_component")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "sql",
            name:   "SQL",
            type:   "String",
            default: "SELECT * FROM pg_catalog.pg_tables;"
        }
        ,
        {
            id:      "user",
            name:    "USER",
            type:    "String",
            default_expression: "(typeof $POSTGRES_USER !== 'undefined')?eval('$POSTGRES_USER'):'postgres'"
        }
        ,
        {
            id:     "password",
            name:   "Password",
            password: true,
            type:   "String",
            default_expression: "(typeof $POSTGRES_PASSWORD !== 'undefined')?eval('$POSTGRES_PASSWORD'):'password'",
        }
        ,
        {
            id:     "database",
            name:   "Database",
            type:   "String",
            default_expression: "(typeof $POSTGRES_DATABASE !== 'undefined')?eval('$POSTGRES_DATABASE'):'postgres'",
        }
        ,
        {
            id:     "port",
            name:   "Port",
            type:   "Number",
            default_expression: "(typeof $POSTGRES_PORT !== 'undefined')?eval('$POSTGRES_PORT'):5432",
        }
        ,
        {
            id:     "host",
            name:   "Host",
            type:   "String",
            default_expression: "(typeof $POSTGRES_HOST !== 'undefined')?$POSTGRES_HOST:'localhost'",
        }
        ,
        {
            id:     "design_time_text",
            name:   "Design Time Text",
            type:   "String",
            help:       `<div>Help text for
                            <b>text</b> property
                         </div>`
        }

        ,
        {
            id:     "result",
            name:   "result",
            type:   "Array",
            default:    []
        }
        ,
        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
        ,
        {
            id:         "executeSql",
            pre_snippet: `await `,
            snippet:    `executeSql()`,
            name:       "executeSql",
            type:       "Action",
            help:       `<div>Help text for
                            <b>executeSql</b> function
                            <div>The SQL is store in the "sql" property</div>
                         </div>`
        }
        ,

        {
            id:         "getSchema",
            pre_snippet: `await `,
            snippet:    `getSchema()`,
            name:       "getSchema",
            type:       "Action",
            help:       `<div>Help text for
                            <b>getSchema</b> function
                         </div>`
        }
        ,

        {
            id:         "getDynamic",
            pre_snippet: `await `,
            snippet:    `getDynamic()`,
            name:       "getDynamic",
            type:       "Action",
            help:       `<div>Help text for
                            <b>getDynamic</b> function
                         </div>`
        }

    ]
)//properties
logo_url("/driver_icons/postgres.jpg")
*/

    Vue.component("postgres_client_component",{
        props: ["meta","args", "name","refresh", "design_mode"]
        ,
        template: `<div v-bind:style='"white-space:normal;height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    args["background_color"]  +  ";"'>
                                    <div v-if="design_mode">
                                    Postgres:

                                    <div class="form-group">



                                      <label for="col_input_host">Postgres Host</label>
                                      <input  type=text
                                              class="form-control"
                                              style="margin-bottom: 30px;"
                                              id=col_input_host
                                              name="col_input_host"
                                              required
                                              v-model:value='args.host'
                                              v-on:change="args.host = document.getElementById('col_input_host').value;"
                                              >
                                      </input>


                                      <label for="col_input_port">Postgres Port</label>
                                      <input  type=text
                                              class="form-control"
                                              style="margin-bottom: 30px;"
                                              id=col_input_port
                                              name="col_input_port"
                                              required
                                              v-model:value='args.port'
                                              v-on:change="args.port = document.getElementById('col_input_port').value;"
                                              >
                                      </input>



                                        <label for="col_input_port">Postgres Database</label>
                                        <input  type=text
                                                class="form-control"
                                                style="margin-bottom: 30px;"
                                                id=col_input_database
                                                name="col_input_database"
                                                required
                                                v-model:value='args.database'
                                                v-on:change="args.database = document.getElementById('col_input_database').value;"
                                                >
                                        </input>




                                      <label for="col_input_user_name">Postgres Username</label>
                                      <input  type=text
                                              class="form-control"
                                              style="margin-bottom: 30px;"
                                              id=col_input_user_name
                                              name="col_input_user_name"
                                              required
                                              v-model:value='args.user'
                                              v-on:change="args.user = document.getElementById('col_input_user_name').value;"
                                              >
                                      </input>



                                      <label for="col_input_password">Postgres password</label>
                                      <input  type=password
                                              class="form-control"
                                              style="margin-bottom: 30px;"
                                              id=col_input_password
                                              name="col_input_password"
                                              required
                                              v-model:value='args.password'
                                              v-on:change="args.password = document.getElementById('col_input_password').value;"
                                              >
                                      </input>


                                  </div>


                                    </div>
                                    <div v-else>
                                    Postgres:
                                                POSTGRES LIVE
                                    </div>
                 </div>`
        ,
        data: function() {
            return {
                design_time_text:   "",
                design_detail_tab:  "connection"
            }
        }
        ,
        watch: {
          // This would be called anytime the value of the input changes
          refresh(newValue, oldValue) {
              if (isValidObject(this.args)) {
                  this.design_time_text = this.args.design_time_text
              }
          }
        },
        mounted: async function() {
            registerComponent(this)

            if (this.design_mode) {
            } else {

            }
        }
        ,
        methods: {
            getSchema: async function() {
                return null
            }
            ,
            executeSql: async function() {
                if (!this.design_mode) {
                    var result = await callFunction(
                                        {
                                            driver_name: "postgres_server",
                                            method_name: "postgres_sql"  }
                                            ,{
                                                sql:             this.args.sql,
                                                user:            this.args.user,
                                                password:        this.args.password,
                                                database:        this.args.database,
                                                host:            this.args.host,
                                                port:            this.args.port
                                             })


                   //alert("executeSql: " + JSON.stringify(result,null,2))
                   console.log(JSON.stringify(result,null,2))
                   if (result) {
                        this.args.result = result.result

                        return result
                   }


               }
                this.args.result = []
                this.changedFn()
                return {}
            }
            ,
            changedFn: function() {
                if (isValidObject(this.args)) {
                    //this.args.text = this.text
                }
            }


            ,
            getDynamic: function() {
                debugger
                return "dynamic return for pg"
            }


        }
    })
}
