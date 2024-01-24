function(args) {
/*
is_app(true)
component_type("VB")
hash_algorithm("SHA256")
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
            id:     "draw_color",
            name:   "Draw color",
            default:    "black",
            type:   "String"
        }
        ,
        {
            id:     "brush_width",
            name:   "Brush Width",
            default:    3,
            type:   "Number"
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
            default:    150,
            type:       "Number"
        }
        ,
        {
            id:         "height",
            name:       "Height",
            default:    150,
            type:       "Number"
        }
     ]
)//properties
logo_url("/driver_icons/draw.png")
*/



    Yazz.component({
      props: ["args","refresh", "design_mode"]
      ,
      template: `<div   v-bind:style='"height:100%;width:100%; border: 0px;" +
                                      "background-color: "+    args["background_color"]  +  ";"'
                        v-bind:refresh='refresh'>

                                    <canvas v-if='design_mode == "detail_editor"'
                                            v-bind:id='args.name + "_canvas_" + (design_mode?"_design_mode":"")'
                                            v-bind:refresh='refresh'
                                            style="border: solid black 5px;margin-bottom: 10px;"
                                            v-on:mousemove='if (mousedown) {drawNow($event)}'
                                            v-on:mousedown='mousedown=true'
                                            v-on:mouseup='mousedown=false'
                                            v-bind:height='args.height + "px"'
                                            v-bind:width='args.width + "px"'
                                             >
                                    </canvas>

                                    <div        v-if='design_mode == "detail_editor"'>

                                        <div    v-for="color in colors"
                                                v-if='design_mode == "detail_editor"'
                                                v-on:click='args.draw_color = color;'
                                                v-bind:style="'display: inline-block;width:15px;height:15px;background-color: ' + color">
                                        </div>
                                    </div>

                                    <div        v-if='design_mode == "detail_editor"'>

                                        <div    v-for="brush_size in [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28]"
                                                v-if='design_mode == "detail_editor"'
                                                v-on:click='args.brush_width = brush_size;'
                                                v-bind:style="'display: inline-block;width:' + brush_size + 'px;height:' + brush_size +
                                                              'px;background-color: ' + args.draw_color + ';border: black solid 1px ;margin-right: 2px;'">
                                        </div>
                                    </div>


                                    <img      v-if='design_mode != "detail_editor"'
                                              v-bind:width='args.width + "px"'
                                              v-bind:refresh='refresh'
                                              alt='No image set'
                                              v-bind:src='"" + args.image_data'>


                                    </img>
                 </div>`
      ,
      data: function() {
       return {
         msg: "...",
         mousedown: false,
          colors: [ "blue","green","yellow","orange","black","white","purple","red","violet","blue","gray","pink","orange","lightgray","darkgray",
                    "cyan","lightblue"
                    ]
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
               var left = (event.clientX - rect.left ) - 8
               var right = (event.clientY - rect.top) - 8

               var ctx = el.getContext("2d");
               ctx.strokeStyle = mm.args.draw_color;
               ctx.fillStyle = mm.args.draw_color;
               ctx.fillRect(left,right,  mm.args.brush_width,  mm.args.brush_width)

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
