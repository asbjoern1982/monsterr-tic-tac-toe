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

let piece
function handleEvent (event) {
  console.log('event', event)
  if (event.type === '@monsterr/START_STAGE') { // setup
    boardState = [
      null, null, null,
      null, null, null,
      null, null, null
    ]
    socket.emit('event', { type: 'clientReady', payload: 'bot' })
  } else if (event.type === 'youAre') {
    piece = event.payload
    if (piece === 'X') {
      let position = Math.floor(Math.random() * 9)
      console.log('making the first move: ' + position)
      boardState[position] = piece
      socket.emit('event', { type: 'move', payload: position })
    }
  } else if (event.type === 'move') {
    // quick and dirty random move
    if (event.payload.piece !== piece) {
      boardState[event.payload.position] = event.payload.piece
      let gameover = true
      // is there any moves left? ignoring 3 in a row
      for (let i = 0; i < 9; i++) if (boardState[i] === null) gameover = false

      if (!gameover) {
        let position = Math.floor(Math.random() * 9)
        while (boardState[position] != null) {
          position = Math.floor(Math.random() * 9)
        }
        console.log('found a brilliant move: ' + position)
        boardState[position] = piece
        socket.emit('event', { type: 'move', payload: position })
      } else {
        console.log('gameover!')
      }
    }
  }
}
