function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
display_name("Line control")
description("This will return the line control")
base_component_id("line_control")
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
            id:         "direction",
            name:       "Direction",
            type:       "Select",
            default:    "topToBottom",
            values:     [
                            {display: "Top to bottom",   value: "topToBottom"},
                            {display: "Bottom to top",  value: "bottomToTop"}
                        ]
        }
            ]
)//properties
logo_url("/driver_icons/line.png")
*/

    Yazz.component({
      props: ["control_properties_and_events","refresh", "design_mode"]
      ,
      template: `<div       v-bind:refresh='refresh'
                            v-bind:style='"height:100%;width:100%; border: 0px;" +
                                    "background-color: "+    control_properties_and_events["background_color"]  +  ";color:black;"'>

                                    <canvas v-bind:id='control_properties_and_events.name + "_canvas_" + (design_mode?"_design_mode":"")'
                                            style="height:100%:width:100%;">
                                    </canvas>

                 </div>`
      ,
      data: function() {
       return {
         msg: "..."
     }
      },
      watch: {
        // This would be called anytime the value of the input changes
        refresh(newValue, oldValue) {
            //console.log("refresh: " + this.control_properties_and_events.text)
            if (isValidObject(this.control_properties_and_events)) {
            }
            this.redraw()
        }
      },
            mounted: function() {
        this.redraw()
      },
      methods: {
        redraw: function() {
            var c = document.getElementById(this.control_properties_and_events.name + "_canvas_" + (this.design_mode?"_design_mode":""));
            if (isValidObject(c)) {
                var ctx = c.getContext("2d");
                ctx.clearRect(0, 0, c.width, c.height);
                ctx.beginPath();
                ctx.strokeStyle = "#FF0000";
                if (this.control_properties_and_events.direction == "topToBottom") {
                    ctx.moveTo(0, 0);
                    ctx.lineTo(  parseInt(this.control_properties_and_events.width),   parseInt(this.control_properties_and_events.height)  );
                    ctx.stroke();
                } else {
                    ctx.moveTo(0, parseInt(this.control_properties_and_events.height));
                    ctx.lineTo(  parseInt(this.control_properties_and_events.width),   0  );
                    ctx.stroke();

                }
            }

        }
      }
    })
}
