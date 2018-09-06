import html from './client.html'
import './client.css'
import {board} from '../model/board'
import {view} from './view'
let boardSize = 200 // TODO set boardsize

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
      client.getChat().append('You are ' + piece)
    },
    'gameover': (client, msg) => {

    },
    'move': (client, move) => {
      board.move(move.piece, move.position)
      view.draw(client.getCanvas(), board.getBoard(), boardSize)
    }
  },

  setup: (client) => {
    client.getCanvas().on('mouse:down', (event) => {
      let position = view.getIndex({x: event.e.clientX, y: event.e.clientY})
      if (position > -1) {
        client.send('move', position)
      }
    })

    view.draw(client.getCanvas(), board.getBoard(), boardSize)
    client.send('clientReady')
  },
  // Configure options
  options: {}
}
