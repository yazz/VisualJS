function component( args ) {
/*
base_component_id("export_editor_component")
control_type("SYSTEM")
load_once_from_file(true)
*/

    Vue.component("export_editor_component", {
      data: function () {
        return {
            text:                args.text,
            read_only:           false,
            errors:              null,
            dockerHost:         "host.docker.internal",
            dockerPort:         "1234",
            dockerImageName:    "name/image"
        }
      },
      template: `<div style='background-color:white; ' >
                      <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px;padding-left: 15px;border: 4px solid lightgray;' >
                          <slot style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: inline-block;' v-if='text' :text2="text">
                          </slot>
                      </div>

                      <div style='border-radius: 5px;margin-left:15px;margin-top:15px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border: 4px solid lightgray; '>
                          <div    style='font-size:14px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 0px solid lightgray; padding:4px; margin:0;padding-left:14px;'>

                               Export Options
                          </div>

                            <div style="padding:10px; overflow:auto;height:65vh;">

                                <div style="height:600px">


                                    <h3>Save App as Docker Container</h3>

                                    <form onsubmit="return false;">
                                        <div class="form-group">
                                            <label for="docker_image_name">Docker Image Name</label>
                                            <input  type="" class="form-control"
                                                    v-model="dockerImageName"
                                                    id="docker_image_name"
                                                    placeholder="your_docker_id/image_name:version_tag" />
                                        </div>

                                        <div class="form-row">
                                            <div class="form-group col-md-6">
                                                <label for="docker_server">Docker Server Host</label>

                                                <input  type=""
                                                        v-model="dockerHost"
                                                        class="form-control" id="docker_server"
                                                        placeholder="host.docker.internal" />
                                            </div>


                                            <div class="form-group col-md-6">
                                                <label for="docker_port">Docker Port
                                                </label>

                                                <input  v-model="dockerPort"
                                                        class="form-control" id="docker_port" placeholder="1234" />
                                            </div>
                                        </div>
                                        </div>

                                        <button
                                                v-on:click="createDockerImage()"
                                                class="btn btn-primary">Create Docker Image
                                        </button>
                                    </form>
                                </div>




                                <div style="height:109px">

                                    <h3>Download App as HTML file</h3>

                                    <a          v-bind:href='location.protocol + "//" + location.hostname + ":" + location.port + "/app/yazz_" + base_component_id + ".html"'
                                                download
                                                v-bind:style="'float: left;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19); '"
                                                type="button"
                                                class="btn btn-light">

                                        <svg    xmlns="http://www.w3.org/2000/svg"
                                                xmlns:xlink="http://www.w3.org/1999/xlink"
                                                version="1.1" id="Capa_1"
                                                viewBox="0 0 29.978 29.978"
                                                style="enable-background:new 0 0 29.978 29.978;"
                                                xml:space="preserve"
                                                x="0px"
                                                y="0px"
                                                height="35px"
                                                width="35px">

                                            <path d="M25.462,19.105v6.848H4.515v-6.848H0.489v8.861c0,1.111,0.9,2.012,2.016,2.012h24.967c1.115,0,2.016-0.9,2.016-2.012   v-8.861H25.462z" fill="#006DF0" />
                                            <path d="M14.62,18.426l-5.764-6.965c0,0-0.877-0.828,0.074-0.828s3.248,0,3.248,0s0-0.557,0-1.416c0-2.449,0-6.906,0-8.723   c0,0-0.129-0.494,0.615-0.494c0.75,0,4.035,0,4.572,0c0.536,0,0.524,0.416,0.524,0.416c0,1.762,0,6.373,0,8.742   c0,0.768,0,1.266,0,1.266s1.842,0,2.998,0c1.154,0,0.285,0.867,0.285,0.867s-4.904,6.51-5.588,7.193   C15.092,18.979,14.62,18.426,14.62,18.426z" fill="#006DF0" />
                                        </svg>
                                        Download app as HTML
                                    </a>
                                </div>
                            </div>


                        <div>




                        </div>

                        <pre    v-on:click="gotoLine(errors.lineNumber)"
                                style="background:pink;color:blue;"
                                v-if="errors != null">Line {{errors.lineNumber}}: {{errors.description}}</pre>

                    </div>
                    <hr></hr>
                 </div>`
     ,

     mounted: function() {
         var thisVueInstance = this
         args.text           = null

         if (isValidObject(thisVueInstance.text)) {
             this.read_only = saveHelper.getValueOfCodeString(thisVueInstance.text, "read_only")
         }

         if (this.read_only) {
         }



     },
     methods: {



        // -----------------------------------------------------
        //                      getText
        //
        // This is called to get the SQL definitions
        //
        //
        //
        // -----------------------------------------------------
        getText: async function() {
            if (!isValidObject(this.text)) {
                return null
            }

            return this.text
        }
        ,



        // -----------------------------------------------------
        //                      setText
        //
        // This is called to set the SQL
        //
        //
        //
        // -----------------------------------------------------
        setText: function(textValue) {
            var thisVueInstance = this
            this.text           =  textValue

            if (!isValidObject(this.text)) {
                return
            }

            //
            //
            //


            this.read_only = saveHelper.getValueOfCodeString(thisVueInstance.text, "read_only")
            if (this.read_only) {
            }

        }
        ,



        // -----------------------------------------------------
        //                      createDockerImage
        //
        // This is called to create the app as a Docker image
        //
        //
        //
        // -----------------------------------------------------
        createDockerImage: async function() {
            alert("Creating Docker image "  + this.dockerImageName + " at "+ this.dockerHost + ":" + this.dockerPort)
            var result = await callFunction(
                                {
                                    driver_name: "serverDockerStuff",
                                    method_name: "serverDockerStuff"  }
                                    ,{
                                        create: true,
                                        image_name:   this.dockerImageName,
                                        host:   this.dockerHost,
                                        port:   this.dockerPort
                                     })

           //alert(JSON.stringify(result.value,null,2))
           if (result.value) {
                alert(JSON.stringify(   result.value  ,  null  ,  2   ))

           }
       }


     }


    })

}
