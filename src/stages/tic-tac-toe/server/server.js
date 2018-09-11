import createBoard from '../model/board'

let players
let bots = []
let readyCount = 0
let games

// ============================================================================
// Game-list
// As we do not have direct control over the network, we create our own
// structure for who gets to play a bot
// ============================================================================

// Export stage as the default export
export default {
  // Optionally define commands
  commands: {},

  // Optionally define events
  events: {
    'move': (server, clientId, position) => {
      let game = games.filter(game => game.x === clientId || game.o === clientId)[0]
      let piece = game.x === clientId ? 'X' : 'O'

      if (game.board.isMoveLegal(piece, position)) {
        let gameover = game.board.move(piece, position)
        server.send('move', {piece: piece, position: position}).toClient(game.x)
        server.send('move', {piece: piece, position: position}).toClient(game.o)

        if (gameover === 'won') {
          server.send('gameover', piece + ' won').toClient(game.x)
          server.send('gameover', piece + ' won').toClient(game.o)
        }
        if (gameover === 'draw') {
          server.send('gameover', 'draw').toClient(game.x)
          server.send('gameover', 'draw').toClient(game.o)
        }
      } else {
        console.log(clientId + ' tried to make an illigal move')
      }
    },
    'clientReady': (server, clientId, type) => {
      readyCount++
      if (type === 'bot') bots.push(clientId)

      if (readyCount === players.length) {
        // setup game and add bots
        let numberOfHumanPlayers = players.length - bots.length
        let numberOfBots = bots.length

        let numberOfGames = (numberOfHumanPlayers + numberOfBots) / 2
        games = Array.from({length: numberOfGames}, () => { return {x: null, o: null, board: createBoard()} })

        // add bots
        for (let i = 0; i < numberOfBots; i++) {
          let pos = Math.floor(games.length * Math.random())
          while (games[pos].o !== null) {
            pos = Math.floor(games.length * Math.random())
          }
          games[pos].o = bots[i]
        }

        // add clients
        let shuffledHumanPlayers = players
          .filter(player => !bots.includes(player))
          .map((a) => ({sort: Math.random(), value: a}))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value)

        let tempClientIndex = 0
        for (let i = 0; i < games.length; i++) {
          games[i].x = shuffledHumanPlayers[tempClientIndex++]
          if (games[i].o === null) games[i].o = shuffledHumanPlayers[tempClientIndex++]
        }

        // randomize color and tell each player what theyt are
        for (let i = 0; i < games.length; i++) {
          if (Math.random() < 0.5) {
            let tempX = games[i].x
            games[i].x = games[i].o
            games[i].o = tempX
          }
          server.send('youAre', 'X').toClient(games[i].x)
          server.send('youAre', 'O').toClient(games[i].o)
        }
      }
    }
  },

  // Optionally define a setup method that is run before stage begins
  setup: (server) => {
    console.log('PREPARING SERVER FOR STAGE', server.getCurrentStage())
    players = server.getPlayers()
  },

  // Optionally define a teardown method that is run when stage finishes
  teardown: (server) => {
    console.log('CLEANUP SERVER AFTER STAGE', server.getCurrentStage())
    // TODO board.resetBoard()
    for (let i in games) games[i].board.resetBoard()
    readyCount = 0
    bots = []
  },

  // Configure options
  options: {}
}
