{
    doc_type: 'visifile'
    ,
    name: 'appEditor'
    ,
    version: 1
    ,
    type: 'app'
    ,
    text: 'app editor'

    ,
    initText: 'App editor is ALIVE!!!!'
    ,
    events: {
        "This will return the editor app": {
            on: "app",
            do: function(args, returnfn) {
                new Vue({
                  el: "#" + args.root_element
                  ,
                  template: `<div>Okhay this DataBox app editor</div>
                   `

                })
                //alert("root: " + args.root_element +".")
                returnfn(
                )


            }, end: null
        }

    }

}
