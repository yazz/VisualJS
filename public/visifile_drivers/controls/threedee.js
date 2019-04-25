function(args) {
/*
is_app(true)
control_type("VB")
display_name("3d control")
description("This will return the 3d container control")
base_component_id("threedee_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "text",
            name:   "Text",
            type:   "String"
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
    ]
)//properties
logo_url("/driver_icons/threedee_control.png")
*/

    Vue.component("threedee_control",{
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
                    physics-world=""
                    v-if='design_mode == false'
                    physics="debug: false"
                    cursor="rayOrigin: mouse"
                    style='width: 80%; height: 80%;'
                    embedded
                    allowvr="yes"
                    v-bind:refresh='refresh'>

            <a-entity   id="laser"
                        laser-controls="hand: right"
                        raycaster="hand: right;model: true;"
                        line="opacity:1.0;">
            </a-entity>

            <a-entity   geometry="primitive: sphere; radius: 100"
                        material="color: #74DEED; shader: flat"
                        v-bind:refresh='refresh'
                        scale="1 1 -1">
            </a-entity>


            <a-entity   geometry="primitive: box; depth: 50; height: 0.1; width: 50"
                        material="color: #2E3837"
                        v-bind:refresh='refresh'
                        static-body
                        physics-body="mass: 0; boundingBox: 50 0.1 50" position="0 0 -10">
            </a-entity>




            <slot v-bind:refresh='refresh'>
            </slot>

        </a-scene>
    </div>

</div>`
         ,




        mounted: function() {
            if (!this.design_mode) {
                //var scene = document.querySelector('a-scene');
                //if (isValidObject(scene)) {
                    //scene.addEventListener('click', function () {

                        // Apply impulse;
                        //setTimeout(function () {
                            //var box = document.getElementById('left-box');
                            //var impulse = { x: 0, y: 10, z: 0 };
                            //var point = { x: 0.5, y: 0, z: 0 };
                            //box['physics-body'].applyImpulse(impulse, point);
                        //}, 25);
                    //});
                //}

            }
        }
      ,
      data: function() {
          return {
              msg: "Hello Yazz!",
              selected_index: null
          }
      }
    })
}
