var diskspace = require('fd-diskspace');
var os        = require('os')

var lastused        = 0;
var startMeasure    = cpuAverage();



module.exports = {



    getDiskPerSecond: function(cb) {
        diskspace.diskSpace(function (err, result)
        {
            //console.log(JSON.stringify(result,null,2) + " data received bytes / sec");
            var used1 = result.total.used;
            var diffUsed = Math.abs(used1 - lastused);
            //console.log(used1 + " disk usage bytes ");
            lastused = used1;
            cb.call(this,diffUsed);;
        });

    }
    
    
    ,
    
    
    
    
    getPercentageCPU: function() {
        //Grab second Measure
        var endMeasure = cpuAverage();

        //Calculate the difference in idle and total time between the measures
        var idleDifference = endMeasure.idle - startMeasure.idle;
        var totalDifference = endMeasure.total - startMeasure.total;

        //Calculate the average percentage CPU usage
        var percentageCPU = 100 - ~~(100 * idleDifference / totalDifference);

        return percentageCPU;        
    }
};






function cpuAverage() {

    //Initialise sum of idle and time of cores and fetch CPU info
    var totalIdle = 0, totalTick = 0;
    var cpus = os.cpus();

    //Loop through CPU cores
    for(var i = 0, len = cpus.length; i < len; i++) {

        //Select CPU core
        var cpu = cpus[i];

        //Total up the time in the cores tick
        for(var type in cpu.times) {
            totalTick += cpu.times[type];
        }

        //Total up the idle time of the core
        totalIdle += cpu.times.idle;
    }

    //Return the average Idle and Tick times
    return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
}



