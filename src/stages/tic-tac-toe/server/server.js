import {board} from '../model/board'

let players = []
let readyCount = 0

// Export stage as the default export
export default {
  // Optionally define commands
  commands: {
    'consede': (server, clientId) => {
      let piece = players[0] === clientId ? 'X' : 'O'
      server.send('gameover', piece + ' conseded')
    }
  },

  // Optionally define events
  events: {
    'move': (server, clientId, position) => {
      let piece = players[0] === clientId ? 'X' : 'O'
      if (board.isMoveLegal(piece, position)) {
        let gameover = board.move(piece, position)
        server.send('move', {piece: piece, position: position}).toAll()
        if (gameover === 'won') server.send('gameover', piece + ' won').toAll()
        if (gameover === 'draw') server.send('gameover', 'draw').toAll()
      }
      // do nothing if it is illigal
    },
    'clientReady': (server, clientId) => {
      readyCount++
      if (readyCount === players.length) {
        // randomize color and tell each client what color their are
        if (Math.random() < 0.5) {
          let tempPlayer = players[0]
          players[0] = players[1]
          players[1] = tempPlayer
        }
        server.send('youAre', 'X').toClient(players[0])
        server.send('youAre', 'O').toClient(players[1])
      }
    }
  },

  // Optionally define a setup method that is run before stage begins
  setup: (server) => {
    console.log('PREPARING SERVER FOR STAGE', server.getCurrentStage())

    players = server.getPlayers()
    if (players.length !== 2) {
      console.log('not enough players!')
      // TODO revert the state
    }
  },

  // Optionally define a teardown method that is run when stage finishes
  teardown: (server) => {
    console.log('CLEANUP SERVER AFTER STAGE', server.getCurrentStage())
  },

  // Configure options
  options: {}
}
