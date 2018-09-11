import html from './client.html'
import './client.css'
import createBoard from '../model/board'
import {view} from './view'
import {Events} from 'monsterr'
let boardSize = 200 // TODO set boardsize
let iAm
let board

// Export the complete stage as the default export
export default {
  // Remember to include your html in stage
  // The html is shown only during the stage.
  html,

  // Optionally define commands
  commands: {
    finish (client) {
      client.stageFinished() // <== this is how a client reports finished
      return false // <== false tells client not to pass command on to server
    }
  },

  // Optionally define events
  events: {
    'youAre': (client, piece) => {
      iAm = piece
      client.getChat().append('You are ' + piece)
    },
    'gameover': (client, msg) => {
      client.getChat().append('GAMEOVER: ' + msg)
    },
    'move': (client, move) => {
      board.move(move.piece, move.position)
      view.draw(client.getCanvas(), board.getBoard(), boardSize)
    },
    [Events.END_STAGE] (client) {
      client.getChat().append('Resetting game')
      board.resetBoard()
    }
  },

  setup: (client) => {
    client.getCanvas().on('mouse:down', (event) => {
      let position = view.getIndex({x: event.e.clientX, y: event.e.clientY})
      if (position > -1) {
        if (board.isMoveLegal(iAm, position)) {
          client.send('move', position)
        }
      }
    })
    console.log('setting up board')
    board = createBoard()
    console.log('drawing it')
    view.draw(client.getCanvas(), board.getBoard(), boardSize)
    console.log('reports ready to the server')
    client.send('clientReady', 'client')
  },
  // Configure options
  options: {}
}
