function(args) {
/*
is_app(true)
control_type("VB")
display_name("Draw control")
description("This will return the draw control")
base_component_id("draw_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:     "image_data",
            name:   "Image",
            type:   "Image"
        }
        ,
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
            id:         "has_details_ui",
            name:       "Has details UI?",
            type:       "Boolean",
            default:    true,
            hidden:     true
        }
     ]
)//properties
logo_url("/driver_icons/draw.png")
*/

    Vue.component("draw_control",{
      props: ["args","refresh", "design_mode"]
      ,
      template: `<div   v-bind:style='"height:100%;width:100%; border: 0px;" +
                                      "background-color: "+    args["background_color"]  +  ";"'
                        v-bind:refresh='refresh'>

                                    <canvas v-if='design_mode == "detail_editor"'
                                            v-bind:id='args.name + "_canvas_" + (design_mode?"_design_mode":"")'
                                            v-bind:refresh='refresh'
                                            v-on:mousemove='drawNow($event)'
                                            style="height:100%:width:100%;">
                                    </canvas>

                                    <img      v-else=""
                                              v-bind:width='args.width + "px"'
                                              v-bind:refresh='refresh'
                                              alt='No image set'
                                              v-bind:src='"" + args.image_data'>


                                    </img>
                 </div>`
      ,
      data: function() {
       return {
         msg: "..."
     }
      }
      ,
      watch: {
        // This would be called anytime the value of the input changes
        refresh: function(newValue, oldValue) {
            //console.log("refresh: " + this.args.text)
            if (isValidObject(this.args)) {
            }
            this.loadImageToCanvas()
        }
      },
      mounted: function() {
        this.loadImageToCanvas()
      }
      ,
      methods: {
          drawNow: function(event) {
          var mm= this
          var el = document.getElementById(mm.args.name + "_canvas_" + (mm.design_mode?"_design_mode":""))
              if (isValidObject(el)) {
               var rect = el.getBoundingClientRect()
               var left = event.clientX - rect.left
               var right = event.clientY - rect.top

               var ctx = el.getContext("2d");
               ctx.fillRect(left,right,3,3)

               this.args.image_data = el.toDataURL()
            }
          }
          ,
          loadImageToCanvas: function() {
              var mm = this
              var base_image = new Image();
              //alert(this.args.image_data)
              base_image.src = this.args.image_data;
              base_image.onload = function() {
                var el = document.getElementById(mm.args.name + "_canvas_" + (mm.design_mode?"_design_mode":""))
                if (isValidObject(el)) {
                    //alert(el)
                    var ctx = el.getContext("2d");
                    ctx.clearRect(0, 0, el.width, el.height);
                    var hRatio = el.width / base_image.width    ;
                    var vRatio = el.height / base_image.height  ;
                    var ratio  = Math.min ( hRatio, vRatio );
                    ctx.drawImage(base_image,   0, 0, base_image.width,             base_image.height,
                                                0, 0, base_image.width*ratio,       base_image.height*ratio);
                    //alert(base_image)
                }
              }
          }

      }

    })
}
