//my code needs a programmed representation of chess board. it needs pieces which have colours
const pieces = {
    Pawn: 'Pawn',
    Horse: 'Horse',
    Bishop: 'Bishop',
    Castle: 'Castle',
    Queen: 'Queen',
    King: 'King'
  };
class ChessPiece {
    constructor(isWhite,piece,unicode,position){
        this.isWhite = isWhite;
        this.piece = piece;
        this.hasMoved = false;
        this.position = [null,null];
        if (isWhite){
          this.unicode = '&#98'+ unicode+';'
        }
        else{
          var num = 6 + unicode;
          this.unicode = '&#98'+num+';'
        }
    }
}

class Player {
    constructor(isWhite){
        this.isWhite = isWhite;
        this.pawns = [];
        for (var i = 0; i < 8; i++){
            this.pawns.push(new ChessPiece(isWhite,pieces.Pawn, 17));
        }
        this.bishops = [];
        this.horses = [];
        this.castles = [];
        for (var i = 0; i < 2; i++){
            this.bishops.push(new ChessPiece(isWhite,pieces.Bishop,15));
            this.horses.push(new ChessPiece(isWhite,pieces.Horse,16));
            this.castles.push(new ChessPiece(isWhite,pieces.Castle,14));
        }
        this.king = new ChessPiece(isWhite,pieces.King,12);
        this.queen = new ChessPiece(isWhite,pieces.Queen,13);
        this.pieces = this.pawns.concat(this.bishops, this.horses, this.castles, this.queen, this.king);
    }
}

const white = new Player(true);
const black = new Player(false);


var myBoard = new Array(8);
for (var i = 0; i < myBoard.length; i++) {
  myBoard[i] = new Array(8).fill(null);
}

function setBoardUp(blackPieces, whitePieces, chessBoard){
    chessBoard[0] = [blackPieces.castles[0], blackPieces.horses[0],blackPieces.bishops[0], blackPieces.queen, blackPieces.king, blackPieces.bishops[1],blackPieces.horses[1],blackPieces.castles[1]];
    chessBoard[7] = [whitePieces.castles[0], whitePieces.horses[0],whitePieces.bishops[0], whitePieces.queen, whitePieces.king, whitePieces.bishops[1],whitePieces.horses[1],whitePieces.castles[1]];
    for(var i = 0; i < 8; i++){
        chessBoard[1][i] = blackPieces.pawns[i];
        chessBoard[6][i] = whitePieces.pawns[i];
    }
}

setBoardUp(black,white,myBoard)

