let net = require('net')

let host = '192.168.2.99'
let port = 1337

let user_ids = []
let clients = []
let messages = []

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
    } else if (message.request === 'login') {
      loginValidation(message)
    } else if (message.request === 'logout') {
      logoutValidation(message)
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
      messages.push(message)
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

  function loginValidation (message) {
    let username_taken = false
    let socket_logged_in = false
    let response_type = ''
    let content = ''
    console.log(sock.remoteAddress + sock.remotePort)
    console.log(user_ids)
    for (let username in user_ids) {
      if (username === message.content) {
        username_taken = true
      }
      if (user_ids[username] === sock.remoteAddress + sock.remotePort) {
        socket_logged_in = true
      }
    }

    if (message.content === '' ||
        message.content === null ||
        message.content === undefined) {
      response_type = 'error'
      content = 'Not a valid username'
    } else if (username_taken) {
      response_type = 'error'
      content = 'Username is already taken'
    } else if (socket_logged_in) {
      response_type = 'error'
      content = 'Socket is already in use'
    } else {
      user_ids[message.content] = sock.remoteAddress + sock.remotePort
      clients.push(sock)
      response_type = 'info'
      content = 'Login successful'
    }

    let response = {
      timestamp: Date.now(),
      sender: 'server',
      response: response_type,
      content: content
    }
    let sendString = JSON.stringify(response)
    sock.write(sendString)
  }

  function logoutValidation () {
    let logout = false
    for (let username in user_ids) {
      if (user_ids[username] === (sock.remoteAddress + sock.remotePort)) {
        delete user_ids[username]
        clients.splice(clients.indexOf(sock), 1)
        logout = true
      }
      var response = {
        timestamp: Date.now(),
        sender: 'server',
        response: 'info'
      }
      if (logout) {
        response.content = 'You\'ve successfully logged out'
      } else {
        response.content = 'You\'re not logged in'
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
      content: 'LIST OF COMMANDS \nlogin <username> - logs you in \nlogout - logs you out \nmessage - sends a message \nnames - lists users in chat \nhistory -  lists previous messages\nhelp - gives you this'
    }
    let sendString = JSON.stringify(response)
    sock.write(sendString)
  }
}).listen(port, host)

console.log('Server listening on ' + host + ':' + port)
