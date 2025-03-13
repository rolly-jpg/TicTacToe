const Cell = function() {
    let value = 0

    const updateValue = (playerToken) => {
        value = playerToken
    }

    const getValue = () => value

    return {updateValue, getValue}
}

const Gameboard = (function() {
    
    const ROWS = 3
    const COLUMNS = 3
    const board = []
    populateBoard()

    function populateBoard() {
        for (let i = 0; i < ROWS; i++) {
            board[i] = []
            for (let j = 0; j < COLUMNS; j++) {
                board[i].push(Cell())
            }
        }
    }

    const getBoard = () => board

    const updateCell = (row, col, playerToken) => {
        if (row < 0 || row >= ROWS || col < 0 || col >= COLUMNS) {
            console.log('invalid input values')
            return
        }

        if (!board[row][col].getValue()) {
            board[row][col].updateValue(playerToken)
            return 1
        }
        else {
            console.log(`The cell has already been played`)
        }
    }

    const printBoard = () => {
        const boardWithValues = board.map(row => row.map(cell => cell.getValue()))
        console.log(boardWithValues)
    }

    const checkWin = () => {
        for (let i = 0; i < ROWS; i++) {
            if (board[i][0].getValue() === board[i][1].getValue() &&
                board[i][1].getValue() === board[i][2].getValue() &&
                board[i][2].getValue() !== 0)
                    return true
        }

        for (let j = 0; j < COLUMNS; j++) {
            if (board[0][j].getValue() === board[1][j].getValue() &&
                board[1][j].getValue() === board[2][j].getValue() &&
                board[2][j].getValue() !== 0)
                    return true
        }

        if (board[0][0].getValue() === board[1][1].getValue() &&
            board[1][1].getValue() === board[2][2].getValue() && 
            board[2][2].getValue() !== 0)
                return true
        if (board[0][2].getValue() === board[1][1].getValue() && 
            board[1][1].getValue() === board[2][0].getValue() &&
            board[2][0].getValue() !== 0)
                return true
    }
    
    const reset = function() {
        board.length = 0
        populateBoard()
    }

    return {getBoard, updateCell, printBoard, checkWin, reset}
})()

const Player = function(name, token) {
    function createUser() {
        const userName = name
        const id = crypto.randomUUID()
        return {userName, id}
    }

    function createPlayer() {
        let active = false
        const playerToken = token
        const {userName} = createUser()

        const toggleActive = () => active = !active  
        const isActive = () => active
        const getToken = () => playerToken
        
        return {userName, toggleActive, isActive, getToken}
    }

    return createPlayer()
}

const GameController = (function() {
    let gameWinner = ''

    const playerOne = Player('John', 'X')
    const playerTwo = Player('Nash', 'O')

    const players = [playerOne, playerTwo]

    players[0].toggleActive()
    let activePlayer = players[0]

    const switchActivePlayer = () => {
        activePlayer.toggleActive()
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
        activePlayer.toggleActive()
    }

    const getActivePlayer = () => activePlayer
    const getWinner = () => gameWinner

    const printGameboard = () => {
        Gameboard.printBoard()
        console.log(`${activePlayer.userName}'s turn`)
    }

    const playRound = (row, col) => {
        console.log(`${getActivePlayer().userName} chose cell with row: ${row} column: ${col}`)
        if ( Gameboard.updateCell(row, col, getActivePlayer().getToken()) )
            if (Gameboard.checkWin()) {
                gameWinner = getActivePlayer().userName
                console.log(`${gameWinner} WON`)
            }
            else {
                switchActivePlayer()
            }

        printGameboard()            
    }

    const resetGame = () => {
        Gameboard.reset()
        gameWinner = ''
        if (getActivePlayer() !== players[0]) {
            switchActivePlayer()
        }
        screenController.updateScreen()
    }

    printGameboard()

    return {playRound, getActivePlayer, getWinner, resetGame}
})()

const screenController = (function () {
    const boardDiv = document.querySelector('.board')
    const scoreDiv = document.querySelector('.score')
    const controlsDiv = document.querySelector('.controls')

    //game reset button
    const resetBtn = document.createElement('button')
    resetBtn.textContent = 'Reset Game'
    resetBtn.addEventListener('click', resetBtnHandler)
    controlsDiv.appendChild(resetBtn)

    function updateScreen() {
        boardDiv.innerHTML = ''

        const board = Gameboard.getBoard()
        const activePlayer = GameController.getActivePlayer()
        
        for (let i = 0; i < board.length; i++) {
            const newRow = document.createElement('div')
            newRow.classList.add('gridRow')

            for (let j = 0; j < board[i].length; j++) {
                const cell = document.createElement('button')
                cell.classList.add('gridCell')
                cell.dataset.row = i
                cell.dataset.col = j
                if (board[i][j].getValue())
                    cell.textContent = board[i][j].getValue()
                newRow.appendChild(cell)
            }
            boardDiv.appendChild(newRow)
        }

        //grid click handling
        const cells = document.querySelectorAll('.gridCell')
        cells.forEach(cell => cell.addEventListener('click', clickHandler))

        //current player text field
        if (GameController.getWinner())
            scoreDiv.textContent = `${GameController.getWinner()} HAS WON`
        else 
            scoreDiv.textContent = `${activePlayer.userName}'s turn`
    }

    function clickHandler() {
        if (!GameController.getWinner()) {
            GameController.playRound(this.dataset.row, this.dataset.col)
        }
        updateScreen()
    }

    function resetBtnHandler() {
        GameController.resetGame()
    }

    updateScreen()
    return {updateScreen}
})()