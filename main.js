//---------------------------->Global Variables<-------------------

const arrayOfCells = document.querySelectorAll(".cell")
const gameBoard = document.getElementById("board")
const arrayOfPockets = document.querySelectorAll(".pocket")
const arrayOfStores = document.querySelectorAll(".store")
const playersTurnText = document.getElementById("player-turn")
const restartButton = document.getElementById("restart-btn")
const pockets = Array.from(arrayOfPockets)
let isPlayerATurn = false
let gameOver = false

//---------------------------->Functions<-------------------

//set value = 0 and iterate over array, decrementing value by 1 while current != 0
function moveMarbles(targetCell) {
    let currentValue = targetCell.dataset.value
    let lastPlaced;

    for (let i = (+targetCell.id + 1); i < arrayOfCells.length; i++) {
        const idSelect = document.getElementById(i)

        //skip over other players store
        if ((isPlayerATurn && idSelect.id === "13") || (!isPlayerATurn && idSelect.id === "6")) continue;

        idSelect.dataset.value = +idSelect.dataset.value + 1;
        idSelect.innerText = idSelect.dataset.value;
        currentValue--;

        //set last elemen to a variable and check if its a store
        lastPlaced = idSelect;

        //break out if no more marbles to give
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

            lastPlaced = idSelect;
            if (currentValue <= 0) break;
        }
    }

    // setting dataset value of current cell to 0
    currentValue = 0;
    targetCell.dataset.value = currentValue;
    targetCell.innerText = currentValue;

    let capturableCellId = findMirrorCell(lastPlaced)

    //only if a capturable cell is returned from findMirrorCell
    if (document.getElementById(capturableCellId)) {
        captureMarbles(capturableCellId, lastPlaced);
    }

    checkWin(); // has to be before update turn
    updateImageClasses();
    updateTurn(lastPlaced);
}

//go again if last placed marble was in store otherwise swap turns
function updateTurn(cell) {
    if (gameOver === true) return;
    if (cell === arrayOfStores[0] || cell === arrayOfStores[1]) {
        return;
    } else {
        isPlayerATurn = !isPlayerATurn
    }

    if (isPlayerATurn) {
        playersTurnText.innerHTML = "<h2>Player 1's turn!</h2>"
    } else {
        playersTurnText.innerHTML = "<h2>Player 2's turn!</h2>"
    }
    toggleClassClickable();
}

function toggleClassClickable() {
    const playerAPockets = pockets.filter(elem => {
        return elem.dataset.player === "a"
    })
    const playerBPockets = pockets.filter(elem => {
        return elem.dataset.player === "b"
    })

    if (isPlayerATurn) {
        playerAPockets.forEach(elem => {
            elem.classList.toggle("clickable")
        })
        playerBPockets.forEach(elem => {
            elem.classList.remove("clickable")
        })
    } else {
        playerBPockets.forEach(elem => {
            elem.classList.toggle("clickable")
        })
        playerAPockets.forEach(elem => {
            elem.classList.remove("clickable")
        })
    }
}

//if data value of last placed = 1, capture pieces on other side
function findMirrorCell(cell) {
    if (cell.dataset.value === "1") {
        if (isPlayerATurn){
            switch (cell.id) {
                case "0":
                    return "12";
                case "1":
                    return "11";
                case "2":
                    return "10";
                case "3":
                    return "9"
                case "4":
                    return "8"
                case "5":
                    return "7";
            }
        } else {
            switch(cell.id) {
                case "7":
                    return "5"
                case "8":
                    return "4"
                case "9":
                    return "3"
                case "10":
                    return "2"
                case "11":
                    return "1"
                case "12":
                    return "0"
            }
        }
    }
}

function captureMarbles(capturedCellId, currentCell) {
    const capturedCell = document.getElementById(capturedCellId)
    if (capturedCell.dataset.player === "a" && +capturedCell.dataset.value > 0) {
        document.getElementById("13").dataset.value = +document.getElementById("13").dataset.value + +capturedCell.dataset.value + +currentCell.dataset.value;
        document.getElementById("13").innerText = document.getElementById("13").dataset.value

        //updating captured cell to 0
        capturedCell.dataset.value = 0;
        capturedCell.innerText = capturedCell.dataset.value

        //updating current tile to 0
        currentCell.dataset.value = 0
        currentCell.innerText = currentCell.dataset.value

    } else if (capturedCell.dataset.player === "b" && +(capturedCell.dataset.value) > 0){
        document.getElementById("6").dataset.value = +document.getElementById("6").dataset.value + +capturedCell.dataset.value + +currentCell.dataset.value;
        document.getElementById("6").innerText = document.getElementById("6").dataset.value

        //updating captured cell to 0
        capturedCell.dataset.value = 0;
        capturedCell.innerText = capturedCell.dataset.value

        //updating current cell to 0
        currentCell.dataset.value = 0
        currentCell.innerText = currentCell.dataset.value
    }
}


