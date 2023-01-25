//---------------------------->Global Variables<-------------------

const arrayOfCells = document.querySelectorAll(".cell")
const gameBoard = document.getElementById("board")
const arrayOfPockets = document.querySelectorAll(".pocket")
const arrayOfStores = document.querySelectorAll(".store")
let isPlayerATurn = true
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

    checkWin();
    let capturableCell = findMirrorCell(lastPlaced)
    if (capturableCell) {
        captureMarbles(capturableCell);
    }
    addImageClasses();
    updateTurn(lastPlaced);
}

//go again if last placed marble was in store otherwise swap turns
function updateTurn(cell) {
    if (cell === arrayOfStores[0] || cell === arrayOfStores[1]) {
        return;
    } else {
        isPlayerATurn = !isPlayerATurn
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

function captureMarbles(capturedCellId) {
    const capturedCell = document.getElementById(capturedCellId)
    if (capturedCell.dataset.player === "a") {
        document.getElementById("13").dataset.value = +capturedCell.dataset.value + 1;
        document.getElementById("13").innerText = document.getElementById("13").dataset.value
    } else {
        document.getElementById("6").dataset.value = +capturedCell.dataset.value + 1;
        document.getElementById("6").innerText = document.getElementById("6").dataset.value
        console.log("captured")
        capturedCell.dataset.value = 0;
        capturedCell.innerText = capturedCell.dataset.value
    }
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
    arrayOfPockets.forEach(element => {
        element.dataset.value = 4
        element.innerText = "4"
    })

    arrayOfStores.forEach(element => {
        element.dataset.value = 0
        element.innerText = "0"
    })
    addImageClasses();
}

function addImageClasses() {
    arrayOfCells.forEach(elem => {
        switch (elem.dataset.value) {
            case "0":
                elem.classList.remove(elem.classList[2])
                elem.classList.add("empty")
                break;
            case "1":
                elem.classList.replace(elem.classList[2], "marble1")
                break;
            case "2":
                elem.classList.replace(elem.classList[2], "marble2")
                break;
            case "3":
                elem.classList.replace(elem.classList[2], "marble3")
                break;
            case "4":
                elem.classList.remove(elem.classList[2])
                elem.classList.add("marble4")
                break;
            case "5":
                elem.classList.replace(elem.classList[2], "marble5")
                break;
            case "6":
                elem.classList.replace(elem.classList[2], "marble6")
                break;
            default:
                elem.classList.replace(elem.classList[2], "marble6")
                break;
        }
    })
}

//---------------------------->Event Listeners<-------------------

gameBoard.addEventListener("click", handleClick)

//---------------------------->INITGAMEFUNCTION<--------------------

initGame();