function findPseudoMoves(row,col,board){
    //this function takes in a number of a square, finds what piece is there
    const piece = board[row][col]; // Get the piece at the selected square
    const legalMoves = [];
    if (piece != null){
      // Check legal moves based on the piece type
      switch (piece.piece) {
        case pieces.Pawn:
          // Define possible moves
          const pawnMoves = piece.isWhite ? [[-1, 0], [-1, -1], [-1, 1]] : [[1, 0], [1, -1], [1, 1]];

          // Helper function to check if the position is within the board boundaries
          function isValidPosition(row, col) {
            return row >= 0 && row < 8 && col >= 0 && col < 8;
          }

          // Check the first forward move
          let newRow = parseInt(row) + pawnMoves[0][0];
          let newCol = parseInt(col) + pawnMoves[0][1];
          if (isValidPosition(newRow, newCol) && board[newRow][newCol] === null) {
            legalMoves.push([newRow, newCol]);

            // Check the double forward move if the pawn hasn't moved yet
            newRow += pawnMoves[0][0];
            newCol += pawnMoves[0][1];
            if (!piece.hasMoved && isValidPosition(newRow, newCol) && board[newRow][newCol] === null) {
              legalMoves.push([newRow, newCol]);
            }
          }

          // Check other moves
          for (let i = 1; i < pawnMoves.length; i++) {
            newRow = row + pawnMoves[i][0];
            newCol = col + pawnMoves[i][1];
            //if square diagonally isnt null and the piece is of other colour then can take
            if (isValidPosition(newRow, newCol) && board[newRow][newCol] !== null) {
              if (board[newRow][newCol].isWhite !== piece.isWhite) {
                legalMoves.push([newRow, newCol]);
              }
            }
            //else then check for en passant
            else if (isValidPosition(newRow, newCol) && board[newRow][newCol] === null) {
              // Check for en passant
              if (lastMove.length === 5) {
                let fromRow = lastMove[0];
                let fromCol = lastMove[1];
                let toRow = lastMove[2];
                let toCol = lastMove[3];
                let lastMovedPiece = lastMove[4];
        
                // Check if the last move was a double forward and that the pawn is in same row, then if move goes into same column
                if (Math.abs(toRow - fromRow) === 2 && Math.abs(toCol - newCol) === 0 && Math.abs(toRow - row) === 0) {
                  console.log(lastMovedPiece.isWhite !== piece.isWhite,lastMovedPiece.piece === pieces.Pawn)

                  if (lastMovedPiece.piece === pieces.Pawn && lastMovedPiece.isWhite !== piece.isWhite) {
                    // En passant is possible, add the en passant capturing move
                    console.log("It works?")
                    legalMoves.push([newRow, newCol, [toRow, toCol]]);
                  }
                }
                
              }
            } 
          }
          break;

        case pieces.Horse:
          // Implement logic for legal moves for horse
          //two in vert or horiz and then one in horiz or vert
          const horseMoves = [
            [-2, -1], [-2, 1],   // Upward moves
            [-1, -2], [-1, 2],   // Leftward moves
            [1, -2],  [1, 2],    // Rightward moves
            [2, -1],  [2, 1]     // Downward moves
          ];
          for (let i = 0; i < horseMoves.length; i++) {
            let newRow = row + horseMoves[i][0];
            let newCol = col + horseMoves[i][1];
    
            // Check if the new position is within the grid (8x8)
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
              if (board[newRow][newCol] === null){
                legalMoves.push([newRow, newCol]);
              }
              else if(board[newRow][newCol].isWhite !== board[row][col].isWhite){
                legalMoves.push([newRow, newCol]);  
              }
            }
        }
          break;
        case pieces.Bishop:
          // Implement logic for legal moves for bishop
          const bishopMoves = [
            [-1, -1], [-1, 1],   // Diagonal moves (up-left, up-right)
            [1, -1],  [1, 1]     // Diagonal moves (down-left, down-right)
          ];
    
          for (let i = 0; i < bishopMoves.length; i++) {
              let newRow = row + bishopMoves[i][0];
              let newCol = col + bishopMoves[i][1];
      
              while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {      
                  // Check if there is a piece blocking the diagonal path
                  if (board[newRow][newCol] === null){
                    legalMoves.push([newRow, newCol]);
                  }
                  else if(board[newRow][newCol].isWhite !== board[row][col].isWhite){
                    legalMoves.push([newRow, newCol]);  
                  }
                  if (board[newRow][newCol] !== null) {
                    break;
                  }
                 
                  newRow += bishopMoves[i][0];
                  newCol += bishopMoves[i][1];
              }
          }
          break;
        case pieces.Castle:
          // Implement logic for legal moves for castle
          const castleMoves = [
            [-1, 0],  // Upward move
            [0, -1],  // Leftward move
            [0, 1],   // Rightward move
            [1, 0]    // Downward move
          ];
      
          for (let i = 0; i < castleMoves.length; i++) {
              let newRow = row + castleMoves[i][0];
              let newCol = col + castleMoves[i][1];
      
              while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                  // Check if the new position is empty or has an opponent's piece
                  if (board[newRow][newCol] === null){
                      legalMoves.push([newRow, newCol]);
                  }
                  else if(board[newRow][newCol].isWhite !== board[row][col].isWhite){
                    legalMoves.push([newRow, newCol]);  
                  }

      
                  // Stop the vertical or horizontal path if there is a piece blocking it
                  if (board[newRow][newCol] !== null) {
                      break;
                  }
      
                  newRow += castleMoves[i][0];
                  newCol += castleMoves[i][1];
              }
          }
          break;
        case pieces.Queen:
          // Implement logic for legal moves for queen
          const queenMoves = [
            [-1, -1], [-1, 0], [-1, 1],   // Diagonal moves (up-left, up, up-right)
            [0, -1],                  [0, 1],   // Horizontal moves (left, right)
            [1, -1],  [1, 0],  [1, 1]    // Diagonal moves (down-left, down, down-right)
          ];
      
          for (let i = 0; i < queenMoves.length; i++) {
              let newRow = row + queenMoves[i][0];
              let newCol = col + queenMoves[i][1];
      
              while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                  // Check if the new position is empty or has an opponent's piece
                  if (board[newRow][newCol] === null){
                    legalMoves.push([newRow, newCol]);
                  }
                  else if(board[newRow][newCol].isWhite !== board[row][col].isWhite){
                    legalMoves.push([newRow, newCol]);  
                  }

                  // Stop the path if there is a piece blocking it
                  if (board[newRow][newCol] !== null) {
                      break;
                  }
      
                  newRow += queenMoves[i][0];
                  newCol += queenMoves[i][1];
              }
          }

          break;
        case pieces.King:
          // Implement logic for legal moves for king
          const kingMoves = [
            [-1, -1], [-1, 0], [-1, 1],   // Diagonal moves (up-left, up, up-right)
            [0, -1], [0, 1],   // Horizontal moves (left, right)
            [1, -1], [1, 0], [1, 1]    // Diagonal moves (down-left, down, down-right)
          ];
      
          for (let i = 0; i < kingMoves.length; i++) {
            let newRow = row + kingMoves[i][0];
            let newCol = col + kingMoves[i][1];
            // Check if the new position is empty or has an opponent's piece
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8){
              if (board[newRow][newCol] === null){
                legalMoves.push([newRow, newCol]);
              }
              else if(board[newRow][newCol].isWhite !== board[row][col].isWhite){
                legalMoves.push([newRow, newCol]);  
              }
            }
          }
          //so if king hasnt moved and not currently in check and castles havent moved then and any squares king goes over is not in check
          if (piece.hasMoved == false){
            const castles = piece.isWhite ? white.castles : black.castles;
            for(var i = 0; i < castles.length; i++){
              if(castles[i].hasMoved == false){
                //so if pieces between are null then its gucci
                var inBetweenSquares;
                var isLeft;
                if(piece.position[1]>castles[i].position[1]){
                  inBetweenSquares = [[piece.position[0], 1],[piece.position[0], 2],[piece.position[0], 3]]
                  isLeft = true
                }
                else{
                  inBetweenSquares = [[piece.position[0], 5],[piece.position[0], 6]]
                  isLeft = false
                }
                //
                var isEmptyInBetweens = true
                for (var j = 0; j < inBetweenSquares.length; j++){
                  if(board[inBetweenSquares[j][0]][inBetweenSquares[j][1]] != null){
                    isEmptyInBetweens = false
                  }
                }
                if (isEmptyInBetweens){
                  //then should add to legal moves but in special way such that it can be checked correctly
                  //so maybe 4 length array with one with castle position to be moved
                  if (isLeft){
                    legalMoves.push([piece.position[0],piece.position[1]-2,[piece.position[0],0],[piece.position[0],piece.position[1]-1]])
                  }
                  else{
                    legalMoves.push([piece.position[0],piece.position[1]+2,[piece.position[0],7],[piece.position[0],piece.position[1]+1]])
                  }
                }
              }
            }
          }
               
          
          break;
        default:
          break;
      }
      
      return legalMoves;
    }
}


