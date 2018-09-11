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
      // only one board is supported
      let piece = players[0] === clientId ? 'X' : 'O'
      if (board.isMoveLegal(piece, position)) {
        let gameover = board.move(piece, position)
        server.send('move', {piece: piece, position: position}).toAll()
        if (gameover === 'won') server.send('gameover', piece + ' won').toAll()
        if (gameover === 'draw') server.send('gameover', 'draw').toAll()
      } else {
        console.log(clientId + ' tried to make an illigal move')
      }
      // do nothing if it is illigal
    },
    'clientReady': (server, clientId) => {
      readyCount++
      if (readyCount > 2) {
        console.log('At the moment, more than 2 players are not supported, readyCount=' + readyCount)
      }
      if (readyCount === players.length) {
        // randomize color and tell each client what color their are
        for (let i = 0; i < players.length / 2; i++) {
          if (Math.random() < 0.5) {
            let tempPlayer = players[i]
            players[i] = players[i + 1]
            players[i + 1] = tempPlayer
          }
          server.send('youAre', 'X').toClient(players[i])
          server.send('youAre', 'O').toClient(players[i + 1])
        }
      }
    }
  },

  // Optionally define a setup method that is run before stage begins
  setup: (server) => {
    console.log('PREPARING SERVER FOR STAGE', server.getCurrentStage())

    players = server.getPlayers()
    if (players.length % 2 !== 0) {
      console.log('not even amount of players! players.length=' + players.length)
      // TODO revert the state
    }
  },

  // Optionally define a teardown method that is run when stage finishes
  teardown: (server) => {
    console.log('CLEANUP SERVER AFTER STAGE', server.getCurrentStage())
    board.resetBoard()
    readyCount = 0
  },

  // Configure options
  options: {}
}
