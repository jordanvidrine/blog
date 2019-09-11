---
layout: post
---
Spent the first half of the day completing my InGen static site generator. The app is now fully functional and I was able to fix all of the bugs/issues by switching over to `fs-extra` instead of using the provided `fs` system with node.

I also switched all of my `for` loops inside of sync functions to `for..of` loops and that also cleared up a few inconsistencies.

The site is now capable of building a blog using all of the posts saved in the content/posts directory. It then dynamically saves the files into custom dated folders in the `_site/blog` directory after it is built.

I am pretty proud of the way it all came out and in the next couple of days will work on setting it up as an NPM package for others to use just for fun.

<!--more-->

For the second half of the day I will continue to work through to `socket.io` section of the Node course I am working through on Udemy

#### Socket.io

I wish I would have been document my learning on this from the beginning but currently we are working with sending messages to and from the server and the client. Right now a user can type a message into an input and have that message sent to all users currently connected to the server. We are also rendering that message with a mustache template.

Here is a little of that code for reference:

Sever Side
```javascript
io.on('connection', (socket) => {
  // anytime a user connects, emit 'message' with whatever is returned from
  // generateMessage('Welcome')
  // which in this case is
  // { text: 'Welcome', createdAt: 34532452345}
  socket.emit('message', generateMessage('Welcome!'))

  // this will emit the message to ALL users
  socket.broadcast.emit('message', generateMessage('A new user has joined!'))

  // this will emit a message and run a callback when it recieves 'sendMessage'
  // from the client
  socket.on('sendMessage', (message, callback) => {
    io.emit('message', generateMessage(message))
    callback(message);
  })
})
```

Client Side
```javascript
// upon recieving a 'message' it will console log that message as well as render it to the page
socket.on('message', (message) => {
  console.log(message)
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: message.createdAt
  })
  $messages.insertAdjacentHTML('beforeend', html)
})
```

If you havent noticed, we use `new Date().getTime()` to insert the time into `message.createdAt`. To get around the strange number it generates (which is the time elapsed since the UNIX Epoc, Jan 1 1970) we will use an npm package called Moment. We will just use the cdn link in the html file to get this done.

```javascript
createdAt: moment(message.createdAt).format('h:mm a')
// this will render as 2:49 pm
```

### Adding ability for users to join
In this section we add a new page for users to join the chat app with. The page shows the user a form where they type in a name and a room name to join that specific room. The form redirects them to the chat application with the form info passed to the site in the url bar as a query.

We will pull this info from the url bar to get the username and the room they joined. The query string in the url can be accessed with `location.search`. We can then parse the returned string to get access to the individual pieces of data. To do this, we will use NPM package `qs`.

We do that by using `Qs.(location.search, { ignoreQueryPrefix: true })`. This will return an object with key value pairs corresponding to the query string in the url bar.

In the `chat.js` file we will desctructure that object with the following: `let {username,room} = Qs.(location.search, { ignoreQueryPrefix: true })`

We will then emit that to the server with the following code:
```javascript
socket.emit('join', {username, room})
```
Then on the server, we will listen for the event and run this:
```javascript
socket.on('join', ({username, room}) => {
  // this will join the user to the specified room and only emit events to that room
  // io.to.emit -> emit to everyone in room
  // socket.broadcast.to.emit -> emit to everyone but the client in the room
  socket.join(room)

  socket.emit('message', generateMessage('Welcome!'))
  socket.broadcast.to(room).emit('message', generateMessage(`${username} has joined the room!`))
})
```

We will need to change all of our other socket.emit functions to work with the username and room features we have added. We will need to keep track of which users are in which rooms and with which names!
