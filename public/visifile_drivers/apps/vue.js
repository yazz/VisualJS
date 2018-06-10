{
    doc_type: 'appshare', name: 'vue',
    version: 1,
    descroption: 'Vue test app'


    ,
    events: {
        "This will return the test app": {
            on: "app",
            do: function(args) {
                is_app()
                Vue.component("VueApp", {
                  template: `<div>Okhay this is a Vue test app: 2</div>
                   `

                })
                return {name: "VueApp"}



            }, end: null
        }

    }

}
