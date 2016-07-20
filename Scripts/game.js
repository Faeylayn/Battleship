
// start variables
var BOARDSIZE = 10;
var victory = false;
var turn = 1;
var firingPlayer, opposingPlayer;
var ships = [
  {
    name: "aircraft-carrier",
    size: 5,
    id: 0
  },
  {
    name: "battleship",
    size: 4,
    id: 1
  },
  {
    name: "destroyer",
    size: 3,
    id: 2
  },
  {
    name: "submarine",
    size: 3,
    id: 3
  },
  {
    name: "patrol-boat",
    size: 2,
    id: 4
  },
];

// board setup and ship placement

var setUpBoard = function(size) {
  //creates a square board based on the BOARDSIZE
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
  // chooses a random space and direction to place a ship until it finds a valid choice
  var shipPlaced = false;
  var directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
  var testCoord, testStep;
  while (!shipPlaced) {
    testCoord = [Math.floor(Math.random() * BOARDSIZE), Math.floor(Math.random() * BOARDSIZE)];
    testStep = directions[Math.floor(Math.random() * 4)];
    if (checkValidPlacement(player.fleetBoard, testCoord, testStep, ship.size)) {
      shipPlaced = true;
      addShipToBoard(player, testCoord, testStep, ship);
    }
  }
  return player;
};

var addShipToBoard = function(player, coord, step, ship) {
  // adds the ship to the player object for reference
  var addCoord = coord.slice(0);
  var newShip = {
    id: ship.id,
    boardPositions: [coord],
    class: ship.name
  };
  player.ships.push(newShip);
  player.fleetBoard[addCoord[0]][addCoord[1]].ship = newShip;
  for (var jdx = 1; jdx < ship.size; jdx++) {
    addCoord[0] += step[0];
    addCoord[1] += step[1];
    newShip.boardPositions.push(addCoord.slice(0));
    player.fleetBoard[addCoord[0]][addCoord[1]].ship = newShip;
  }
};

var checkValidPlacement = function(board, coord, step, size) {
  //checks if all spaces in the suggested placement are valid
  var checkCoord = coord.slice(0);
  if (checkCoord[0] >= BOARDSIZE || checkCoord[0] < 0 ||
    checkCoord[1] >= BOARDSIZE || checkCoord[1] < 0 || board[checkCoord[0]][checkCoord[1]].ship) {
      return false
  }
  for (var check = 1; check < size; check++) {
    checkCoord[0] += step[0];
    checkCoord[1] += step[1];
    if (checkCoord[0] >= BOARDSIZE || checkCoord[0] < 0 ||
      checkCoord[1] >= BOARDSIZE || checkCoord[1] < 0 || board[checkCoord[0]][checkCoord[1]].ship) {
        return false
    }
  }
  return true
};

var drawRow = function(board, i) {
  var row;
  row = "<ul>"
  for(var j = 0; j < BOARDSIZE; j++){
    if (board[i][j].missed) {
      row += "<li class='missed' data-coord='" + [i, j] + "'></li>";
    } else if (board[i][j].hit) {
      row += "<li class='hit' data-coord='" + [i, j] + "'></li>";
    } else if (board[i][j].ship) {
      row += "<li class='" + board[i][j].ship.class + "' data-coord='" + [i, j] + "'></li>";
    } else {
      row += "<li data-coord='" + [i, j] + "'></li>";
    }
  }
  row += "</ul>"
  return row
};

var drawPlayer = function(player) {
  player.$el.find('.tracking-board').children().remove();
  player.$el.find('.fleet-board').children().remove();
  for (var i = 0; i < BOARDSIZE; i++) {
    row = drawRow(player.trackingBoard, i);
    player.$el.find('.tracking-board').append($(row))
  }
  for (var i = 0; i < BOARDSIZE; i++) {
    row = drawRow(player.fleetBoard, i);
    player.$el.find('.fleet-board').append($(row))
  }
};

var drawShipsRemaining = function(player) {
  var ships = "";
  var ship;

  for(var j = 0; j < player.ships.length; j++){
    ship = "<ul class='" + player.ships[j].class + "'>"
    for (var i = 0; i < player.ships[j].boardPositions.length; i++) {
        ship += "<li></li>";
    }
    ship += "</ul><br>";
    ships += ship;
  }
  player.$el.find('.ships-remaining').append($(ships));
}

