const container = document.getElementById("container");
const items = document.getElementsByClassName("items");
const score = document.getElementById("score");
var borderThickness = 4;
var numberOfItemsInARow = 5;
var numberOfItemsInAColumn = 4;
var numberOfItems = numberOfItemsInARow * numberOfItemsInAColumn;
var oldImageIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var newImageIndexes = oldImageIndexes.sort((a, b) => 0.5 - Math.random());  //Shuffled array of oldImageIndexes. -> contains the number of Image.

container.style.width = "959px";

function itemWidth() {
  return (container.offsetWidth - 12 * borderThickness) / numberOfItemsInARow;
}
function itemHeight() {
  return (container.offsetHeight - 10 * borderThickness) / numberOfItemsInAColumn;
}

for(var i = 0; i < 20; i++){
  items[i].style.width = `${itemWidth()}px`;
  items[i].style.height = `${itemHeight()}px`;
  items[i].style.border = `4px solid red`;

  if(i % 5 == 0){
    //Increasing the left border of left items by twice.
    items[i].style.borderLeftWidth = `8px`;
  }
  else if(i == 4 || i == 9 || i == 14 || i == 19){
    //Increasing the right border of right items by twice.
    items[i].style.borderRightWidth = `8px`;
  }
  if(i < 5){
    //Increasing the top border of top items by twice.
    items[i].style.borderTopWidth = `8px`;
  }
  else if(i >= 15){
    //Increasing the bottom border of bottom items by twice.
    items[i].style.borderBottomWidth = `7px`; //Don't know why it doesn't work with 8px.
  }
}

















//Game Code:
var gameStarted = false;
var backgroundMusic;
function startGame(){
  if(!gameStarted){   //If the game has not started, then start the game.
    gameStarted = true;

    //Background Music
    backgroundMusic = new Audio('Songs/Music2.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.play();


    for(var i = 0; i < 20; i++){
      items[i].style.cursor = "pointer";
    }
  }

}


function endGame(){
  if(gameStarted){
    gameStarted = false;
    backgroundMusic.pause();

    //Reseting variables:
    firstClickedItemIndex = null;
    itemMatched = false;
    firstClick = false;
    itemsOpen = false

    for(var i = 0; i < 20; i++){
      items[i].style.cursor = "default";
      items[i].style.backgroundImage = "url('Images/Brain.png')";   //Coverpage of items
      items[i].setAttribute('onclick', 'itemClicked(this.id)');
    }
    newImageIndexes = oldImageIndexes.sort((a, b) => 0.5 - Math.random());  //Reshuffle array for new game.

    //Reset score
    score.innerHTML = "00";
  }
}





//Pauses for time ms.
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}






var firstClickedItemIndex;
var itemMatched = false;
var firstClick = false; //Initially false
var itemsOpen = false;

function itemClicked(index){
  index = parseInt(index);
  if(gameStarted){
    if(index != firstClickedItemIndex){ //Ensure we're not clicking the same item again and again.
      firstClick = !firstClick;
    }
    //Reveal the image:
    items[index].style.backgroundImage = `url('Images/${newImageIndexes[index]}.png')`;

    if(firstClick){
      firstClickedItemIndex = index;
    }
    else{   //Check if the second image matches.
      itemsOpen = true;
      if(newImageIndexes[index] == newImageIndexes[firstClickedItemIndex]){
        console.log("Matched!");
        itemMatched = true;
        score.innerHTML = `${parseInt(score.innerHTML)+10}`;
        items[firstClickedItemIndex].onclick = null;
        items[index].onclick = null;

        if(score.innerHTML == "100"){
          backgroundMusic.pause();
          backgroundMusic = new Audio('Songs/Win.mp3');
          backgroundMusic.loop = false;
          backgroundMusic.play();
        }
      }
      else{
        if(itemsOpen){
          for(var i = 0; i < 20; i++){
              items[i].onclick = null;  //To prevent user form opening more than 2 items at the same time.
              items[i].style.cursor = "default";
          }
        }
        setTimeout(() => {
          items[firstClickedItemIndex].style.backgroundImage = "url('Images/Brain.png')";
          items[index].style.backgroundImage = "url('Images/Brain.png')"
          firstClickedItemIndex = null;

          for(var i = 0; i < 20; i++){
              items[i].setAttribute('onclick', 'itemClicked(this.id)');  //Now the user can click as both items are closed.
              items[i].style.cursor = "pointer";
          }

          itemsOpen = false;
        }, 800);
        itemMatched = false;
      }
    }
  }
}
