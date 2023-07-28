// JavaScript source code
var lastClicked;
var lastSquare;
var lastMoves;
var previousMove;

var popUpActive = false;

var grid = clickableGrid(8,8,function(el,row,col){
    //console.log("You clicked on element:",el);
    //console.log("You clicked on row:",row);
    //console.log("You clicked on col:",col);
    //my code to try highlight clicked squares
    
    if (popUpActive) {
        return;
      }

    //this resets all the inner html of squares without pieces to blank
    var cells = document.getElementsByTagName('td');
    for (var i = 0; i < cells.length; i++) {
            cells[i].classList.remove('highlight');
    }
    var isMoved = false
    //so this should either move the piece or highlight the possible moces
    if (lastMoves != null){
        for(var i = 0; i < lastMoves.length; i++){
            if (row === lastMoves[i][0] && col === lastMoves[i][1]){
                if (lastMoves[i].length === 3) {
                    //means en passant
                    console.log("ENPASSANT")
                    movePiece(lastSquare[0],lastSquare[1],row,col,board,lastMoves[i][2],null,null)
                }
                else if (lastMoves[i].length === 4){
                    console.log("CASTLE")
                    movePiece(lastSquare[0],lastSquare[1],row,col,board,null,lastMoves[i][2],lastMoves[i][3])
                }
                else{
                    movePiece(lastSquare[0],lastSquare[1],row,col,board,null,null,null)
                }
                isMoved = true
                //now then call a function to move the piece
            }
        }
    }
    var moves = findLegalMoves(row,col,board);

    if (isMoved === false){
        if (lastClicked) lastClicked.className='';
        el.className='clicked';
        lastClicked = el;
        lastMoves = moves;
        lastSquare = [row,col];
        if (moves != null){
            for (var i = 0; i < moves.length; i++){
                cells[(moves[i][0]*8)+moves[i][1]].classList.add('highlight');
            }
        }
    }
    else{
        if (lastClicked) lastClicked.className='';
        el.className='clicked';
        lastClicked = el;
        lastMoves = null;
        lastSquare = [row,col];
    }
});

document.body.appendChild(grid);
     
// Event listener to reset squares when clicking off the grid
document.addEventListener('click', function (event) {
    if (!grid.contains(event.target)) {
        var cells = document.getElementsByTagName('td');
        for (var i = 0; i < cells.length; i++) {
            cells[i].classList.remove('highlight');
        }
        if (lastClicked) lastClicked.className = '';
        lastClicked = null;
        lastMoves = null;
        lastSquare = null;
    }
});


function clickableGrid( rows, cols, callback ){
    var grid = document.createElement('table');
    var i = 0;
    grid.className = 'grid';
    grid.classList.add('no-select'); // Add the 'no-select' class to the grid
    for (var r=0;r<rows;++r){
        var tr = grid.appendChild(document.createElement('tr'));
        for (var c=0;c<cols;++c){
            var cell = tr.appendChild(document.createElement('td'));
            if (i % 2 === 0) {
                cell.style.backgroundColor = 'khaki';
            }
            else {
                cell.style.backgroundColor = 'goldenrod';
            }
            i = i + 1;
            cell.addEventListener('click',(function(el,r,c){
                return function(){
                    callback(el,r,c);
                }
            })(cell, r, c), false);
        }
        i = i + 1;
    }
    return grid;
}


let board = getBoard();
spawnPieces(board);