function findLegalMoves(row,col,board){
  //this should use check for check 
  //for moves in legal moves should now check each one of them for whether in check or not and removes the ones that arent
  let pseudoMoves = findPseudoMoves(row,col,board);
  console.log(pseudoMoves);
  let legalMoves = [];
  if (pseudoMoves != null)
  {
    for (let i = 0; i< pseudoMoves.length; i++){
      if (pseudoMoves[i].length === 4){
        // this means that the move is en passant
        console.log("castling check")
        console.log(pseudoMoves[i])
        // in third array is position of castle
        // in fourth array is position for castle to move into and subsequently postion that also needs to be checked for castling
        
        //so specially call check for check for each position for king. so king cant use it to get out of check remember
        //so three check for check calss then???
        let pieceToMove = board[row][col]; 
        let firstCheck = false;
        let secondCheck = false;
        let thirdCheck = false;
        //first check whether the king is in check right now
        if (checkForCheck(pieceToMove.isWhite,black,white, board) === false){
          firstCheck = true;
        }
        //second check whether the in between square is in check
        board[pseudoMoves[i][3][0]][pseudoMoves[i][3][1]] = pieceToMove;
        pieceToMove.position[0] = pseudoMoves[i][3][0];
        pieceToMove.position[1] = pseudoMoves[i][3][1];
        board[row][col] = null;
        if (checkForCheck(pieceToMove.isWhite,black,white, board) === false){
          secondCheck = true;
        }
        //third check for whether the king in finalised castling position is in check or not
        //move castle
        let castle = board[pseudoMoves[i][2][0]][pseudoMoves[i][2][1]];
        board[pseudoMoves[i][3][0]][pseudoMoves[i][3][1]] = castle;
        castle.position[0] = pseudoMoves[i][3][0];
        castle.position[1] = pseudoMoves[i][3][1];
        //move king
        board[pseudoMoves[i][0]][pseudoMoves[i][1]] = pieceToMove;
        pieceToMove.position[0] = pseudoMoves[i][0];
        pieceToMove.position[1] = pseudoMoves[i][1];
        if (checkForCheck(pieceToMove.isWhite,black,white, board) === false){
          thirdCheck = true;
        }

        //after checks are done reset the board
        board[pseudoMoves[i][2][0]][pseudoMoves[i][2][1]] = castle
        castle.position[0] = pseudoMoves[i][2][0]
        castle.position[1] = pseudoMoves[i][2][1]
        board[pseudoMoves[i][3][0]][pseudoMoves[i][3][1]] = null;
        board[pseudoMoves[i][0]][pseudoMoves[i][1]] = null;

        board[row][col] = pieceToMove;
        pieceToMove.position[0] = row;
        pieceToMove.position[1] = col;


        if (firstCheck && secondCheck && thirdCheck){
          legalMoves.push(pseudoMoves[i]);
        }
        //will need to add a bit to move piece to make this work

        //enPassPiece = board[pseudoMoves[i][2][0]][pseudoMoves[i][2][1]]
        //board[pseudoMoves[i][2][0]][pseudoMoves[i][2][1]] = null
      }
      
      //so this should have special checks for whether its a castling
      //so if any square king goes across is in check then dont allow

      else {
        //do fake move and then revert positions
        let pieceToMove = board[row][col]; 
        let pieceToTake = board[pseudoMoves[i][0]][pseudoMoves[i][1]];
        board[pseudoMoves[i][0]][pseudoMoves[i][1]] = pieceToMove;
        pieceToMove.position[0] = pseudoMoves[i][0];
        pieceToMove.position[1] = pseudoMoves[i][1];
        board[row][col] = null;

        var enPassPiece;
        if (pseudoMoves[i].length === 3){
          // this means that the move is en passant
          console.log("en passant check")
          enPassPiece = board[pseudoMoves[i][2][0]][pseudoMoves[i][2][1]]
          board[pseudoMoves[i][2][0]][pseudoMoves[i][2][1]] = null
        }
        

        if (checkForCheck(pieceToMove.isWhite,black,white, board) === false){
          legalMoves.push(pseudoMoves[i]);
        }
        if (pseudoMoves[i].length === 3){
          // this means that the move is en passant
          board[pseudoMoves[i][2][0]][pseudoMoves[i][2][1]] = enPassPiece
        }
        board[pseudoMoves[i][0]][pseudoMoves[i][1]] = pieceToTake;
        console.log(pieceToTake)
        board[row][col] = pieceToMove;
        pieceToMove.position[0] = row;
        pieceToMove.position[1] = col;
      }
      
    }
  }
  return legalMoves

}


