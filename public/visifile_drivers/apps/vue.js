{
    doc_type: 'visifile'
    ,
    name: 'vue'
    ,
    version: 1
    ,
    type: 'app'
    ,
    text: 'Vue test app'


    ,
    events: {
        "This will return the test app": {
            on: "app",
            do: function(args, returnfn) {
                new Vue({
                  el: "#" + args.root_element
                  ,
                  template: `<div>Okhay this is a Vue test app: 2</div>
                   `

                })
                //alert("root: " + args.root_element +".")
                returnfn(
                )


            }, end: null
        }

    }

}
