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

    if (message.request === 'message') {
      messageValidation(message)
    } else if (message.request === 'help') {
      helpValidation()
    } else {
        // Add error
    }
    })

    function helpValidation () {
      var response = {
        timestamp: Date.now(),
        sender: 'server',
        response: 'info',
        content: 'LIST OF COMMANDS \nlogin <username> - logs you in \nlogout - logs you out \nmsg <message> - sends a message \nnames - lists users in chat \nhistory -  lists previous messages\nhelp - gives you this'
      }
      var sendString = JSON.stringify(response)
      sock.write(sendString)
    }
}).listen(port, host)

console.log('Server listening on ' + host + ':' + port)
