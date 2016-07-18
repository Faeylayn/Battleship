
var BOARDSIZE = 10;
var victory = false;
var turn = 1;
var ships = [
  {
    name: "Aircraft Carrier",
    size: 5,
    id: 0
  },
  {
    name: "Battleship",
    size: 4,
    id: 1
  },
  {
    name: "Destroyer",
    size: 3,
    id: 2
  },
  {
    name: "Submarine",
    size: 3,
    id: 3
  },
  {
    name: "Patrol Boat",
    size: 2,
    id: 4
  },
]

var setUpBoard = function(size) {
  var board = [], row;
  for (var i = 0; i < size; i++) {
     row = [];
     for (var j = 0; j < size; j++) {
       row.push({});
     }
    board.push(row);
  }
  return board;
};

var placeShip = function(player, ship) {
  var shipPlaced = false;
  var directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
  var testCoord, testStep;
  while (!shipPlaced) {
    testCoord = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
    console.log(testCoord);
    testStep = directions[Math.floor(Math.random() * 4)];
    if (checkValidPlacement(player.fleetBoard, testCoord, testStep, ship.size)) {
      shipPlaced = true;
      addShipToBoard(player, testCoord, testStep, ship);
    }
  }
  return player;
};

var addShipToBoard = function(player, coord, step, ship) {
  var addCoord = coord.slice(0);
  var newShip = {
    id: ship.id,
    boardPositions: [coord]
  };
  player.ships.push(newShip);
  player.fleetBoard[addCoord[0]][addCoord[1]].ship = newShip;
  for (var jdx = 1; jdx < ship.size - 1; jdx++) {
    addCoord[0] += step[0];
    addCoord[1] += step[1];
    newShip.boardPositions.push(addCoord.slice(0))
    player.fleetBoard[addCoord[0]][addCoord[1]].ship = newShip;
  }
}

var checkValidPlacement = function(board, coord, step, size) {
  // var flag = true;
  var checkCoord = coord.slice(0);
  if (checkCoord[0] >= BOARDSIZE || checkCoord[0] < 0 ||
    checkCoord[1] >= BOARDSIZE || checkCoord[1] < 0 || board[checkCoord[0]][checkCoord[1]].ship) {
      return false
  }
  for (var check = 1; check < size; check++) {
    // checkCoord = coord;
    checkCoord[0] += step[0];
    checkCoord[1] += step[1];
    if (checkCoord[0] >= BOARDSIZE || checkCoord[0] < 0 ||
      checkCoord[1] >= BOARDSIZE || checkCoord[1] < 0 || board[checkCoord[0]][checkCoord[1]].ship) {
        return false
    }
  }
  return true
}

var gameStart = function () {
  var player1 = {
    fleetBoard: setUpBoard(BOARDSIZE),
    trackingBoard: setUpBoard(BOARDSIZE),
    ships: []
  };
  var player2 = {
    fleetBoard: setUpBoard(BOARDSIZE),
    trackingBoard: setUpBoard(BOARDSIZE),
    ships: []
  };

  for (var idx = 0; idx < ships.length; idx++) {
    placeShip(player1, ships[idx]);
    placeShip(player2, ships[idx]);
  }
  console.log(player1);

};
