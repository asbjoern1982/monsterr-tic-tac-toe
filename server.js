import createServer, { Network } from 'monsterr'
import gamestage from './src/stages/tic-tac-toe/server/server'
import {NetworkModule} from './src/modules/NetworkModule'
import {LatencyModule} from './src/modules/LatencyModule'
import {spawn} from 'child_process'

const stages = [gamestage]

let events = {}
let commands = {
  'spawnBot': (server, clientId) => {
    if (clientId === undefined) { // only adminclient
      console.log('spawning bot')
      spawn('node', ['./src/bots/ash.js'])
    }
  }
}
let network = Network.pairs(2)
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
