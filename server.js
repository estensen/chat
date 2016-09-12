var net = require('net')

var host = ''
var port = 1337

var user_ids = {}
var messages = []
var clients = []

net.createServer(function (sock) {
  console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)
  var intro = {
    response: 'info',
    timestamp: Date.now(),
    content: 'Welcome! Type \'help\' to show commands.',
    server: 'server'
  }
})

console.log('Server listening on ' + host + ':' + port)
