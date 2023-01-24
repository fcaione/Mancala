//Global Variables
const arrayOfCells = document.querySelectorAll(".cell")
const gameBoard = document.getElementById("board")
const arrayOfPockets = document.querySelectorAll(".pocket")
const arrayOfStores = document.querySelectorAll(".store")


//---------------------------->Functions<-------------------

//set value = 0 and iterate over array, decrementing value by 1 while current != 0
function moveMarbles(targetCell) {
    let currentValue = targetCell.dataset.value

    for (let i = (+targetCell.id + 1); i < arrayOfCells.length; i++) {
        const idSelect = document.getElementById(i)
        idSelect.dataset.value = +idSelect.dataset.value + 1;
        idSelect.innerText = idSelect.dataset.value;
        currentValue--;
        if (currentValue <= 0) break;
    }

    
    while (currentValue !== 0) {
        for (let i = 0; i < arrayOfCells.length; i++) {
            const idSelect = document.getElementById(i)
            idSelect.dataset.value = +idSelect.dataset.value + 1;
            idSelect.innerText = idSelect.dataset.value;
            currentValue--;
            if (currentValue <= 0) break;
        }
    }

// setting dataset value of current cell = 0
    currentValue = 0;
    targetCell.dataset.value = currentValue;
    targetCell.innerText = currentValue;
}

//checkWin iterate over array of pockets checking if empty if all empty gameOver=true
function checkWin() {
    //console.log(arrayOfPockets)
    //arrayOfPockets.for
}


//handle click function
function handleClick(e) {
    const value = e.target.dataset.value
    if (value <= 0) return;
    moveMarbles(e.target)
}

function initGame() {
    arrayOfPockets.forEach(element => {
        element.dataset.value = 6
        element.innerText = "6"
    })
    arrayOfStores.forEach(element => {
        element.dataset.value = 0
        element.innerText = "0"
    })

}


//---------------------------->Event Listeners<-------------------

gameBoard.addEventListener("click", handleClick)

//---------------------------->INITGAMEFUNCTION<--------------------

initGame();