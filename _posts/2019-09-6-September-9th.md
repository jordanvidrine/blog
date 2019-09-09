---
layout: post
date: '2019-08-20 12:00:00'
---
I am in the last section of the node course I have been working through for the past two months. This section deals with using socket.io and a building simple chat messaging app.

What is neat about socket.io is that it allows users to send messages to the server, and for the server to send messages back to the user. With this implemented, users are able to chat with each other in real time, as messages are related to and from the server to all of the users (or to whichever users you specify)

In today's lesson we will be implementing using handlebars to render chat messages from users to the browser.

In my ```index.html``` I have added the following (the location button is from a previous lesson):

```html
<body>
  <h1>Chat App</h1>

  <div id='messages'>
  </div>

  <form id='message'>
    <input type="text" id="messageText"></input>
  <button type="submit">Send</button>
  </form>
  <button id="send-location">Send Location</button>

  <script id="message-template" type="text/html">
    <div>
      <p>{{message}}</p>
    </div>
  </script>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/mustache.js/3.0.1/mustache.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/qs/6.6.0/qs.min.js"></script>
  <script src="/socket.io/socket.io.js"></script>
  <script src="/js/chat.js"></script>
</body>
```
This is the basic template we will be using to send/recieve and render messages to and from other clients.

On the sever side js we have the following along with our boilerplate express js code (notice we used http and express in order to pass the server into the socketio() function):

```javascript
const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.createServer(app)
const io = socketio(server)

const PORT = 3000 || process.env.port
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
  console.log('New WebSocket Connection')

  socket.emit('message', 'Welcome!')
  socket.broadcast.emit('message', 'A new user has joined!')

  socket.on('sendMessage', (message, callback) => {
    io.emit('message', message)
    callback(message);
  })

  socket.on('disconnect', () => {
    io.emit('message', 'A user has left!')
  })

  socket.on('sendLocation', (location, callback) => {
    io.emit('message', `https://google.com/maps?q=${location.latitude},${location.longitude}`)

    callback('Location was delivered')
  })
})

server.listen(PORT, () => {
  console.log(`Example app is listening on port ${PORT}`)
})
```
And finally, on the client side js we have the following (we are using mustacle/handlebars for rendering, which coincidentally, I spent a lot of time working with in my static site generator):
```javascript
const socket = io()

// Elements
const $messageForm = document.querySelector("#message")
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationSendButton = document.querySelector("#send-location")
const $messages = document.querySelector('#messages')

// Templates
const messageTemplate = document.querySelector('#message-template').innerHTML

socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate,{
    message
  })
  $messages.insertAdjacentHTML('beforeend', html)
})

$messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // disable button until scripts r finished
  $messageFormButton.setAttribute('disabled','disabled')

  let message = document.querySelector('#messageText').value

  socket.emit('sendMessage', message, (message) => {
    // re enable button and remove text from input
    $messageFormButton.removeAttribute('disabled')
    $messageFormInput.value = ''
    $messageFormInput.focus()
    console.log(message, ': Was delivered')
  })
})

document.querySelector('#send-location').addEventListener('click', (e) => {
  $locationSendButton.setAttribute('disabled','disabled')
  if (!navigator.geolocation) {
    return alert('Your browser does not support geolocation!')
  }

  navigator.geolocation.getCurrentPosition((position) => {
      socket.emit('sendLocation', {"latitude": position.coords.latitude, "longitude": position.coords.longitude}, (message) => {
        $locationSendButton.removeAttribute('disabled')
        console.log(message)
    })
  })
})

```
This will effectively render a message and insert it into the html of the main page....

and thats it for today. lol
