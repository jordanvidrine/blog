---
layout: post
---
Today I will continue going through the React course I am taking on Udemy. So far, the class has just reinforced what I already understood about React, but today we are getting into some of the more complex uses of React and using state.

For instance, I have always updated state values like so:
```javascript
this.setState({
  value: this.state.value + 1
})
```
This works, but is not the best way because it depends on the state being specifically what you think it should be at the time of the function call. Some other async state updating operations may or may not have finished if your app us more complex.

<!--more-->
According to this course, the more correct way to update would be to use `this.setState(callback)`. Instead of passing an object, we pass it a callback with the current state as a parameter. The callback should return an object representing the new state. This will allow you to call setState multiple times within a method and not have to worry about the state updating correctly.
```javascript
this.setState(curState => {value: curState.count + 1});
```
### Abstracting State
Passing a function to state lends itself to a more advanced pattern called **functional state**. You can describe your state updates as separate functions.

```javascript
function incrementCounter(curState) {
  return {count: curState.count +1 }
}

// somewhere else in the code
this.setState(this.incrementCounter)
```
This is great for testing as you only have to test a plain function. It is also a pattern that comes up in Redux a lot which is what we will be diving into later in this course.

### Updating Objects, Arrays, etc
We can update individual items by making copies of the data structure in question, then updating state. This can be done with a pure function. Pure functions using `.map`, `.filter`, and `.reduce` are our friends. As is the `...spread` operator.

```javascript
completeTodo(id) {
  const newTodos = this.state.todos.map(todo => {
    if (todo.id === id) {
      // make a copy of the todo object with done -> true
      return {...todo, done: true};
    }
    return todo; //old todos can pass through
  });

  this.setState({
    todos: newTodos // setState to the new array
  })
}
```
## Designing State
In React, you want to try and put as little data in state as possible. A good question is "Does `x` change?", If not, `x` should not be apart of state, it may work better as a prop.

### Example of Bad State
```javascript
this.state = {
  firstName: 'Matt',
  lastName: 'Lane',
  birthday: '1955-01-08T07:37:59.711Z',
  age: 64,
  mood: 'irate'
}
```
Does Matt's first name or last name ever change? Does Matt's birthday change? The only property here that is truly stateful is arguably **mood**.

### Updated Example
```javascript
console.log(this.props)
{
  firstName: 'Matt',
  lastName: 'Lane',
  birthday: '1955-01-08T07:37:59.711Z',
  age: 64,
}
console.log(this.state)
{
  mood: 'angry'
}
```

### Downward Data Flow
It's best to support the downward data flow in React. In general, it makes more sense for a parent component to manage state and have "dumb" stateless child display components. This makes debugging easier, because state is centralized.

#### Todo Example
```javascript
class TodoList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      todos: [
        { task: 'do the dishes', done: false, id: 1 },
        { task: 'vacuum the floor', done: true, id: 2}
      ]
    };
  }

  render() {
    return (
      <ul>
        {this.state.todos.map(t => <Todo {...t} />)} // passes in task data as props with the spread operator
      </ul>
    )
  }
}
```
**TodoList** is a smart parent with lots of methods, while the individual **Todo** items are just `<li>` tags with some text and styling.


#### Some Takeaways
While the content covered today is familiar to me, its nice to get into the depths of React and learn about the WHYs of what is going on. Here are two peices of code I found useful today when covering some of the exercises.

The first is this `do... while` loop. I found this solution to select a random color, as long as it wasnt the current color interesting. No filtering necessary, and no need to create more than one array. This loop continues to run until the new color is NOT the same as the old color.

```javascript
changeColor(id) {
  let array = [...this.state.colors];
  let newColor;
  // this uses do/while to set new color as long as it is not the current color
  do {
    newColor = array[Math.floor(Math.random()*array.length)]
  } while (newColor === array[id])

  array[id] = newColor;

  this.setState({
    colors: [...array]
  })
}
```
I also enjoyed the following code to dynamically set state based on what face a coin was.
```javascript
flipCoin() {
  let rnd = Math.floor(Math.random() * 100 + 1);
  let face = rnd >= 50? 'heads' : 'tails';

  this.setState(st => {
    return {
    currentFace: face,
    // this tests if face is equal to "tails" or "heads" and adds 1 accordingly.
    tailsCount: st.tailsCount + (face === "tails" ? 1 : 0),
    headsCount: st.headsCount + (face === "heads" ? 1 : 0)
    }
  })
}
```
