async function ls(args) {
    description("ls function returns current files")
   // console.log("2)  Service called with args:  " + JSON.stringify(args,null,2))
    console.log("4.5 callbackFn exists")
    if (args) {
      //  console.log("*) Args = " + args.text)
    }
    var exec = require('child_process').exec;

    var execPromise = new Promise(
                        done => {
                                    exec('ls', function(error, stdout, stderr)
                                    {
                                        done(stdout)
                                    })
                                })

    var val = await execPromise
    return val
}
