/* globals $ */
import createClient from 'monsterr'

import html from './src/admin/admin-client.html'
import './src/admin/admin-client.css'
import {NetworkModule} from './src/modules/NetworkModule'
import {LatencyModule} from './src/modules/LatencyModule'

let options = {
  canvasBackgroundColor: 'red',
  htmlContainerHeight: 0.5,
  // HTML is included in options for admin
  html
}

let events = {}
let commands = {}
NetworkModule.addAdminClientEvents(events)
LatencyModule.addAdminClientEvents(events)

const admin = createClient({
  events,
  commands,
  options
  // no need to add stages to admin
})

// Button event handlers (if you need more you should probably put them in a separate file and import it here)
$('#admin-button-start').mouseup(e => {
  e.preventDefault()
  admin.sendCommand('start')
})
$('#admin-button-reset').mouseup(e => {
  e.preventDefault()
  admin.sendCommand('reset')
})

NetworkModule.setupClient(admin)
LatencyModule.setupClient(admin)