//set up interactivity

var bindEvents = function(player1, player2) {
  player1.$el.find('.tracking-board').on('click', function(event) {
    if (firingPlayer == player1) {
      handleClick(event)
    }
  })

  player2.$el.find('.tracking-board').on('click', function(event) {
    if (firingPlayer == player2) {
      handleClick(event)
    }
  })

  $('.turn-pass').on('click', function() {
    $('.turn-pass').children().remove();
    $('.announcement').text("")
    $('.announcement').removeClass("hit")
    $('.announcement').removeClass("missed")
     drawPlayer(firingPlayer);
  })
}

var checkValidShot = function(coordinates) {
  return !firingPlayer.trackingBoard[coordinates[0]][coordinates[1]].miss &&
    !firingPlayer.trackingBoard[coordinates[0]][coordinates[1]].hit
}

var handleClick = function(event) {
  var coordinates = event.target.attributes[0].value
    //if it is hit or missed than the coordinates would label it as an invalid move
   if (coordinates == "hit" || coordinates == "missed") {
     $('.announcement').text("Can't let you do that starfox")
   } else {
     coordinates = coordinates.split(",")
     placeShot(coordinates);

     if (checkVictory(opposingPlayer)) {
       alert("You win!")
     } else {
       $('.turn-pass').append($("<button>Press here for " + opposingPlayer.name + " to start their turn</button>"))
       firingPlayer.$el.find('.tracking-board').children().remove();
       firingPlayer.$el.find('.fleet-board').children().remove();
        var temp = firingPlayer;
        firingPlayer = opposingPlayer;
        opposingPlayer = temp;
     }

   }
}

var checkVictory = function(player) {
  // checks if all a player's ships are sunk
  for (var i = 0; i < player.ships.length; i++) {
    if (!player.ships[i].sunk) {
      return false;
    }
  }
  return true;
}

var checkSunk = function(ship, player) {
  // checks through each square of the ship until it finds a missed square
  for (var i = 0; i < ship.boardPositions.length; i++) {
    if (!player.fleetBoard[ship.boardPositions[i][0]][ship.boardPositions[i][1]].hit) {
      return false
    }
  }
  ship.sunk = true;
  console.log(player.$el.find('.ships-remaining .' + ship.class));
  player.$el.find('.ships-remaining .' + ship.class).addClass("hit");
  $('.announcement').text("You have hit and sunk the " + ship.class);
  $('.announcement').addClass("hit")
}

var placeShot = function(coord) {
  //registers the shot on both player's boards and then provides feedback
  if (opposingPlayer.fleetBoard[coord[0]][coord[1]].ship) {
    opposingPlayer.fleetBoard[coord[0]][coord[1]].hit = true;
    firingPlayer.trackingBoard[coord[0]][coord[1]].hit = true;
    $('.announcement').text("It's a HIT!");
    $('.announcement').addClass("hit")
    checkSunk(opposingPlayer.fleetBoard[coord[0]][coord[1]].ship, opposingPlayer)
  } else {
    opposingPlayer.fleetBoard[coord[0]][coord[1]].missed = true;
    firingPlayer.trackingBoard[coord[0]][coord[1]].missed = true;
    $('.announcement').text("Missed!")
    $('.announcement').addClass("missed")
  }
}

var gameStart = function () {
  //sets up up the board and gets the game loop started
  var player1 = {
    fleetBoard: setUpBoard(BOARDSIZE),
    trackingBoard: setUpBoard(BOARDSIZE),
    ships: [],
    $el: $('.player1'),
    name: "Player 1"
  };
  var player2 = {
    fleetBoard: setUpBoard(BOARDSIZE),
    trackingBoard: setUpBoard(BOARDSIZE),
    ships: [],
    $el: $('.player2'),
    name: "Player 2"
  };

  for (var idx = 0; idx < ships.length; idx++) {
    placeShip(player1, ships[idx]);
    placeShip(player2, ships[idx]);
  }

  drawPlayer(player1);
  drawShipsRemaining(player1);
  drawShipsRemaining(player2);

  bindEvents(player1, player2);

  firingPlayer = player1;
  opposingPlayer = player2;
};
