$(document).ready(function() {
  var myChar = '';
  var myMove = false;
  var grid_size = 3;
  var numNodes = 0;
  
  //use to create a board game of 3x3 to use later
  var grid = [];
  for (var i = 0; i < grid_size; i++) {
    grid[i] = [];
    for (var j = 0; j < grid_size; j++) {
      grid[i][j] = null;
    }
  }
  //make a move if its my move
  if (myMove) {
    makeMove();
  }
  //this will handle all the clicks
  $("button").click(function() {
        var cell = $(this).attr("id");
        //to restart the game
        if (cell == 'restart') {
          $("#choose").removeClass('hidden');
          $("#game").addClass('hidden');
          $('button').prop('disabled', false);
          $('#move').text('Your Move');
          grid = [
              [null, null, null],
              [null, null, null],
              [null, null, null]
          ];
          myMove = false;
          updateMove();
        }
        if (cell == 'chooseX') {
          myChar = 'X';
          $("#game").removeClass('hidden');
          $("#choose").addClass('hidden');
        } else if (cell == 'chooseO') {
          myChar = 'O';
          $("#game").removeClass('hidden');
          $("#choose").addClass('hidden');
        }
        var row = parseInt(cell[1]);
        var col = parseInt(cell[2]);
        if (!myMove) {
            grid[row][col] = false;
            myMove = true;
            updateMove();
            makeMove();
        }
        
  //helper function to make a move  
  function updateMove() {
    updateButtons();
    
    var winner = getWinner(grid);
    if (winner) {
      $("#m00").prop('disabled', true);
      $("#m01").prop('disabled', true);
      $("#m02").prop('disabled', true);
      $("#m10").prop('disabled', true);
      $("#m11").prop('disabled', true);
      $("#m12").prop('disabled', true);
      $("#m20").prop('disabled', true);
      $("#m21").prop('disabled', true);
      $("#m22").prop('disabled', true);
    }
    $("#move").text(winner == 1 ? "Computer Won!" : winner == 0 ? "You Won!" : winner == -1 ? "It's a Draw!" : "");
  }
  //decide if there is an actual winner, if not continue
  function getWinner(board) {

      // Check if someone won
      vals = [true, false];
      var allNotNull = true;
      for (var k = 0; k < vals.length; k++) {
          var value = vals[k];
          // Check rows, columns, and diagonals
          var diagonalComplete1 = true;
          var diagonalComplete2 = true;
          for (var i = 0; i < 3; i++) {
              if (board[i][i] != value) {
                  diagonalComplete1 = false;
              }
              if (board[2 - i][i] != value) {
                  diagonalComplete2 = false;
              }
              var rowComplete = true;
              var colComplete = true;
              for (var j = 0; j < 3; j++) {
                  if (board[i][j] != value) {
                      rowComplete = false;
                  }
                  if (board[j][i] != value) {
                      colComplete = false;
                  }
                  if (board[i][j] == null) {
                      allNotNull = false;
                  }
              }
              if (rowComplete || colComplete) {
                return value ? 1 : 0;
                  
              }
          }
          if (diagonalComplete1 || diagonalComplete2) { 
            return value ? 1 : 0;
          }
      }
      if (allNotNull) {
          return -1;
      }
      return null;
  }
  //upload the characters onto the board. 
  function updateButtons() {
      for (var i = 0; i < 3; i++) {
          for (var j = 0; j < 3; j++) {
            if (grid[i][j] != null) {
               $("#m" + i + "" + j).prop('disabled', true); 
            }
            if(myChar == "X") {
              $("#m" + i + "" + j).text(grid[i][j] == false ? "X" : grid[i][j] == true ? "O" : "");
            } else {
              $("#m" + i + "" + j).text(grid[i][j] == false ? "O" : grid[i][j] == true ? "X" : "");
            }
          }
      }
 }
  //calls other functions to make best move  
  function makeMove() {
    grid = makeAMove(grid);
    myMove = false;
    updateMove();
}

  function makeAMove(grid) {
      var numNodes = 0;
      return moveAlg(grid, true)[1];
  }

  var numNodes = 0;
  //this is the minimax algorithm into play, got help from http://neverstopbuilding.com/minimax
  function moveAlg(board, player) {
      numNodes++;
      var winner = getWinner(board);
      if (winner != null) {
          switch(winner) {
              case 1:
                  // AI wins
                  return [1, board]
              case 0:
                  // opponent wins
                  return [-1, board]
              case -1:
                  // Tie
                  return [0, board];
          }
      } else {
          var nextVal = null;
          var nextBoard = null;

          for (var i = 0; i < 3; i++) {
              for (var j = 0; j < 3; j++) {
                  if (board[i][j] == null) {
                      board[i][j] = player;
                      var value = moveAlg(board, !player)[0];
                      if ((player && (nextVal == null || value > nextVal)) || (!player && (nextVal == null || value < nextVal))) {
                          nextBoard = board.map(function(arr) {
                              return arr.slice();
                          });
                          nextVal = value;
                      }
                      board[i][j] = null;
                  }
              }
          }
          return [nextVal, nextBoard];
      }
  }

        
  });
});
updateMove();