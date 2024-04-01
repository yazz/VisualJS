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
            id:         "pinLatitude",
            name:       "Pin Latitude",
            type:       "Number",
            default:    51.505
        }
        ,
        {
            id:         "pinLongitude",
            name:       "Pin Longitude",
            type:       "Number",
            default:    -0.09
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
{{control_properties_and_events.text}} <button v-on:click="odoo" class=btn></button>
    <div    v-if='!design_mode' 
            id="map" 
            v-bind:style='"width: " + control_properties_and_events.width + "px; height: " + control_properties_and_events.height + "px;"'>
    </div>
    
    <div    v-if='design_mode == "detail_editor"' 
            v-bind:style='"width: " + control_properties_and_events.width + "px; control_properties_and_events.height: " + height + "px;"'>
        Map Details        
        <div    v-if='design_mode == "detail_editor"' 
                v-bind:id='"map_design"' 
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
            let mm = this
            await registerComponent(this)

            setTimeout(function() {
                try {
                    if (!mm.design_mode) {
                        mm.map = L.map('map').setView(
                            [
                                mm.control_properties_and_events.mapLatitude,
                                mm.control_properties_and_events.mapLongitude
                            ], 13);

                        // Add an OpenStreetMap tile layer to the map:
                        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                            maxZoom: 18,
                        }).addTo(mm.map);

                        // Add a marker at the same coordinates as the map's initial view:
                        let marker = L.marker(
                            [
                                mm.control_properties_and_events.pinLatitude,
                                mm.control_properties_and_events.pinLongitude
                            ]).addTo(mm.map);

                        // Optionally, add a popup to the marker:
                        marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
                    }
                } catch ( err ) {
                    debugger
                    console.log("Error: " + err)
                }

            },500)
        },
        data:       function( ) {
            return {
                text:   "",
                map:    null
            }
        },
        methods:    {
            odoo:    async function(  ) {
                this.control_properties_and_events.text ++
                this.control_properties_and_events.pinLatitude ++
            },
            action_click_details_ui: async function() {
                //debugger
                let mm = this
                Vue.nextTick(async function() {
                    mm.map = L.map('map_design').setView(
                        [
                            mm.control_properties_and_events.mapLatitude,
                            mm.control_properties_and_events.mapLongitude
                        ], 13);

                    // Add an OpenStreetMap tile layer to the map:
                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                        maxZoom: 18,
                    }).addTo(mm.map);

                    // Add a marker at the same coordinates as the map's initial view:
                    let marker = L.marker(
                        [
                            mm.control_properties_and_events.pinLatitude,
                            mm.control_properties_and_events.pinLongitude]
                    ).addTo(mm.map);

                    // Optionally, add a popup to the marker:
                    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();

                    mm.map.addEventListener('click', function(ev) {
                        mm.control_properties_and_events.pinLatitude   = ev.latlng.lat;
                        mm.control_properties_and_events.pinLongitude  = ev.latlng.lng;
                        mm.map.removeLayer(marker)
                        marker = L.marker([mm.control_properties_and_events.pinLatitude,mm.control_properties_and_events.pinLongitude]).addTo(mm.map);
                        console.log("Clicked ( " + ev.latlng.lat + " , " + ev.latlng.lng + " )")
                    });
                    mm.map.addEventListener('moveend', async function(ev) {
                        let mapCenter = mm.map.getCenter()
                        var bounds = mm.map.getBounds(); // Gets the geographical bounds visible in the current map view
                        var topLeftLatLng = bounds.getNorthWest();
                        mm.control_properties_and_events.mapLatitude   = topLeftLatLng.lat;
                        mm.control_properties_and_events.mapLongitude  = topLeftLatLng.lng;
                        debugger
                        console.log("Moved to ( " + mm.control_properties_and_events.mapLatitude + " , " +
                            mm.control_properties_and_events.mapLongitude + " )")


                    });
                })
            }
        },
        beforeUnmount:          async function  (  ) {
            let mm = this
            if (mm.map) {
                //mm.map.close()
            }
        }
    })
}
