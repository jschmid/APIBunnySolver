var async = require('async');
var Client = require('node-rest-client').Client;

var client = new Client();

var processCell = function (cell, callback) {
    console.log('hello ' + cell);
    callback();
};

var q = async.queue(processCell, 1);

client.get('http://apibunny.com/mazes', function(data, response) {
  obj = JSON.parse(data);
  console.log(obj.mazes[0].links.start);
});
