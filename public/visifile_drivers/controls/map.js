function() {
/*
component_type("VB")
hash_algorithm("SHA256")
display_name("Button control")
description("This will return the button control")
base_component_id("map_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "text",
            name:       "Text",
            default:    1,
            type:       "Number",
            help:       `<div>This is the text that is displayed in the button</div>`
        }
        ,
        {
            id:         "setText",
            snippet:    `setText("")`,
            name:       "setText",
            type:       "Action",
            help:       `<div>Help text for
                            <b>setText</b> function
                         </div>`
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
            default:    200,
            type:       "Number"
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
            id:         "action_click_details_ui",
            name:       "Action Details UI Clicked",
            type:       "Action",
            hidden:     true
        }
        ,
        {
            id:         "padding",
            name:       "Padding",
            type:       "Number"
        }
        ,
        {
            id:         "background_color",
            name:       "Background color",
            type:       "String"
        }
        ,
        {
            id:         "mapLatitude",
            name:       "Map Latitude",
            type:       "Number",
            default:    51.505
        }
        ,
        {
            id:         "mapLongitude",
            name:       "Map Longitude",
            type:       "Number",
            default:    -0.09
        }
        ,
        {
            id:         "color",
            name:       "Color",
            type:       "String"
        }
        ,
        {
            id:         "button_size",
            name:       "Button size",
            type:       "Select",
            default:    "large",
            values:     [
                            {display: "Large",   value: "large"},
                            {display: "Normal",  value: "normal"},
                            {display: "Small",  value: "small"}
                        ]
        }
        ,
        {
            id:         "click_event",
            name:       "Clicked event",
            type:       "Event",
            help:       `<div>Help text for
                            <b>click_event</b> event
                        </div>`
        }
    ]
)//properties
logo_url("/driver_icons/map_control.png")
*/

    Yazz.component(
    {
        props:      [  "sql"  ,  "meta"  ,  "name"  ,  "refresh"  ,  "design_mode"   ,  "control_properties_and_events"  ,  "runEvent"  ],
        template:   ` 
<div>
    <div    v-if='!design_mode' 
            v-bind:id='name + "_" + control_properties_and_events.code_id' 
            v-bind:style='"width: " + control_properties_and_events.width + "px; height: " + control_properties_and_events.height + "px;"'>
    </div>
    
    <div    v-if='design_mode == "detail_editor"' 
            v-bind:style='"width: " + control_properties_and_events.width + "px; control_properties_and_events.height: " + height + "px;"'>
        Map Details        
        
        <button class=btn v-on:click='onClickApplyChanges()'>Apply</button> 
        ( {{control_properties_and_events.mapLatitude}} , {{control_properties_and_events.mapLongitude}} )
        
        <div    v-if='design_mode == "detail_editor"' 
                v-bind:id='name + "_" + control_properties_and_events.code_id + "_design"' 
                v-bind:style='"width: " + control_properties_and_events.width + "px; height: " + control_properties_and_events.height + "px;"'>
        </div>
    </div>

    <div    v-if='design_mode && (design_mode != "detail_editor")' 
            v-bind:style='"width: " + control_properties_and_events.width + "px; control_properties_and_events.height: " + height + "px;"'>
        Map        
    </div>
    
</div>
`,
        mounted:    async function( ) {
            //----------------------------------------------------------------------------------/
            //
            //                                          /-------------------------------------/
            //                                         /      FUNCTION  mounted              /
            //                                        /-------------------------------------/
            //
            //----------------------------------------------------------------------------/
            // Called when the map control is mounted
            //
            //-------------------------------------------------------------------------/
            let mm = this
            await registerComponent(this)
            //console.log("Mounted called on " + mm.name)
            //yz.mainVars.disableAutoSave                 = true

            setTimeout(function() {
                try {
                    if (!mm.design_mode) {
                        let runtimeName = mm.name + "_" + mm.control_properties_and_events.code_id
                        mm.map = L.map( runtimeName ).setView(
                            [
                                mm.control_properties_and_events.mapLatitude,
                                mm.control_properties_and_events.mapLongitude
                            ], 13);
                        console.log("Mounting map " + runtimeName)

                        // Add an OpenStreetMap tile layer to the map:
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            maxZoom: 18,
                        }).addTo(mm.map);
                    }
                } catch ( err ) {
                    debugger
                    console.log("Error: " + err)
                }

            },500)
        },
        data:       function( ) {
            //----------------------------------------------------------------------------------/
            //
            //                                          /-------------------------------------/
            //                                         /                DATA                 /
            //                                        /-------------------------------------/
            //
            //----------------------------------------------------------------------------/
            //
            //
            //-------------------------------------------------------------------------/
            return {
                text:   "",
                map:    null,
                movee: false
            }
        },
        methods:    {
            onClickApplyChanges:        async function() {
                //----------------------------------------------------------------------------------/
                //
                //                                          /-------------------------------------/
                //                                         /   FUNCTION  onClickApplyChanges     /
                //                                        /-------------------------------------/
                //
                //----------------------------------------------------------------------------/
                // Called when we look at the advanced UI in design mode
                //
                //-------------------------------------------------------------------------/
                let mm = this
                //debugger
                let mapCenter = mm.map.getCenter()

                mm.control_properties_and_events.mapLatitude   = mapCenter.lat;
                mm.control_properties_and_events.mapLongitude  = mapCenter.lng;
                console.log(mm.control_properties_and_events.code_id + ":   Moved to ( " + mm.control_properties_and_events.mapLatitude + " , " +
                    mm.control_properties_and_events.mapLongitude + " )")

            },
            action_click_details_ui:    async function() {
                //----------------------------------------------------------------------------------/
                //
                //                                          /-------------------------------------/
                //                                         /   FUNCTION  action_click_details_ui /
                //                                        /-------------------------------------/
                //
                //----------------------------------------------------------------------------/
                // Called when we look at the advanced UI in design mode
                //
                //-------------------------------------------------------------------------/
                let mm = this
                Vue.nextTick(async function() {
                    let designName = mm.name + "_" + mm.control_properties_and_events.code_id + "_design"
                    //debugger
                    mm.map = L.map(designName).setView(
                        [
                            mm.control_properties_and_events.mapLatitude,
                            mm.control_properties_and_events.mapLongitude
                        ], 13);
                    console.log("Mounting map " + designName)

                    // Add an OpenStreetMap tile layer to the map:
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        maxZoom: 18,
                    }).addTo(mm.map);
                })
            }
        },
        beforeUnmount:          async function  (  ) {
            //----------------------------------------------------------------------------------/
            //
            //                                          /-------------------------------------/
            //                                         /      FUNCTION  beforeUnmount        /
            //                                        /-------------------------------------/
            //
            //----------------------------------------------------------------------------/
            // Before map unmounted from UI
            //
            //-------------------------------------------------------------------------/
            let mm = this

            if (mm.map) {
                let designName = mm.name + "_" + mm.control_properties_and_events.code_id + "_design"
                console.log("beforeUnmount called on " + designName)
                //mm.map.close()
            }
        }
    })
}
