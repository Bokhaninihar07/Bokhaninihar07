var Board;
const HUMAN_PLAYER = 'X';
const AI_PLAYER = 'O';
const winCombo = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],

  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],

  [0, 4, 8],
  [2, 4, 6]
];

const cells = Array.from(document.querySelectorAll(".cell"));

function setMessage(msg){
 document.getElementById("message").innerHTML = msg;
}

const startGame = () => {
 Board = Array.from(Array(9).keys());
 for(var i=0;i<cells.length;i++){
  cells[i].innerHTML = "";
  cells[i].style.removeProperty('background');
  cells[i].addEventListener('click',TurnClick,false);
 }
}
function TurnClick(cell){
 
 if(typeof Board[cell.target.id] == 'number'){
 setMessage("its a X turn Now!");
  Turn(cell.target.id,HUMAN_PLAYER);
  if(!checkTie()){
   setMessage("its a O turn Now!");
   Turn(bestspot(), AI_PLAYER);
  }
 }
 else{
    var msg1 = "That spot already taken!";
    setMessage(msg1);
  }
}
const Turn = (cellid,player) =>{
 Board[cellid] = player;
 document.getElementById(cellid).innerHTML = player;
 
 let GameWon = checkWin(Board,player);
 if(GameWon){
  GameOver(GameWon);
 }
}

function checkWin(board,player){
 let plays = board.reduce((a,e,i) => (e === player) ? a.concat(i) : a, []);
 let GameWon = false;
 for(let [index,win] of winCombo.entries()){
   if(win.every(elem => plays.indexOf(elem) > -1)){
   GameWon = {index:index,player:player};
   break;
  }
 }
 return GameWon;
}

function GameOver(Game){
 for(let index of winCombo[Game.index]){
  document.getElementById(index).style.background = (Game.player == HUMAN_PLAYER) ? "blue" : "red";
 }
	 setMessage(Game.player == HUMAN_PLAYER ? "You Win!" : "You Lose!");
 for(var i=0;i<cells.length;i++){
  cells[i].removeEventListener('click',TurnClick,false);
	 }
}

function checkTie(){
 if(emptysquare(Board).length == 0){
  for(var i=0;i<cells.length;i++){
   cells[i].removeEventListener('click',TurnClick,false);
  }
  setMessage("its Tie! Try again");
  return true;
 }
 return false;
}

function emptysquare(){
  return Board.filter(item => typeof item === 'number');
}
function bestspot(){
 return minimax(Board, AI_PLAYER).index;
}

function minimax(newBoard, player){
 let availableSpots = emptysquare();
 if (checkWin(newBoard, HUMAN_PLAYER)) {
    return { score: -10 };
  } 
  else if (checkWin(newBoard, AI_PLAYER)) {
    return { score: 10 };
  } 
  else if (availableSpots.length === 0) {
    return { score: 0 };
  }
  
  let moves = [];

  for (let i=0; i<availableSpots.length; i++) {
    let move = {};
    move.index = newBoard[availableSpots[i]];
    newBoard[availableSpots[i]] = player;

    if (player === AI_PLAYER) {
      let result = minimax(newBoard, HUMAN_PLAYER);
      move.score = result.score;
    } 
    else {
      let result = minimax(newBoard, AI_PLAYER);
      move.score = result.score;
    } 
    
    newBoard[availableSpots[i]] = move.index;
    moves.push(move);
  }
  let bestMove;
  if (player === AI_PLAYER) {
    let bestScore = -10000;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } 
  else {
    let bestScore = 10000;
    for (let i=0; i<moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }
  
  return moves[bestMove];
}