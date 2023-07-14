function component( args ) {
/*
base_component_id("export_editor_component")
component_type("SYSTEM")
load_once_from_file(true)
*/

    Yazz.component( {
      data: function () {
        return {
            text:                args.text,
            read_only:           false,
            errors:              null,
            dockerHost:         "host.docker.internal",
            dockerPort:         "1234",
            dockerLocalPort:     "81",
            dockerLocalHost:     location.hostname,
            dockerImageName:    "name/image",
            outputText:         ""
        }
      },
      template:
`<div style='background-color:white; ' >
    <div style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-color: lightgray; padding: 5px;padding-left: 15px;border: 4px solid lightgray;' >

        <slot style='box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);display: inline-block;' v-if='text' :text2="text">
        </slot>
    </div>

    <div style='border-radius: 5px;margin-left:15px;margin-top:15px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);border: 4px solid lightgray; '>
        <div    style='font-size:14px;font-weight:bold;border-radius: 0px;box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);background-image: linear-gradient(to right,  #000099, lightblue); color: white; border: 0px solid lightgray; padding:4px; margin:0;padding-left:14px;'>

            Export Options

        </div>

        <div style="padding:10px; overflow:scroll;height:65vh;">

        <div style="height:100%;">

            <div style="height:200px;margin-top:40px;">
                <img src="/driver_icons/ducker.png"  style="width:100px;"></img>
                <a href="#export_as_docker">A) Export App as Docker Container</a>
            </div>

            <div style="height:200px;">
                <img src="/driver_icons/openshift.png"  style="width:100px;"></img>
                <a href="#export_as_openshift">B) Export App for OpenShift</a>
            </div>


            <div style="height:800px;">
            </div>



            <div id="export_as_docker"  style="height:950px;padding-top:50px;">
                <img src="/driver_icons/ducker.png"  style="width:100px;"></img>


                <h4 style="font-weight:bold;">A) Export App as Docker Container</h4>

                <div class="card">
                    <div class="card-body">
                        <h3>Docker engine details</h3>
                        <div class="form-row">
                            <div class="form-group col-md-9">
                                <label for="docker_server">
                                    Docker Server Host
                                </label>

                                <input  type=""
                                        v-model="dockerHost"
                                        class="form-control" id="docker_server"
                                        placeholder="host.docker.internal" />
                            </div>


                            <div class="form-group col-md-3">
                                <label for="docker_port">
                                    Docker Port
                                </label>

                                <input  v-model="dockerPort"
                                        class="form-control" id="docker_port" placeholder="1234" />
                            </div>
                        </div>

                    </div>
                </div>

                <div class="card" style="margin-top: 20px;">
                    <div class="card-body">
                        <h3>Exported Docker container details</h3>
                        <div class="form-group">
                            <label for="docker_image_name">
                                Docker Image Name
                            </label>

                            <input  type="" class="form-control"
                                    v-model="dockerImageName"
                                    id="docker_image_name"
                                    placeholder="your_docker_id/image_name:version_tag" />
                        </div>

                        <div class="form-row">
                            <div class="form-group col-md-9">
                                <label for="docker_local_host">
                                    App Local Host
                                </label>

                                <input  type=""
                                        readonly
                                        class="form-control"
                                        v-model="dockerLocalHost"
                                        id="docker_local_host"/>
                            </div>

                            <div class="form-group col-md-3">
                                <label for="docker_local_port">
                                    Docker Local App Port
                                </label>

                                <input  type=""
                                        class="form-control"
                                        v-model="dockerLocalPort"
                                        id="docker_local_port"
                                        />
                            </div>
                            <div    v-on:click='var win = window.open(location.protocol + "//" + networkIntranetIpAddress + ":" + dockerLocalPort, "_blank"); win.focus();'
                                    v-bind:style="'display:flex;text-decoration: underline;color:blue;padding: 5px; margin-top: 3px; position: relative; border: 0px;border-bottom: 4px solid lightsteelblue;margin-bottom:10px;'">
                                Shareable link:<input   readonly
                                                        style='flex:1;font-family:verdana,helvetica;font-size: 13px;margin-left:10px;'
                                                        v-bind:value='location.protocol + "//" + networkIntranetIpAddress + ":" + dockerLocalPort '>
                            </div>
                        </div>
                        <button v-on:click="createDockerImage()"
                                class="btn btn-primary">Create Docker Image
                        </button>
<pre style="height:200px;overflow:auto;margin-top:20px;background-color:lightgray;padding:15px;border-radius:7px;">{{outputText}}</pre>
                    </div>

                </div>


            </div>











            <div id="export_as_openshift"  style="height:950px;padding-top:50px;">
                <img src="/driver_icons/openshift.png"  style="width:100px;"></img>


                <h4 style="font-weight:bold;">B) Export App for OpenShift</h4>

                <div class="card">
                    <div class="card-body">
                        <h3>Docker engine details</h3>
                        <div class="form-row">
                            <div class="form-group col-md-9">
                                <label for="docker_server">
                                    OpenShift Server Host
                                </label>

                                <input  type=""
                                        v-model="dockerHost"
                                        class="form-control" id="docker_server"
                                        placeholder="host.docker.internal" />
                            </div>


                            <div class="form-group col-md-3">
                                <label for="docker_port">
                                    Docker Port
                                </label>

                                <input  v-model="dockerPort"
                                        class="form-control" id="docker_port" placeholder="1234" />
                            </div>
                        </div>

                    </div>
                </div>

                <div class="card" style="margin-top: 20px;">
                    <div class="card-body">
                        <h3>Exported OpenShift container details</h3>
                        <div class="form-group">
                            <label for="docker_image_name">
                                Quay Image Name
                            </label>

                            <input  type="" class="form-control"
                                    v-model="dockerImageName"
                                    id="docker_image_name"
                                    placeholder="your_docker_id/image_name:version_tag" />
                        </div>

                        <div class="form-row">
                            <div class="form-group col-md-9">
                                <label for="docker_local_host">
                                    App Local Host
                                </label>

                                <input  type=""
                                        readonly
                                        class="form-control"
                                        v-model="dockerLocalHost"
                                        id="docker_local_host"/>
                            </div>

                            <div class="form-group col-md-3">
                                <label for="docker_local_port">
                                    OpenShift Route App Port
                                </label>

                                <input  type=""
                                        class="form-control"
                                        v-model="dockerLocalPort"
                                        id="docker_local_port"
                                        />
                            </div>
                            <div    v-on:click='var win = window.open(location.protocol + "//" + networkIntranetIpAddress + ":" + dockerLocalPort, "_blank"); win.focus();'
                                    v-bind:style="'display:flex;text-decoration: underline;color:blue;padding: 5px; margin-top: 3px; position: relative; border: 0px;border-bottom: 4px solid lightsteelblue;margin-bottom:10px;'">
                                Shareable link:<input   readonly
                                                        style='flex:1;font-family:verdana,helvetica;font-size: 13px;margin-left:10px;'
                                                        v-bind:value='location.protocol + "//" + networkIntranetIpAddress + ":" + dockerLocalPort '>
                            </div>
                        </div>
                        <button v-on:click="createDockerImage()"
                                class="btn btn-primary">Create OpenShift Quay Image
                        </button>
<pre style="height:200px;overflow:auto;margin-top:20px;background-color:lightgray;padding:15px;border-radius:7px;">{{outputText}}</pre>
                    </div>

                </div>


            </div>









            </div>
        </div>

    </div>
</div>`
     ,

     mounted: function() {
         var thisVueInstance = this
         args.text           = null

         if (isValidObject(thisVueInstance.text)) {
             this.read_only = yz.helpers.getValueOfCodeString(thisVueInstance.text, "read_only")
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


            this.read_only = yz.helpers.getValueOfCodeString(thisVueInstance.text, "read_only")
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
            this.outputText = ""
            this.outputText += "Creating Docker image "  + this.dockerImageName + " at "+ this.dockerHost + ":" + this.dockerPort + "\n"
            this.outputText += "..." + "\n"
            var result = await callComponent(
                                {
                                    base_component_id: "serverDockerStuff"
                                }
                                    ,{
                                        create:                 true,
                                        image_name:             this.dockerImageName,
                                        host:                   this.dockerHost,
                                        port:                   this.dockerPort,
                                        docker_local_port:      this.dockerLocalPort,
                                        app_base_component_id:  GLOBALS.editingAppBaseComponentId
                                     })

           //alert(JSON.stringify(result,null,2))
           if (result) {
                this.outputText += JSON.stringify(   result  ,  null  ,  2   )

           }

           this.outputText += "\n" + ".. done!" + "\n"
       }


     }


    })

}
