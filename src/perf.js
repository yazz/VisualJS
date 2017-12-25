var diskspace = require('fd-diskspace');

var lastused = 0;
module.exports = {
    getDiskPerSecond: function() {
        diskspace.diskSpace(function (err, result)
        {
            //console.log(JSON.stringify(result,null,2) + " data received bytes / sec");
            var used1 = result.total.used;
            var diffUsed = Math.abs(used1 - lastused);
            //console.log(used1 + " disk usage bytes ");
            console.log(JSON.stringify(diffUsed , null, 2) + " disk transferred bytes / sec");
            lastused = used1;
        });

    }
};
