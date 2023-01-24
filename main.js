//---------------------------->Global Variables<-------------------
const arrayOfCells = document.querySelectorAll(".cell")
const gameBoard = document.getElementById("board")
const arrayOfPockets = document.querySelectorAll(".pocket")
const arrayOfStores = document.querySelectorAll(".store")
let isPlayerATurn = false
let gameOver = false


//---------------------------->Functions<-------------------

//set value = 0 and iterate over array, decrementing value by 1 while current != 0
function moveMarbles(targetCell) {
    let currentValue = targetCell.dataset.value

    for (let i = (+targetCell.id + 1); i < arrayOfCells.length; i++) {
        const idSelect = document.getElementById(i)

        //skip over other players store
        if ((isPlayerATurn && idSelect.id === "13") || (!isPlayerATurn && idSelect.id === "6")) continue;

        idSelect.dataset.value = +idSelect.dataset.value + 1;
        idSelect.innerText = idSelect.dataset.value;
        currentValue--;
        if (currentValue <= 0) break;
    }

    // continue from beginning of cells array at index 0 creating loop of arrays if needed    
    while (currentValue > 0) {
        for (let i = 0; i < arrayOfCells.length; i++) {
            const idSelect = document.getElementById(i)

            //skip over other players store
            if ((isPlayerATurn && idSelect.id === "13") || (!isPlayerATurn && idSelect.id === "6")) continue;

            idSelect.dataset.value = +idSelect.dataset.value + 1;
            idSelect.innerText = idSelect.dataset.value;
            currentValue--;
            if (currentValue <= 0) break;
        }
    }

    // setting dataset value of current cell to 0
    currentValue = 0;
    targetCell.dataset.value = currentValue;
    targetCell.innerText = currentValue;

    checkWin();
}

//checkWin iterate over array of pockets checking if empty if all empty gameOver=true
function checkWin() {
    const pockets = Array.from(arrayOfPockets)

    gameOver = pockets.every(element => {
        return element.dataset.value === "0"
    })

    
    //create new array of pockets player A and test whether they're all empty
    const playerAPockets = pockets.filter(elem => {
        return elem.dataset.player === "a"
    })
    let isAEmpty = playerAPockets.every(elem => {
        return elem.dataset.value === "0"
    })
    
    //create new array of pockets player B and test whether they're empty
    const playerBPockets = pockets.filter(elem => {
        return elem.dataset.player === "b"
    })
    let isBEmpty = playerBPockets.every(elem => {
        return elem.dataset.value === "0"
    })

    //if player a or b turn and all elements data value === 0 game=over
    if (isPlayerATurn && isAEmpty) {
        gameOver = true
        //adding all numbers in opposing players pockets to their store
        const sum = playerBPockets.reduce((acc, elem) => {
            return acc += (+elem.dataset.value);
        }, 0)
        const bStore = document.getElementById("13")
        let value = +bStore.dataset.value
        console.log(value)
        console.log(sum)
        value += sum;
        bStore.innerText = value;

        //set all pockets = 0
        arrayOfPockets.forEach(elem => {
            elem.dataset.value = 0
            elem.innerText = 0
        })
    } else if (!isPlayerATurn && isBEmpty) {
        gameOver = true
        const sum = playerAPockets.reduce((acc, elem) => {
            return acc += (+elem.dataset.value);
        }, 0)
        const aStore = document.getElementById("6")
        let value = +aStore.dataset.value
        console.log(value)
        console.log(sum)
        value += sum;
        aStore.innerText = value;

        //set all pockets to 0
        arrayOfPockets.forEach(elem => {
            elem.dataset.value = 0
            elem.innerText = 0
        })
    }
}


//skip turn functions
// function skipTurn()

//handle click function
function handleClick(e) {
    const value = e.target.dataset.value
    if (value <= 0) return;

    //allows player to interact with their stores only during their turn
    if (isPlayerATurn && e.target.dataset.player === "a") {
        moveMarbles(e.target)
    } else if (!isPlayerATurn && e.target.dataset.player === "b"){
        moveMarbles(e.target)
    }
}

function initGame() {
    arrayOfPockets.forEach(element => {
        element.dataset.value = 4
        element.innerText = "4"
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