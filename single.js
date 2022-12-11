const { performance } = require('perf_hooks');

var results = [];
benchmark()


function benchmark() {
    var x = 0;
    for (var i = 0; i < 100; i++) {
        var startTime = performance.now() 
        while (x < 1000000000) {
        x = x + 1;
        }
        x=0;
        var endTime = performance.now()
        var exe_time = (endTime - startTime);
        results.push(exe_time);
        console.log((i+1) + "%" + " => " + exe_time + " ms")
    }
    var middle = 0;
    for (var i = 2; i < results.length; i++) {
        middle = middle + results[i];
    }
    var middle = middle / (results.length - 2)
    console.log("Avarage Execution Time: " + middle + " ms");
    console.log("Single Core Score: " + Math.floor(((1/middle)*1000000)) + " points")
}