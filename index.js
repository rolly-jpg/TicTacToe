function Gameboard() {
    
    const ROWS = 3
    const COLUMNS = 3
    const board = []

    for (let i = 0; i < ROWS; i++) {
        board[i] = []
        for (let j = 0; j < COLUMNS; j++) {
            board[i].push(Cell())
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
    return {getBoard, updateCell, printBoard}
}

function Cell() {
    let value = 0

    const updateValue = (playerToken) => {
        value = playerToken
    }

    const getValue = () => value

    return {updateValue, getValue}
}

function Player(name, token) {
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

function GameController() {
    const playerOne = Player('John', 1)
    const playerTwo = Player('Nash', 2)
    const myGameboard = Gameboard()

    const players = [playerOne, playerTwo]

    players[0].toggleActive()
    let activePlayer = players[0]

    const switchActivePlayer = () => {
        activePlayer.toggleActive()
        activePlayer = activePlayer === players[0] ? players[1] : players[0]
        activePlayer.toggleActive()
    }

    const getActivePlayer = () => activePlayer

    const printGamebord = () => {
        myGameboard.printBoard()
        console.log(`${activePlayer.userName}'s turn`)
    }

    const playRound = (row, col) => {
        console.log(`${getActivePlayer().userName} chose cell with row: ${row} column: ${col}`)
        if ( myGameboard.updateCell(row, col, getActivePlayer().getToken()) )
            switchActivePlayer()
        printGamebord()
    }

    printGamebord()

    return {playRound, getActivePlayer}
}