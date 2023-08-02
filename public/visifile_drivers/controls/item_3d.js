function(args) {
/*
is_app(true)
component_type("VB")
display_name("3d text")
description("This will return the 3d text item control")
base_component_id("item_3d")
load_once_from_file(true)
visibility("PRIVATE")
read_only(true)
properties(
    [
        {
            id:         "text",
            name:       "Text",
            default:    "",
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
            name:       "3D X",
            type:       "Number",
            default:    -2
        }
        ,
        {
            id:         "y",
            name:       "3D Y",
            type:       "Number",
            default:    2
        }
        ,
        {
            id:         "z",
            name:       "3D Z",
            type:       "Number",
            default:    -5
        }
        ,
        {
            id:         "x_rotation",
            name:       "X Rotation",
            type:       "Number",
            default:    0
        }
        ,
        {
            id:         "y_rotation",
            name:       "Y Rotation",
            type:       "Number",
            default:    45
        }
        ,
        {
            id:         "z_rotation",
            name:       "Z Rotation",
            type:       "Number",
            default:    0
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
            name:       "Move Right()",
            type:       "Action",
            async:       true
        }
        ,
        {
            id:         "moveUp",
            snippet:    `moveUp(1)`,
            name:       "Move Up()",
            type:       "Action",
            async:       true
        }
        ,
        {
            id:         "moveLeft",
            snippet:    `moveLeft(1)`,
            name:       "Move Left()",
            type:       "Action",
            async:       true
        }
        ,
        {
            id:         "moveDown",
            snippet:    `moveDown(1)`,
            name:       "Move Down()",
            type:       "Action",
            async:       true
        }
        ,
        {
            id:         "moveBack",
            snippet:    `moveBack(1)`,
            name:       "Move Back()",
            type:       "Action"
        }
        ,
        {
            id:         "moveForward",
            snippet:    `moveForward(1)`,
            name:       "Move Forward()",
            type:       "Action"
        }
        ,
        {
            id:         "boundingBox",
            name:       "Bounding Box",
            type:       "String",
            default:    "2 2 2"
        }
        ,
        {
            id:         "mass",
            name:       "Mass",
            type:       "Number",
            default:    5
        }
        ,
        {
            id:         "usePhysics",
            name:       "Physics?",
            type:       "Select",
            default:    "false",
            values:     [
                            {display: "False",   value: "false"},
                            {display: "True",  value: "true"}
                        ]
        }
        ,
        {
            id:         "moveTo",
            snippet:    `moveTo({})`,
            name:       "Move To()",
            type:       "Action"
        }
        ,
        {
            id:         "applyImpulse",
            snippet:    `applyImpulse()`,
            name:       "Apply Impulse()",
            type:       "Action"
        }
        ,
        {
            id:         "panTo",
            snippet:    `panTo()`,
            name:       "Pan To()",
            type:       "Action",
            fn:
`parent.cameraTo({x: me.x,y: me.y,z: me.z + 4,duration: 1000, bounce: false})
`
        }

    ]
)//properties
logo_url("/driver_icons/threedee_control.png")
*/

    Yazz.component({
        props: [  "meta", "args"  ,  "design_mode"  ,  "refresh"  ,  "name"  ]

        ,

        template: `<a-entity          v-bind:refresh='refresh'>

                        <a-entity v-if='args'
                                  v-bind:id='name'
                                  v-bind:rotation='args.x_rotation + " " + args.y_rotation + " " + args.z_rotation'
                                  v-bind:geometry='"primitive: box; depth: " + args.boxDepth + "; height: " + args.boxHeight + "; width: " + args.boxWidth + ";"'
                                  v-bind:material='"color: " + args.backgroundColor + "; side: double; "'
                                  v-bind:refresh='refresh'
                                  v-bind:ammo-body='(args.usePhysics == "true")?("type: dynamic; mass: " + args.mass + "; boundingBox: " + args.boundingBox + "; "):false'
                                  v-bind:ammo-shape='(args.usePhysics == "true")?("type: box; "):false'
                                  v-bind:position='args.x + " " + args.y + " " + args.z'>



                              <a-entity v-bind:position='"" + (0.2 + (( args.textWidth - args.boxWidth )/2)) + " 0 .1"'
                                        v-bind:text='"width:" + args.textWidth + ";value: " + args.text + ";color:" + args.color + ";"'>

                              </a-entity>

                          </a-plane>

                  </a-entity>`
            ,

            mounted: async function() {
                let mm = this
                await registerComponent(this)
                let dd = document.getElementById(this.name)
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
                moveRight: async function(amount, duration, bounce) {
                    await this.moveTo({
                        duration:   isValidObject(duration)?duration:2000,
                        bounce:     isValidObject(bounce)?bounce:false,
                        x:          this.args.x + amount
                    })

                }
                ,
                moveLeft: async function(amount, duration, bounce) {
                    await this.moveTo({
                        duration:   isValidObject(duration)?duration:2000,
                        bounce:     isValidObject(bounce)?bounce:false,
                        x:          this.args.x - amount
                    })

                }
                ,
                moveUp: async function(amount, duration, bounce) {
                    await this.moveTo({
                        duration:   isValidObject(duration)?duration:2000,
                        bounce:     isValidObject(bounce)?bounce:false,
                        y:          this.args.y + amount
                    })

                }
                ,
                moveDown: async function(amount, duration, bounce) {
                    await this.moveTo({
                        duration:   isValidObject(duration)?duration:2000,
                        bounce:     isValidObject(bounce)?bounce:false,
                        y:          this.args.y - amount
                    })

                }
                ,
                moveBack: async function(amount, duration, bounce) {
                    await this.moveTo({
                        duration:   isValidObject(duration)?duration:2000,
                        bounce:     isValidObject(bounce)?bounce:false,
                        z:     this.args.z - amount
                    })
                }
                ,
                moveForward: async function(amount, duration, bounce) {
                    await this.moveTo({
                        duration:   isValidObject(duration)?duration:2000,
                        bounce:     isValidObject(bounce)?bounce:false,
                        z:     this.args.z + amount
                    })

                }

                ,
                moveTo: async function(opts) {

                    let mm          = this
                    let animationId = "animation_" + this.name
                    let dd          =  document.querySelector("#" + this.name)
                    let loop        = "0"
                    let direction   = "normal"
                    let duration    = 500
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


                }
                ,
                applyImpulse: async function(opts) {
                    let object3d = document.querySelector("#" + this.name)

                    let impulse = new Ammo.btVector3(0, 50, 0);
                    let pos = new Ammo.btVector3(0, 0, 0);

                    object3d.body.applyImpulse(impulse, pos);
                    Ammo.destroy(impulse);
                    Ammo.destroy(pos);
                }






            }
        }

    )
}
