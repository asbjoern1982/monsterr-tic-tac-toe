import createServer, { Network } from 'monsterr'
import gamestage from './src/stages/tic-tac-toe/server/server'

const stages = [gamestage]

let events = {}
let commands = {}

const monsterr = createServer({
  network: Network.pairs(8),
  events,
  commands,
  stages,
  options: {
    clientPassword: undefined,  // can specify client password
    adminPassword: 'sEcr3t'     // and admin password
  }
})

monsterr.run()
