console.log(1)
var requireFromUrl = require('require-from-url/sync');
console.log(2)
var HelloWorld = requireFromUrl("https://nodeway.org/HelloWorld.js");
console.log(3)
var api = new HelloWorld;
console.log(4)
api.on('data', console.log);
console.log(5)