//checkWin iterate over array of pockets checking if empty if all empty gameOver=true
function checkWin() {
    const playerAPockets = pockets.filter(elem => {
        return elem.dataset.player === "a"
    })
    const playerBPockets = pockets.filter(elem => {
        return elem.dataset.player === "b"
    })

    let isAEmpty = playerAPockets.every(elem => {
        return elem.dataset.value === "0"
    })
    let isBEmpty = playerBPockets.every(elem => {
        return elem.dataset.value === "0"
    })

    //if player a or b turn and all elements data value === 0 game=over
    if (isAEmpty || isBEmpty) {
        gameOver = true
        const bStore = document.getElementById("13")
        const aStore = document.getElementById("6")

        let sum = playerBPockets.reduce((acc, elem) => {
            return acc += (+elem.dataset.value);
        }, 0)

        let currentValue = +bStore.dataset.value
        currentValue += sum;
        bStore.dataset.value = currentValue
        bStore.innerText = currentValue;

        sum = playerAPockets.reduce((acc, elem) => {
            return acc += (+elem.dataset.value);
        }, 0)

        currentValue = +aStore.dataset.value
        currentValue += sum;
        aStore.dataset.value = currentValue
        aStore.innerText = currentValue;

        //set all pockets = 0
        arrayOfPockets.forEach(elem => {
            elem.dataset.value = 0
            elem.innerText = 0
        })  
    }

    if (gameOver) endGame();
}

function endGame() {
    const playerBStore = document.getElementById("13")
    const playerAStore = document.getElementById("6")

    if (+playerAStore.dataset.value > +playerBStore.dataset.value) {
        playersTurnText.innerHTML = "<h2>Player 1 wins</h2>"
    } else if (+playerBStore.dataset.value > +playerAStore.dataset.value) {
        playersTurnText.innerHTML = "<h2>Player 2 wins</h2>"
    } else {
        playersTurnText.innerHTML = "<h2>It's a tie!</h2>"
    }

    pockets.forEach(elem => {
        elem.classList.remove("clickable")
    })
}

//handle click function
function handleClick(e) {
    const value = e.target.dataset.value
    if (value <= 0) return;

    //allows player to interact with their pockets only during their turn
    if (isPlayerATurn && e.target.dataset.player === "a") {
        moveMarbles(e.target)
    } else if (!isPlayerATurn && e.target.dataset.player === "b") {
        moveMarbles(e.target)
    }
}

//init the values for each cell to standard game
function initGame() {
    gameOver = false

    arrayOfPockets.forEach(element => {
        element.dataset.value = 4
        element.innerText = "4"
        element.classList.remove("clickable")
    })

    arrayOfStores.forEach(element => {
        element.dataset.value = 0
        element.innerText = "0"
    })
    updateImageClasses();
    updateTurn();
}


function updateImageClasses() {
    arrayOfCells.forEach(elem => {
        elem.classList.remove("empty", "marble1", "marble2", "marble3", "marble4", "marble5", "marble6")
    })
    arrayOfCells.forEach(elem => {
        switch (elem.dataset.value) {
            case "0":
                elem.classList.add("empty")
                break;
            case "1":
                elem.classList.add("marble1")
                break;
            case "2":
                elem.classList.add("marble2")
                break;
            case "3":
                elem.classList.add("marble3")
                break;
            case "4":
                elem.classList.add("marble4")
                break;
            case "5":
                elem.classList.add("marble5")
                break;
            case "6":
            default:
                elem.classList.add("marble6")
                break;
        }
    })
}

//---------------------------->Event Listeners<-------------------

arrayOfCells.forEach(elem => {
    elem.addEventListener("click", handleClick)
})

restartButton.addEventListener("click", initGame)

//---------------------------->INITGAMEFUNCTION<--------------------

initGame();