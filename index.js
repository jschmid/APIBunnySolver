var async = require('async');
var Client = require('node-rest-client').Client;

var client = new Client();

var allCells = new Array();
var found = new Array();

var processCell = function (cell, callback) {
    console.log('Processing cell: ' + cell.id + ' [' + cell.row + ',' + cell.column + ']');
    client.get('http://apibunny.com/cells/' + cell.id, fetchCell(cell, callback));
};

var q = async.queue(processCell, 1);

q.drain = function() {
    console.log('All items have been downloaded');
    showMaze();
}

var fetchMaze = function(data, response) {
  var obj = JSON.parse(data);
  var startCell = obj.mazes[0].links.start;
  found.push(startCell);
  q.push({
    'id': startCell,
    'row': 0,
    'column' : 0
  });
};

var fetchCell = function(cell, callback) {
  return function(data, response) {
    var obj = JSON.parse(data);
    var links = obj.cells[0].links;
    addObj(obj, cell.row, cell.column);

    checkCell(links, 'east', cell.row, cell.column + 1);
    checkCell(links, 'west', cell.row, cell.column - 1);
    checkCell(links, 'north', cell.row - 1, cell.column);
    checkCell(links, 'south', cell.row + 1, cell.column);

    callback();
  }
};

var checkCell = function(links, direction, row, column) {
  var newCell = links[direction];
  if(newCell && found.indexOf(newCell) < 0) {
    found.push(newCell);
    q.push({
      'id': newCell,
      'row': row,
      'column' : column
    });
  }
}

var addObj = function(obj, row, column) {
  if(!allCells[row]) {
    allCells[row] = new Array();
  }
  allCells[row][column] = obj.cells[0];
}

var showMaze = function() {
  for(var row in allCells) {
    var r = allCells[row];
    for(var column in r) {
      var obj = r[column];

      console.log('[' + row + ',' + column + ',' + obj.id + ',' + obj.type + '] ' + obj.name);
    }
  }
}

client.get('http://apibunny.com/mazes', fetchMaze);
