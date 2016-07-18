
var BOARDSIZE = 10;
var victory = false;
var turn = 1;

var setUpBoard = function(size) {
  var board = [], row;
  for (var i = 0; i < size; i++) {
     row = [];
     for (var j = 0; j < size, j++) {
       row.push({});
     }
    board.push(row);
  }
  board = placeShips(board);
  return board;
};

var placeShips = function(board) {
  
};

var gameStart = function () {
  var player1Ships = setUpBoard(BOARDSIZE);
  var player2Ships = setUpBoard(BOARDSIZE);
  var player1Tracking = setUpBoard(BOARDSIZE);
  var player2Tracking = setUpBoard(BOARDSIZE);

  while (!victory) {

  }
};
