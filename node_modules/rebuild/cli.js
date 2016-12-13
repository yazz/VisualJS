#!/usr/bin/env node
var path    = require("path"),
    fs      = require("fs"),
    child   = require('child_process'),
    optimist= require('optimist'),
    argv    = optimist.usage("Usage: $0 [command to run]")
                    .options("w", {
                        alias: "watch",
                        default: process.cwd(),
                        describe: "A file or directory to watch for changes."
                    })
                    .options("h", {
                        alias: "help",
                    }).argv;


if (argv.help || !argv.watch) {
    optimist.showHelp();
} else {

    if (!argv._.length) {
        console.log("You forgot to tell me what to run when the files changes!");
        process.exit(1);
    }        

    var watcherCount = 0,
        directories = Array.isArray(argv.watch) ? argv.watch : [argv.watch],
        command = argv._.join(" "),
        lastUpdate = Date.now();
        
    console.log("When files changes, I'll run this for you: %s", command);

    function handleFileChange(event, filename) {
        
        // Sometimes a whole bunch of events get fired, so make sure some time has passed
        var now = Date.now();
        if (now - lastUpdate > 50) {
            console.log(now);
            console.log("Okay, running '" + command + "'");
            
            child.exec(command, function (error, stdout, stderr) {
                console.log(stdout);
                //console.log(stderr);

                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });            
            
            lastUpdate = now;
        }
    }       

    // Setup watches
    directories.forEach(function(dir) {
        var fullPath = path.resolve(dir);
        
        if (fs.existsSync(fullPath)) {
            console.log("Watching %s for changes.", fullPath);
            
            fs.watch(fullPath, handleFileChange);
            watcherCount++;   
        } else {
            console.log("Path %s doesn't exist.", fullPath);            
        }
    });
    
    // If no watches are set, exist
    if (!watcherCount) {
        console.log("No directories to watch, exiting. :(");            
        process.exit(1);
    }
}