//check for check will still see pieces even if taken?
//when a piece moves to check and then u click it again its like they forget about check??? what the fuck
//similar for king


//https://www.chessprogramming.org/Search
function checkForCheck(isWhite, blackPieces, whitePieces, board) {
    const king = isWhite ? whitePieces.king : blackPieces.king;
    const pieces = isWhite ? blackPieces.pieces : whitePieces.pieces;
    for (let i = 0; i < pieces.length; i++) {
      const moves = findPseudoMoves(pieces[i].position[0], pieces[i].position[1], board);
      if (moves != null) {
        for (let j = 0; j < moves.length; j++) {
          if (king.position[0] === moves[j][0] && king.position[1] === moves[j][1]) {
            return true; // King is in check
          }
        }
      }
    }
    return false; // King is not in check
  }

var lastMove = []

function movePiece(row,col,newRow,newCol,board,enPassSquare, castlePos, castleMovePos){
  let piece = board[row][col]; // Get the piece at the selected square
  let oldPiece = board[newRow][newCol];
  board[newRow][newCol] = piece;
  board[row][col] = null;

  var cells = document.getElementsByTagName('td');

  if (enPassSquare != null){
    oldPiece = board[enPassSquare[0]][enPassSquare[1]]
    board[enPassSquare[0]][enPassSquare[1]] = null;
    console.log(oldPiece)
    console.log("En passantyyy")
    cells[(enPassSquare[0]*8)+enPassSquare[1]].innerHTML = "";
  }

  if (castlePos != null && castleMovePos != null){
    //this code should move castle into castlemove pos and clear castle from prievous square
    let castle = board[castlePos[0]][castlePos[1]];
    board[castlePos[0]][castlePos[1]] = null;
    castle.position = castleMovePos;
    console.log(castle.position)
    castle.hasMoved = true;
    cells[(castlePos[0]*8)+castlePos[1]].innerHTML = "";
    cells[(castleMovePos[0]*8)+castleMovePos[1]].innerHTML = castle.unicode;
    board[castleMovePos[0]][[castleMovePos[1]]] = castle;
  }

  if (oldPiece != null){
    let index = white.pieces.indexOf(oldPiece);
    if (index > -1) { // only splice array when item is found
      white.pieces.splice(index, 1); // 2nd parameter means remove one item only
      console.log("removed white piece")

    }
    index = black.pieces.indexOf(oldPiece);
    if (index > -1) { // only splice array when item is found
      black.pieces.splice(index, 1); // 2nd parameter means remove one item only
      console.log("removed black piece")

    }
    console.log(black.pieces)
    console.log(white.pieces)

  }
  cells[(newRow * 8) + newCol].innerHTML = piece.unicode;
  cells[(row*8)+col].innerHTML = "";
  piece.hasMoved = true;
  piece.position = [newRow,newCol];
  lastMove = [row, col, newRow, newCol, piece]
  console.log(lastMove)
  console.log(board)

  // IF PAWN HAS GOTTEN TO THE END OF THE BOARD THEN CALL POPUP BOX 
  // Example usage:
  if (piece.piece == pieces.Pawn && (piece.position[0] == 0 || piece.position[0] == 7)) {
    //queen castle bishop horse
    const colourOfUpgrade = piece.isWhite ? white : black;
    const pieceIsWhite = piece.isWhite
    let unicodes = [13,14,15,16]
    if (piece.isWhite){
      for (var i =0 ; i < unicodes.length; i++){
        unicodes[i] = '&#98'+ unicodes[i]+';'
      }
    }
    else{
      for (var i =0 ; i < unicodes.length; i++){
        var num = 6 + unicodes[i];
        unicodes[i] = '&#98'+ num+';'
      }
    }
    // Show the pop-up at position (100, 200)
    // Usage example:
    showPopup(unicodes, 100, 200)
    .then((choice) => {
      console.log(`User chose: ${choice}`);
      //first remove the piece from board and player pieces. then create and add the new piece
      //then add it to the board and cells yeyeye

      //remove the piece
      let index = white.pieces.indexOf(piece);
      if (index > -1) { // only splice array when item is found
        white.pieces.splice(index, 1); // 2nd parameter means remove one item only
        console.log("removed white piece")
      }
      index = black.pieces.indexOf(piece);
      if (index > -1) { // only splice array when item is found
        black.pieces.splice(index, 1); // 2nd parameter means remove one item only
        console.log("removed black piece")
      }

      cells[(newRow * 8) + newCol].innerHTML = choice;
      //create the piece, add it to correct pieces and to the board
      //based on the position of choice in the array will reveal which piece it is
      var newPiece
      console.log("before switch")
      switch(choice){
        ////queen castle bishop horse  [13,14,15,16]
        case unicodes[0]:
          //its a queen
          console.log("queen")
          newPiece = new ChessPiece(pieceIsWhite,pieces.Queen,13)
          break
        case unicodes[1]:
          //its a castle
          console.log("castle")
          newPiece = new ChessPiece(pieceIsWhite,pieces.Castle,14)
          break
        case unicodes[2]:
          //its a bishop
          console.log("bishop")
          newPiece = new ChessPiece(pieceIsWhite,pieces.Bishop,15)
          break
        case unicodes[3]:
          //its a horse
          console.log("horses")
          newPiece = new ChessPiece(pieceIsWhite,pieces.Horse,16)
          break
      }
      console.log("after switch")
      colourOfUpgrade.pieces.push(newPiece)
      console.log(newPiece)
      board[newRow][newCol] = newPiece;
      newPiece.hasMoved = true;
      newPiece.position = [newRow,newCol];

      // You can use the selected choice here
    })
    .catch(() => {
      // In case the user closes the pop-up without making a choice
      console.log('Pop-up closed without making a choice');
    });

    //so now have to wait for the click and then change the piece and save it to the board and what not

  }
}

// JavaScript source code
// so use grid created by grid.js as its appended to html
// https://en.wikipedia.org/wiki/Chess_symbols_in_Unicode

function spawnPieces(board) {
  var grid = document.getElementsByClassName("grid");
  var rows = document.getElementsByTagName('tr');
  var cells = document.getElementsByTagName('td');
  for (var row = 0; row < board.length; row++){
    for (var cell = 0; cell < board[row].length; cell++){
      if (board[row][cell] != null){
        cells[row*8+cell].innerHTML = board[row][cell].unicode;
        board[row][cell].position = [row,cell]
      }
    }
  }
}

function getBoard(){
  return myBoard;
}



// so this needs methods to get valid moves
// also needs its own representation of the board