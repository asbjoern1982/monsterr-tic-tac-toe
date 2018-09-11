import createServer, {Network, Events} from 'monsterr'
import gamestage from './src/stages/tic-tac-toe/server/server'
import {NetworkModule} from './src/modules/NetworkModule'
import {LatencyModule} from './src/modules/LatencyModule'
import {spawn} from 'child_process'
import config from './src/config/game.json'

const stages = [gamestage]

// sets a upper limit to how many players could be playing the game
let numberOfBots = Math.floor(config.numberOfHumanPlayers * config.procentBots)
let numberOfConnectedClients = 0
let expentedNumberOfClients = Math.floor(config.numberOfHumanPlayers) + numberOfBots // got a string from the json file so used Math.floor to cast it to int
if (expentedNumberOfClients % 2 !== 0) numberOfBots--

let events = {
  [Events.CLIENT_CONNECTED] (server, clientId) {
    numberOfConnectedClients++
    if (numberOfConnectedClients === expentedNumberOfClients) {
      console.log(numberOfConnectedClients + ' clients connected, starting the game')
      server.start()
    }
  }
}
let commands = {
  'spawnBot': (server, clientId) => {
    /* if (clientId === undefined) { // only AdminClient
      console.log('spawning bot')
      spawn('node', ['./src/bots/random_ash.js'])
    } */
  }
}

let network = Network.clique(expentedNumberOfClients)
NetworkModule.addServerCommands(commands, network)
LatencyModule.addServerCommands(commands)

const monsterr = createServer({
  network: network,
  events,
  commands,
  stages,
  options: {
    clientPassword: undefined, // can specify client password
    adminPassword: 'sEcr3t' // and admin password
  }
})

monsterr.run()

for (let i = 0; i < numberOfBots; i++) {
  console.log('spawning bot #' + i)
  spawn('node', ['./src/bots/random_ash.js'])
}
