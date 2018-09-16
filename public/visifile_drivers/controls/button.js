function(args) {
/*
is_app(true)
is_control(true)
display_name("Button control")
description("This will return the button control")
base_component_id("label_control")
load_once_from_file(true)
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
            id:     "click_event",
            name:   "Clicked event",
            type:   "Event"
        }
    ]
)//properties
logo_url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAb1BMVEX///8AAAB0dHSurq7j4+Pu7u5DQ0OcnJzg4OBMTEzQ0NC6urrm5uanp6dQUFBxcXGUlJT29vZFRUVaWlrAwMCOjo5fX18+Pj7Hx8crKyu3t7clJSXV1dV7e3uCgoJUVFQyMjIODg5oaGgWFhYgICDu4CPoAAAD1klEQVR4nO3ba2OiOBiGYV8VUakHBMSh9Tj+/9+4IUJId100U3FA7+tLRVObpyEJidjrAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAd+JlSb9Lksxzyhek0j1pdne+8acqP09mg+6YJXNV58/xfQFnquwsdGrzNgh1ve8p6Yssmq5NQxYi/u1S8V2lWkq1TnyrTCiSPKMuDUlEbvWvhYyeUpWmjKRfX8ATGT6nKg0ZitRPjL5ET6pKU/Y3hpGVBE+qSVMyWdW+fquN20/1sx+83An1jTR8iYR1YyUJu4CEJGy/RybM0tXF5JRsflqxh3lkwsG3TYT6jCuRD3OwF7lzNf4HHpzw+Ct31BEHdWVHdsJ5hxLOi4dxHrFuZdbZhJPysXdjk6T7CXsnkW1N2ZV9ubi34158DK9dTXpD9x2xxhIm5QaWN4mqZXYU6RKT9W+RfaTMv9TBWZ3e+mB6KZWtdEdemIYd7OdBL9zqZ113jRpLuCg3eNT5mlp/Toof1ZBrHehto7Dafl4Wv+arcWtYPum4rdJUwlBV5dIi1xIm/qfIbqkkY3XwqzpQ8v3nfrwZ5EGLXTCVUJ0Tk1k8iMR1a6yhsXR6NmmvJazrh/m5eDk9l+rRl37kmwbW+9MOdXr8fLgaKQfdi4pnryf837HUsy4W1Gh12YLwrek1vWMP1NbYNY2ZKhwTzqyOlqfVLa0SHq0Cy56DR7fhKM3pjFNTTZeEa3seVW+kd8JUwl353KZ+GvqPhvqht6sdaWoSnsu+l9sV7eVbsaeOn6M0Nlv4ZRjHhGIPQX7RXq1MmFdVn2E/SThrdcJJ0XfcE1Y1Whbv0c6EUVETx4QHe2VZfgDYzoSfxRkWWlO0Z8/41xP27cmgnBtbmfDDzInWStEMP9+X9Wtr/Iytf8i0fNzGhOHBDBmRWQ/kTVi84Vasz3zUpFDdN2FdeJ7Lqa9FCdOvaS7YWSuDvFV0ADVX/y7fMBM5b7ww1K0bqBfMQVZG9FLT+i1KaDNXIXlNj+t8VbAxCc2aSfezo7160v+dU38i5sK7NQlndr51dWViFnxxNZb2vLmV0IushNX7nMuuuvye8ORQqYcmHGdBYfOvbZd4kR4iX51xQVB1uHAaq0PPPiiG13BwSg+TXTVrjLOsWnxk2dShUux5k7AD3j3h63+O//r3YrzB/TS+7J9Uk6bcuifq9e9rU8u1F7838Q3uL339e4Tf4D7vy7Kvq/fq195LUHn571v0uvqdGbeLFS9Ybv/2d5kcbJeO33sCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABd9w/YWzE9gjSSYwAAAABJRU5ErkJggg==")
*/

    Vue.component("button_control",{
      props: ["args", "name"]
      ,
      template: `<button    type=button class='btn btn-info btn-lg'
                            v-bind:style='"height:100%;width:100%; border: 0px;" + "background-color: "+    args["background_color"]  +  ";"'
                            v-on:click='event_callback()'
                            >

                                                {{args.text}}
                 </button>`
      ,
      data: function() {
       return {
         msg: "..."
         }
     },
     methods: {
        event_callback: function() {
        console.log("----- button_control, event_callback: function() = " + this.name)
            //eval("(function(){" + this.args.click_event + "})")()

            this.$emit('send', {
                                            type:               "subcomponent_event",
                                            control_name:        this.name,
                                            code:                this.args.click_event
                                        })

        }
     }

    })
}
