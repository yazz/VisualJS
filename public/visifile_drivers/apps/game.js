{
    doc_type: 'visifile'
    ,
    name: 'game'
    ,
    version: 1
    ,
    type: 'app'
    ,
    text: 'game app'

    ,
    initText: 'game is ALIVE!!!!'
    ,
    events: {
        "This will return the game app": {
            on: "app",
            do: function(args, returnfn) {
                returnfn(
                    new Moon({
                      el: "#current_app",
                      template: `
                      <div id="app2">
                      saSs
                        <h1>{{msg}}</h1>
                        <input type="text" m-model="msg"/>
                      </div>
                      `,
                      data: {
                        msg: "Hello Moon!"
                      }
                    })
                )


            }, end: null
        }

    }

}
