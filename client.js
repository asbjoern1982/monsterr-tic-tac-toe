import createClient from 'monsterr'
import gamestage from './src/stages/tic-tac-toe/client/client'

const stages = [gamestage]

let options = {
  canvasBackgroundColor: 'blue',
  htmlContainerHeight: 0 // Hide html
}

let events = {}
let commands = {}

createClient({
  events,
  commands,
  options,
  stages
})
