function(args) {
/*
is_app(true)
control_type("VB")
display_name("3d text")
description("This will return the 3d text item control")
base_component_id("threedee_text_control")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "text",
            name:       "Text",
            default:    "Some text",
            type:       "String"
        }
        ,
        {
            id:         "backgroundColor",
            name:       "Background Color",
            default:    "lightgray",
            type:       "String"
        }
        ,
        {
            id:         "color",
            name:       "Color",
            default:    "black",
            type:       "String"
        }
        ,
        {
            id:         "x",
            name:       "X",
            type:       "Number",
            default:    -2
        }
        ,
        {
            id:         "y",
            name:       "Y",
            type:       "Number",
            default:    2
        }
        ,
        {
            id:         "z",
            name:       "Z",
            type:       "Number",
            default:    -5
        }
        ,
        {
            id:         "rotation",
            name:       "Rotation",
            type:       "String",
            default:    "0 45 0"
        }
        ,
        {
            id:         "textWidth",
            name:       "Text Width",
            type:       "Number",
            default:    4
        }
        ,
        {
            id:         "textHeight",
            name:       "Text Height",
            type:       "Number",
            default:    2
        }
        ,
        {
            id:     "click_event",
            name:   "Clicked event",
            type:   "Event",
            help:       `<div>Help text for
                            <b>click_event</b> event
                         </div>`
        }
        ,
        {
            id:         "boxDepth",
            name:       "Box Depth",
            type:       "Number",
            default:    .1
        }
        ,
        {
            id:         "boxHeight",
            name:       "Box Height",
            type:       "Number",
            default:    2
        }
        ,
        {
            id:         "boxWidth",
            name:       "Box Width",
            type:       "Number",
            default:    2
        }
        ,
        {
            id:         "moveRight",
            snippet:    `moveRight(1)`,
            name:       "Move Right",
            type:       "Action"
        }
        ,
        {
            id:         "moveTo",
            snippet:    `moveTo("0 0 0")`,
            name:       "Move To",
            type:       "Action"
        }
    ]
)//properties
logo_url("/driver_icons/threedee_text_control.png")
*/

    Vue.component("threedee_text_control",{
        props: [  "meta", "args"  ,  "design_mode"  ,  "refresh"  ,  "name"  ]

        ,

        template: `<a-entity          v-bind:refresh='refresh'>

                        <a-entity v-if='args'
                                  v-bind:id='name'
                                  v-bind:rotation='args.rotation'
                                  v-bind:geometry='"primitive: box; depth: " + args.boxDepth + "; height: " + args.boxHeight + "; width: " + args.boxWidth + ";"'
                                  v-bind:material='"color: " + args.backgroundColor + "; side: double; "'
                                  v-bind:refresh='refresh'
                                  v-bind:position='args.x + " " + args.y + " " + args.z'>



                              <a-entity v-bind:position='"" + (0.2 + (( args.textWidth - args.boxWidth )/2)) + " 0 .1"'
                                        v-bind:text='"width:" + args.textWidth + ";value: " + args.text + ";color:" + args.color + ";"'>

                              </a-entity>

                          </a-plane>

                  </a-entity>`
            ,

            mounted: function() {
                var mm = this
                registerComponent(this)
                var dd = document.getElementById(this.name)
                dd.addEventListener('click', function() {
                    mm.event_callback()
                });
            }
            ,
            methods: {
                event_callback: function() {
                    console.log("----- 3d text, event_callback: function() = " + this.name)
                    //eval("(function(){" + this.args.click_event + "})")()

                    this.$emit('send', {
                                                    type:               "subcomponent_event",
                                                    form_name:           this.meta.form,
                                                    control_name:        this.meta.name,
                                                    sub_type:           "click",
                                                    code:                this.args.click_event
                                                })
                }
                ,
                moveRight: async function(amount) {
                    await this.moveTo({
                        x:     this.args.x + amount
                    })

                }

                ,
                moveTo: async function(opts) {
                debugger
                    var mm          = this
                    var animationId = "animation_" + name
                    var dd          =  document.querySelector("#" + this.name)
                    var anim        =  document.querySelector("#" + animationId)
                    if (anim) {
                        anim.parentElement.removeChild(anim);
                    }
                    var newX = this.args.x
                    var newY = this.args.y
                    var newZ = this.args.z
                    if (isValidObject(opts.x)) {
                        newX = opts.x
                    }
                    if (isValidObject(opts.y)) {
                        newY = opts.y
                    }
                    if (isValidObject(opts.z)) {
                        newZ = opts.z
                    }
                    var newPosition = newX + " " + newY + " " + newZ


                    var para = document.createElement("a-animation");
                    para.setAttribute("id",          animationId);
                    para.setAttribute("attribute",  "position");
                    para.setAttribute("dur",        "2000");
                    para.setAttribute("fill",       "forwards");
                    para.setAttribute("to",         newPosition );
                    para.setAttribute("repeat",     "0");
                    dd.appendChild(para)

                    setTimeout(function() {
                        mm.args.x = newX
                        mm.args.y = newY
                        mm.args.z = newZ
                    },2000)


                }





            }
        }

    )
}
