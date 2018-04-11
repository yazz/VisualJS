'use strict';

var fs                          = require('fs');
var path                        = require('path');


var os                          = require('os')




function processMessagesFromMainProcess() {
    process.on('message', (msg) => {
        //console.log('Message from parent:', msg);
        process.send({send_from_child: "Received message from parent and returned"});
    })
}



processMessagesFromMainProcess();
