const io = require('socket.io-client')
const socket = io('http://localhost:3000/clients').connect()

socket.on('connect', () => console.log('connected'))
socket.on('disconnect', () => {
  console.log('disconnected')
  process.exit(0)
})
socket.on('error', err => console.log(err))
socket.on('event', handleEvent)

let boardState
let gameover

let me
function handleEvent (event) {
  console.log('event', event)
  if (event.type === '@monsterr/START_STAGE') { // setup
    boardState = [
      null, null, null,
      null, null, null,
      null, null, null
    ]
    gameover = false
    socket.emit('event', { type: 'clientReady', payload: 'bot' })
  } else if (event.type === 'youAre') {
    me = event.payload
    if (me === 'X') {
      let myMove = calculateBestMove(boardState, me)
      console.log('making the first move: ' + myMove)
      move(boardState, myMove, me)
      sendMoveToServer(myMove)
    }
  } else if (event.type === 'move') {
    // quick and dirty random move
    if (event.payload.piece !== me) { // ignore updates about me as the gamestate is set here
      boardState[event.payload.position] = event.payload.piece
      move(event.payload.position)

      // check if the game is over, TODO should validate as well
      gameover = true
      for (let i = 0; i < 9; i++) if (boardState[i] === null) gameover = false

      if (!gameover) {
        let myMove = calculateBestMove(boardState, me)
        console.log('found a brilliant move: ' + myMove)
        move(boardState, myMove, me)
        sendMoveToServer(myMove)
      } else {
        console.log('no more moves left, it was a draw')
      }
    }
  } else if (event.type === 'gameover') {
    gameover = true
  }
}

let checkSeq = (board, piece, p0, p1, p2) => {
  if (board[p0] === null && board[p1] === piece && board[p2] === piece) return p0
  if (board[p0] === piece && board[p1] === null && board[p2] === piece) return p1
  if (board[p0] === piece && board[p1] === piece && board[p2] === null) return p2
  return -1 // if nothing is found
}

let calculateBestMove = (board, me) => {
  // check possible wins
  for (let x = 0; x < 3; x++) { let position = checkSeq(board, me, x * 3, x * 3 + 1, x * 3 + 2); if (position >= 0) return position }
  for (let y = 0; y < 3; y++) { let position = checkSeq(board, me, y, y + 3, y + 6); if (position >= 0) return position }
  let position1 = checkSeq(board, me, 0, 4, 8); if (position1 >= 0) return position1
  let position2 = checkSeq(board, me, 2, 4, 6); if (position2 >= 0) return position2

  // else block enemy wins
  let enemy = me === 'X' ? 'O' : 'X'
  for (let x = 0; x < 3; x++) { let position = checkSeq(board, enemy, x * 3, x * 3 + 1, x * 3 + 2); if (position >= 0) return position }
  for (let y = 0; y < 3; y++) { let position = checkSeq(board, enemy, y, y + 3, y + 6); if (position >= 0) return position }
  let position3 = checkSeq(board, enemy, 0, 4, 8); if (position3 >= 0) return position3
  let position4 = checkSeq(board, enemy, 2, 4, 6); if (position4 >= 0) return position4

  // NOTE special cases are not done, like make dual lines

  // if nothing else, make a random move
  console.log('no other move, making something up')
  let positionRandom = Math.floor(Math.random() * 9)
  while (board[positionRandom] !== null) {
    positionRandom = Math.floor(Math.random() * 9)
  }
  return positionRandom
}

let sendMoveToServer = (position) => {
  let delay = 500 + Math.random() * 1000
  delay = 0 // TODO for testing
  setTimeout(() => socket.emit('event', { type: 'move', payload: position }), delay)
}

let move = (board, position, piece) => {
  board[position] = piece
}
