
var BOARDSIZE = 10;
var victory = false;
var turn = 1;
var ships = [
  {
    name: "Aircraft Carrier",
    size: 5,
    boardPositions: null
  },
  {
    name: "Battleship",
    size: 4,
    boardPositions: null
  },
  {
    name: "Destroyer",
    size: 3,
    boardPositions: null
  },
  {
    name: "Submarine",
    size: 3,
    boardPositions: null
  },
  {
    name: "Patrol Boat",
    size: 2,
    boardPositions: null
  },
]

var setUpBoard = function(size) {
  var board = [], row;
  for (var i = 0; i < size; i++) {
     row = [];
     for (var j = 0; j < size, j++) {
       row.push({});
     }
    board.push(row);
  }
  return board;
};

var placeShip = function(player, ship) {
  var shipPlaced = false;
  var directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
  var testCoord, testDir;
  while (!shipPlaced) {
    testCoord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    testDir = Math.floor(Math.random() * 4);
    
  }
};

var gameStart = function () {
  var player1 = {
    fleetBoard: setUpBoard(BOARDSIZE),
    trackingBoard = setUpBoard(BOARDSIZE)
  };
  var player2 = {
    fleetBoard: setUpBoard(BOARDSIZE),
    trackingBoard = setUpBoard(BOARDSIZE)
  };

  for (var idx = 0; idx < ships.length; idx++) {
    placeShip(player1, ships[idx]);
    placeShip(player2, ships[idx]);
  }


  while (!victory) {

  }
};
