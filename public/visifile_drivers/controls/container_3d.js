function(args) {
/*
is_app(true)
component_type("VB")
display_name("3d control")
description("This will return the 3d container control")
base_component_id("container_3d")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "lastKeyPressed",
            name:       "Last key pressed",
            default:    "",
            type:       "String"
        }
        ,
        {
            id:         "lastKeyDown",
            name:       "Last key down",
            default:    "",
            type:       "String"
        }
        ,
        {
            id:     "background_color",
            name:   "Background color",
            type:   "String"
        }
        ,
        {
            id:         "is_container",
            name:       "Is Container?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,
        {
            id:         "hide_children",
            name:       "Hide Children?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,
        {
            id:         "select_parent_when_child_added",
            name:       "Select Parent Only?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,

        {
            id:         "has_details_ui",
            name:       "Has details UI?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
        ,
        {
            id:         "width",
            name:       "Width",
            default:    300,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    300,
            type:       "Number"
        }
        ,
        {
            id:         "x",
            name:       "Camera X",
            type:       "Number",
            default:    0
        }
        ,
        {
            id:         "y",
            name:       "Camera Y",
            type:       "Number",
            default:    1.6
        }
        ,
        {
            id:         "z",
            name:       "Camera Z",
            type:       "Number",
            default:    1
        }
        ,
        {
            id:         "cameraRight",
            snippet:    `cameraRight(1,[[duration in ms]],[[bounce: true/false]])`,
            name:       "Camera Right()",
            type:       "Action"
        }
        ,
        {
            id:         "getVRMode",
            snippet:    `getVRMode()`,
            name:       "Get VR Mode()",
            type:       "Action"
        }
        ,
        {
            id:         "cameraUp",
            snippet:    `cameraUp(1,[[duration in ms]],[[bounce: true/false]])`,
            name:       "Camera Up()",
            type:       "Action"
        }
        ,
        {
            id:         "cameraLeft",
            snippet:    `cameraLeft(1,[[duration in ms]],[[bounce: true/false]])`,
            name:       "Camera Left()",
            type:       "Action"
        }
        ,
        {
            id:         "cameraDown",
            snippet:    `cameraDown(1,[[duration in ms]],[[bounce: true/false]])`,
            name:       "Camera Down()",
            type:       "Action"
        }
        ,
        {
            id:         "cameraBack",
            snippet:    `cameraBack(1,[[duration in ms]],[[bounce: true/false]])`,
            name:       "Camera Back()",
            type:       "Action"
        }
        ,
        {
            id:         "cameraForward",
            snippet:    `cameraForward(1,[[duration in ms]],[[bounce: true/false]])`,
            name:       "Camera Forward()",
            type:       "Action"
        }
        ,
        {
            id:         "cameraTo",
            snippet:    `cameraTo({x: , y:, z:})`,
            name:       "Camera To()",
            type:       "Action"
        }
        ,
        {
            id:         "enterVR",
            snippet:    `enterVR()`,
            name:       "Enter VR()",
            type:       "Action"
        }
        ,
        {
            id:         "exitVR",
            snippet:    `exitVR()`,
            name:       "Exit VR()",
            type:       "Action"
        }
        ,
        {
            id:     "keypress_event",
            name:   "Key Press Event",
            type:   "Event"
        }
        ,
        {
            id:     "keydown_event",
            name:   "Key Down Event",
            type:   "Event"
        }
        ,
        {
            id:     "backspace_event",
            name:   "BackspaceEvent",
            type:   "Event"
        }
        ,
        {
            id:     "delete_event",
            name:   "Delete Event",
            type:   "Event"
        }
        ,
        {
            id:     "enter_event",
            name:   "Enter Event",
            type:   "Event"
        }

    ]
)//properties
logo_url("/driver_icons/threedee_item.png")
*/

    Yazz.component({
      props: ["args","design_mode", "refresh", "children","delete_design_time_component","select_design_time_component"]
      ,
      template:

`<div   v-bind:style='"width:100%;overflow-y:auto;height:100%"'
        v-bind:refresh='refresh'>

    <div    v-bind:style='"width:100%;height:40vh;overflow-y:auto;"'
            v-bind:refresh='refresh'
            v-if='design_mode == "detail_editor"'>

            3D Scene Detail editor

        <div    v-bind:style='"border:1px solid gray; padding: 10px;display:flex;" + ((selected_index==index)?"background-color: lightgray;":"")'
                v-bind:refresh='refresh'
                v-on:click='$event.stopPropagation();selected_index=index;select_design_time_component(child_item.index_in_parent_array)'
                v-for='(child_item,index)  in  children'>

            <div    v-if='child_item'
                    v-bind:refresh='refresh'>

                <div    v-bind:style='"display:inline-block;"'
                        v-if='isValidObject(child_item)'
                        v-bind:refresh='refresh'>{{child_item.name}}</div>

                <div    class='btn btn-danger'
                        v-bind:refresh='refresh'
                        v-if='child_item'
                        v-bind:style='"box-shadow: rgba(0, 0, 0, 0.2) 0px 4px 8px 0px, rgba(0, 0, 0, 0.19) 0px 6px 20px 0px;padding:0px; z-index: 21474836;opacity:1;"  +
                        "width: 20px; height: 20px; line-height:20px;text-align: center;vertical-align: middle;margin-left: 20px;"'
                        v-on:click='$event.stopPropagation();delete_design_time_component(child_item.index_in_parent_array)'>

                        X

                </div>
            </div>
        </div>
    </div>






    <div    v-bind:style='"width:100%;height:40vh;overflow-y:auto;"'
            v-bind:refresh='refresh'
            v-if='design_mode == true'>

        3D Scene - {{children.length}} items

    </div>






    <div    id='3d_scene'
            ref='3d_scene'
            v-bind:style='"width:" + args.width + "; height: " + args.height + ";"'
            v-if='design_mode == false'
            v-bind:refresh='refresh'>


        <a-scene    v-bind:id='(design_mode?"design_scene":"scene")'
                    v-bind:ref='(design_mode?"design_scene":"scene")'
                    v-if='design_mode == false'
                    physics="debug: false;driver: ammo;"
                    cursor="rayOrigin: mouse"
                    style='width: 80%; height: 80%;'
                    embedded
                    allowvr="yes"
                    v-bind:refresh='refresh'>




            <a-entity   geometry="primitive: box; depth: 50; height: 0.5; width: 50"
                        material="color: #2E3837"
                        v-bind:refresh='refresh'
                        ammo-body="type: static"
                        ammo-shape="type: box"
                        position="0 0 -10">
            </a-entity>



            <a-entity   v-bind:id='"camera_rig_3d"'
                        v-bind:position='args.x + " " + args.y + " " + args.z'>
                <a-entity id="camera" camera look-controls>
                </a-entity>
                <a-entity   id="laser"
                            v-if="headsetConnected"
                            laser-controls="hand: right"
                            raycaster="hand: right;model: true;"
                            line="opacity:1.0;">
                </a-entity>
            </a-entity>



            <slot v-bind:refresh='refresh'>
            </slot>



        </a-scene>
    </div>

</div>`
         ,




        mounted: function() {
            let mm = this
            registerComponent(this)

            if (!this.design_mode) {
                //let scene = document.querySelector('a-scene');
                //if (isValidObject(scene)) {
                    //scene.addEventListener('click', function () {

                        // Apply impulse;
                        //setTimeout(function () {
                            //let box = document.getElementById('left-box');
                            //let impulse = { x: 0, y: 10, z: 0 };
                            //let point = { x: 0.5, y: 0, z: 0 };
                            //box['physics-body'].applyImpulse(impulse, point);
                        //}, 25);
                    //});
                //}


                let scene = document.querySelector('a-scene');
                scene.addEventListener('enter-vr', function() {
                    mm.inVRMode = true
                    mm.keyboardEnabled = true
                    })
                scene.addEventListener('exit-vr', function() {
                    mm.inVRMode = false
                    mm.keyboardEnabled = false
                   })

                appSetInterval(function(){
                    if (AFRAME.utils.device.checkHeadsetConnected()) {
                        mm.headsetConnected = true
                    } else {
                        mm.headsetConnected = false
                    }

                },2000)

                if (!isValidObject(window.vrKeyPressEventLisener)) {
                    window.vrKeyPressEventLisener = document.addEventListener('keypress', function(kevent) {
                        if(mm.keyboardEnabled) {
                            let keynum
                            if(window.event) { // IE
                               keynum = kevent.keyCode;
                             } else if(kevent.which){ // Netscape/Firefox/Opera
                               keynum = kevent.which;
                             }
                             mm.keyPressEventHandler(keynum)
                        }
                    });
                }



                if (!isValidObject(window.vrKeyDownEventLisener)) {
                    window.vrKeyDownEventLisener = document.addEventListener('keydown', function(kevent) {
                        if(mm.keyboardEnabled) {
                            let keynum
                            if(window.event) { // IE
                               keynum = kevent.keyCode;
                             } else if(kevent.which){ // Netscape/Firefox/Opera
                               keynum = kevent.which;
                             }
                             mm.keyDownEventHandler(keynum)
                        }
                    });
                }





            }


        }
      ,
      data: function() {
          return {
              selected_index:           null,
              headsetConnected:         false,
              keyboardEnabled:          false,
              inVRMode:                 false
          }
      }
      ,
      methods: {
          cameraRight: async function(amount, duration, bounce) {
              await this.cameraTo({
                  duration:   isValidObject(duration)?duration:2000,
                  bounce:     isValidObject(bounce)?bounce:false,
                  x:          this.args.x + amount
              })

          }
          ,
          cameraLeft: async function(amount, duration, bounce) {
              await this.cameraTo({
                  duration:   isValidObject(duration)?duration:2000,
                  bounce:     isValidObject(bounce)?bounce:false,
                  x:          this.args.x - amount
              })

          }
          ,
          cameraUp: async function(amount, duration, bounce) {
              await this.cameraTo({
                  duration:   isValidObject(duration)?duration:2000,
                  bounce:     isValidObject(bounce)?bounce:false,
                  y:          this.args.y + amount
              })

          }
          ,
          cameraDown: async function(amount, duration, bounce) {
              await this.cameraTo({
                  duration:   isValidObject(duration)?duration:2000,
                  bounce:     isValidObject(bounce)?bounce:false,
                  y:          this.args.y - amount
              })

          }
          ,
          cameraBack: async function(amount, duration, bounce) {
              await this.cameraTo({
                  duration:   isValidObject(duration)?duration:2000,
                  bounce:     isValidObject(bounce)?bounce:false,
                  z:     this.args.z + amount
              })
          }
          ,
          cameraForward: async function(amount, duration, bounce) {
              await this.cameraTo({
                  duration:   isValidObject(duration)?duration:2000,
                  bounce:     isValidObject(bounce)?bounce:false,
                  z:     this.args.z - amount
              })

          }

          ,
          cameraTo: async function(opts) {

              let mm          = this
              let dd          =  document.querySelector("#camera_rig_3d" )
              let loop        = "0"
              let direction   = "normal"
              let duration    = 2000
              let bounce      = false

              let newX = this.args.x
              let newY = this.args.y
              let newZ = this.args.z
              if (isValidObject(opts.x)) {
                  newX = opts.x
              }
              if (isValidObject(opts.y)) {
                  newY = opts.y
              }
              if (isValidObject(opts.z)) {
                  newZ = opts.z
              }
              let newPosition = newX + " " + newY + " " + newZ

              if (isValidObject(opts.loop)) {
                  loop = opts.loop
              }

              if (isValidObject(opts.bounce) && (opts.bounce == true)) {
                  bounce    = true
                  direction = "alternate"
                  loop      = "1"
              }

              if (isValidObject(opts.duration)) {
                  duration = opts.duration
              }


              //
              // we need Math.random here as otherwise the animation will not get triggered for
              // repeated invocations
              //
              dd.setAttribute("animation",
                      `property: position; to: ${newPosition}; loop: ${loop}; dur: ${duration}; dir: ${direction}; rand: ${Math.random()} `
                  );


              if (!bounce) {
                  setTimeout(function() {
                      mm.args.x = newX
                      mm.args.y = newY
                      mm.args.z = newZ
                  },(duration + 100))
              }

              return {}


          }
          ,
          enterVR: async function() {
            let scene = document.querySelector('#scene');
            scene.enterVR()
          }
          ,
          exitVR: async function() {
              let scene = document.querySelector('#scene');
              scene.exitVR()
          }
          ,
          getVRMode: async function() {
              return this.inVRMode
          }

          ,
          keyPressEventHandler: function(keyCode) {
              this.args.lastKeyPressed = String.fromCharCode(keyCode)
              this.$emit('send', {
                                              type:               "subcomponent_event",
                                              control_name:        this.args.name,
                                              sub_type:           "keypressed",
                                              args: {
                                                  key_pressed:         String.fromCharCode(keyCode),
                                                  key_code:            keyCode
                                              },
                                              code:                this.args.keypress_event
                                          })
          }

            ,
            keyDownEventHandler: function(keyCode) {
                this.args.lastKeyDown = String.fromCharCode(keyCode)
                this.$emit('send', {
                                                type:               "subcomponent_event",
                                                control_name:        this.args.name,
                                                sub_type:           "keydown",
                                                args: {
                                                    key_down:         String.fromCharCode(keyCode),
                                                    key_code:         keyCode
                                                },
                                                code:                this.args.keydown_event
                                            })

                if (keyCode == 8) {
                    this.$emit('send', {
                                                    type:               "subcomponent_event",
                                                    control_name:        this.args.name,
                                                    sub_type:           "backspace",
                                                    code:                this.args.backspace_event
                                                })
                }
                if (keyCode == 46) {
                    this.$emit('send', {
                                                    type:               "subcomponent_event",
                                                    control_name:        this.args.name,
                                                    sub_type:           "delete",
                                                    code:                this.args.delete_event
                                                })
                }
                if (keyCode == 13) {
                    this.$emit('send', {
                                                    type:               "subcomponent_event",
                                                    control_name:        this.args.name,
                                                    sub_type:           "enter",
                                                    code:                this.args.enter_event
                                                })
                }






            }
      }
    })
}
