
// Global variables
const cardValues = ["1","2","3","4","5","6","7","8","1","2","3","4","5","6","7","8"];
let timerStart = false;
let deck = [];
let selectedCards = [];
let clickCount = 0;
let totalMoves = 0;
let pairCount = 0;
let gameTimeSec = 0;
let gameTimeMin = 0;
let matchTimer;
let gameTimer;
let finalStars = 0;


// Starts the game by calling shuffle function and set returned cards values for a deck object.
// A deck object's properties are used in the HTML content and the card values are visible only
// when the player select a card.
function startGame() {
  const shuffleCards = shuffle(cardValues);
  deck = {
    card_a:cardValues[0],
    card_b:cardValues[1],
    card_c:cardValues[2],
    card_d:cardValues[3],
    card_e:cardValues[4],
    card_f:cardValues[5],
    card_g:cardValues[6],
    card_h:cardValues[7],
    card_i:cardValues[8],
    card_j:cardValues[9],
    card_k:cardValues[10],
    card_l:cardValues[11],
    card_m:cardValues[12],
    card_n:cardValues[13],
    card_o:cardValues[14],
    card_p:cardValues[15]
  };
  cardEventListener();
}


// Shuffle function from http://stackoverflow.com/a/2450976
// Shuffles card's values which are defined in global cardValues variable.
function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}


// Add a click-based event listener for all cards that are not matched cards 
// When the player clicks card, cardClick function is executed.
function cardEventListener() {
  let deckCards = document.querySelectorAll(".card:not(.match)");
  for (let i = 0; i < deckCards.length; i++) {
    deckCards[i].addEventListener('click', cardClick);
  }
}


// Finds the player's selected card (checks card's attribute). This function is executed
// every time when the player clicks the card and click-based event listener is active.
// Checks if the game timer is not started and start it by calling timeCount function
// (the timer is started once when the game is started, the first card is clicked).
// Removes card's click-based event listener, so the player can't click the same card twice.
// Adds card's value to the selectedCards array (value is one of the cardValues array's value).
// Replaces the card's question mark and shows the card's value in the HTML document.
// Adds "open" class for the card which is clicked, the player can see the card's value.
// Increases global variable clickCount value by one every time when the card is opened.
// Calls checkClick function.
function cardClick() {
  let cardElement = this.querySelector("div");
  let selectedCard = cardElement.getAttribute("class");
  if (!timerStart) {
    gameTimer = setInterval(timeCount, 1000);
	timerStart = true;
  }
  this.removeEventListener("click", cardClick);
  selectedCards.push(deck[selectedCard]);
  this.children[0].textContent = deck[selectedCard];
  this.classList.add("open");
  clickCount ++;
  checkClick();
}


// Checks player's mouse clicks during the game.
// Removes a click-based event listener from the cards if the player has selected two cards,
// so the player can't select more cards.
// If two cards were selected, setTimeout method starts the timer and cards will be visible
// for the player. After the timer expires checkMatch function is executed.
// Increases global variable totalMoves by one, this variable is used for game star rating.
// Sets clickCount value from 2 to 0, which means that there are no cards selected.
// Calls moves function.
function checkClick() {
  if (clickCount == 2) {
    let deckCard = document.querySelectorAll(".card:not(.match)");
    for (let i = 0; i < deckCard.length; i++) {
      deckCard[i].removeEventListener('click', cardClick);
    }
    matchTimer = setTimeout(checkMatch, 650);
    totalMoves ++;
    clickCount = 0;
	moves();
  }
}


// Checks if a pair match.
// If a pair match, add "match" class for the cards (cards stay visible).
// If a pair match and if it was the last pair, the game ends and stopTimer and gameOver functions are executed.
// If a pair doesn't match replaces the card's value with question mark and remove "open" class (card is closed).
// "Clears" selectedCards array.
// Calls cardEventListener function so the player can choose a new card.
function checkMatch() {
  let openCards = document.querySelectorAll(".open");
  if (selectedCards[0] === selectedCards[1]) {
    openCards[0].classList.add("match");
    openCards[1].classList.add("match");
	pairCount++;
	if (pairCount === cardValues.length/2) {
	  stopTimer();
	  gameOver();
	}
  }
  else {		
    openCards[0].children[0].textContent = "?";
    openCards[1].children[0].textContent = "?";	
  }
  openCards[0].classList.remove("open");
  openCards[1].classList.remove("open");
  selectedCards = [];
  cardEventListener();
}


