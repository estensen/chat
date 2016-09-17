let net = require('net')

let host = '192.168.2.99'
let port = 1337

net.createServer(function (sock) {
  console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort)
  let intro = {
    response: 'info',
    timestamp: Date.now(),
    content: 'Welcome! Type \'help\' to show commands.',
    server: 'server'
  }
  let sendString = JSON.stringify(intro)
  sock.write(sendString)

  sock.on('data', function (data) {
    const buf = Buffer.from(data, 'utf-8')
    let message = JSON.parse(buf)
    console.log(message)

    if (message.request === 'message') {
      messageValidation(message)
    } else if (message.request === 'help') {
      helpValidation()
    } else {
        // Add error
    }
  })

  function messageValidation (message) {
    let response
    if (message.content !== '') {
      response = {
        timestamp: Date.now(),
        sender: '?',
        response: 'info',
        content: 'Message sent!'
      }
    } else {
      response = {
        timestamp: Date.now(),
        sender: 'server',
        response: 'info',
        content: 'Not a valid message or you are not logged in'
      }
    }
    let sendString = JSON.stringify(response)
    sock.write(sendString)
  }

  function helpValidation () {
    let response = {
      timestamp: Date.now(),
      sender: 'server',
      response: 'info',
      content: 'LIST OF COMMANDS \nlogin <username> - logs you in \nlogout - logs you out \nmsg <message> - sends a message \nnames - lists users in chat \nhistory -  lists previous messages\nhelp - gives you this'
    }
    let sendString = JSON.stringify(response)
    sock.write(sendString)
  }
}).listen(port, host)

console.log('Server listening on ' + host + ':' + port)
