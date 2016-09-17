var net = require('net')

var host = '192.168.2.99'
var port = 1337

net.createServer(function (sock) {
  console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)
  var intro = {
    response: 'info',
    timestamp: Date.now(),
    content: 'Welcome! Type \'help\' to show commands.',
    server: 'server'
  }
  var sendString = JSON.stringify(intro)
  sock.write(sendString)
  sock.on('data', function (data) {
    var message = JSON.parse(data)
    console.log(message)
  })
}).listen(port, host)

console.log('Server listening on ' + host + ':' + port)
