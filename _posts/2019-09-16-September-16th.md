---
layout: post
date: '2019-09-16 12:00:00'
---
Last week I left off with one hour left of the Udemy Node course I have been working through. We are currently learning how to use socket.io to implement into a chat room, and tracking the users, and rooms of the app.

We'll start today by creating `users.js` file to store users. In the code we will create the ability to add users, check users in rooms, and perform other validation.

```javascript
const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({id, username, room}) => {
  // Clean the data
  username = username.trim().toLowerCase()
  room = room.trim().toLowerCase()

  // Validate the data
  if (!username || !room) {
    return {
      error: 'Username and room are required.'
    }
  }

  // Check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username
  })

  // Validate username
  if (existingUser) {
    return {
      error: 'Username is in use!'
    }
  }

  // Store user
  const user = { id, username, room }
  users.push(user)
  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index,1)[0]
  }
}

const getUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users[index]
  }

  return undefined
}

const getUsersInRoom = (room) => {
  const usersInRoom = users.filter((user) => user.room === room)
  if (usersInRoom) {
    return usersInRoom
  }
  return []
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}

```
<!--more-->

We can then edit our previous code to use the user information when signing in and logging in and out of different rooms. Everything in these lessons is pretty straight forward. This last chapter seems more like an exercise in getting familiar with an npm package and using that in tandem with what we already know to create new applications.

On last handy feature we can implement into the app is auto scrolling. This should happen only when the user is viewing the latest messages to render to the page. So if the user is currently chatting with someone, the browser should auto scroll to the bottom, BUT if the user is re-reading messages from earlier, it should not, as that would ruin the user's reading experience.

```javascript
const autoscroll = () => {
  // new message element
  const $newMessage = $messages.lastElementChild

  // height of the new message
  const newMessageStyles = getComputedStyle($newMessage)
  const newMessageMargin = parseInt(newMessageStyles.marginBottom)
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

  // Visibile height
  const visibleHeight = $messages.offsetHeight

  // height of messages container
  const containerHeight = $messages.scrollHeight

  //How far have I scrolled?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight
  }
}
```
With the end of these last couple of tutorial videos, I am now finished with the node course!
Hurray.

### Thoughts on the Node Course

I honestly feel like this NodeJs course was one of the best tutorial/educational videos I have used over the past couple of years. It was VERY well explained, and offered plenty of opportunities for the student to solve problems on their own. Throughout this course I learned how to use mongoDB as a database, create REST APIS, create back end programs that manipulate the file system and so much more.

I would definitely recommend this course to anyone interested in Node.

### Whats next?

I will move on to an in depth react course, an algorithms course, as well as a courses on mongodb and mysql. After these, along with creating my own apps and projects in between them, I feel like I will be ready to enter the work force as a entry level developer.