// Counts a total game time and updates the time in the HTML content.
// The timer is running until the player wins or the game is restarted.
function timeCount() {
  gameTimeSec++;
  if (gameTimeSec % 60 === 0) {
    gameTimeMin++;
	gameTimeSec = 0;
  }
   document.getElementById("game_time").textContent = gameTimeMin + " m " + gameTimeSec + " s";
}


// Stops the game timer.
function stopTimer() {
  clearInterval(gameTimer);
}


// Shows moves in the HTML content during the game (2 clicks is one move).
function moves() {
  document.getElementById("moves").textContent = totalMoves + " Moves";
  starRate();
}


// Shows the current star rating during the game in the HTML content.
// Sets integer value for global variable finalStars which is used in congratulatory dialog.
function starRate() {
  if ((totalMoves <= 12) && (gameTimeSec <= 25) && (gameTimeMin == 0)) {
    document.getElementById("stars").textContent =  "\u2605\u2605\u2605\u2605\u2605";
    finalStars = 5;
  }
  else if ((totalMoves <= 14) && (gameTimeSec <= 30) && (gameTimeMin == 0)) {
    document.getElementById("stars").textContent =  "\u2605\u2605\u2605\u2605\u2606";
    finalStars = 4;
  }
  else if ((totalMoves <= 16) && (gameTimeSec <= 33) && (gameTimeMin == 0)) {
    document.getElementById("stars").textContent =  "\u2605\u2605\u2605\u2606\u2606";
    finalStars = 3;	
  }
  else if ((totalMoves <= 20) && (gameTimeSec <= 39) && (gameTimeMin == 0)) {
    document.getElementById("stars").textContent =  "\u2605\u2605\u2606\u2606\u2606"; 
    finalStars = 2;
  }
  else {
    document.getElementById("stars").textContent =  "\u2605\u2606\u2606\u2606\u2606";
    finalStars = 1;
  }
}


// Removes a click-based event listener from cards.
function removeClickListener(){
  let card = document.querySelectorAll(".card");
  for (let i = 0; i < card.length; i++) {
    card[i].removeEventListener('click', cardClick);
  }
}


// Resets the HTML content.
function resetGame(){
  let card = document.querySelectorAll(".card");
  for (let i = 0; i < card.length; i++) {
	card[i].classList.remove("match"); 
    card[i].classList.remove("open"); 	
	card[i].children[0].textContent = "?";
  }
  document.getElementById("game_time").textContent = gameTimeMin + " m " + gameTimeSec + " s";
  document.getElementById("stars").textContent =  "\u2605\u2605\u2605\u2605\u2605";
  document.getElementById("moves").textContent = totalMoves + " Moves";
}


// The game ends when the player wins (all of the cards are matched).
// Sets the HTML content for congratulatory dialog and displays dialog. 
function gameOver() {
  document.getElementById("total-moves").textContent = "With " +totalMoves + " moves ";
  if (finalStars > 1) {
    document.getElementById("total-stars").textContent = "and " + finalStars + " Stars";
  }
  else {
    document.getElementById("total-stars").textContent = "and " + finalStars + " Star";
  }
  $("#game_over_dialog").dialog("open");
}


// jQuery congratulatory dialog.
$(document).ready(function() {
  $( "#game_over_dialog" ).dialog({
    autoOpen: false,
    show: {
      effect: "blind",
      duration: 1000
    },
    hide: {
      effect: "explode",
      duration: 4000
    },
	width: 270,
	height: 250,
	buttons: {
      "Close": function() {
        $( this ).dialog( "close" );
      },
	  "Play Again": function() {
        $( this ).dialog( "close" );
		restartGame();
      }
    }
    });
});


//Initializes variables and restart the game.
 
function restartGame() {
  $("#game_over_dialog").dialog("close");
  stopTimer();
  deck = [];
  selectedCards = [];
  clickCount = 0;
  totalMoves = 0;
  finalStars = 0;
  pairCount = 0;
  timerStart = false;
  gameTimeSec = 0;
  gameTimeMin = 0;
  removeClickListener();
  clearTimeout(matchTimer);
  resetGame();
  startGame();
}

startGame();
