---
layout: post
title: "November 5th, React, + Other Courses"
---
Today I will be continuing my React course. We left off last going over the React Router npm package and worked through its basic uses. Today we continue with that and learn about a new concept called `props.children`

`Props.children` comes in handy when we want to make components that wrap other components, or html items. Lets look at this example:
```javascript
class Message extends Component {
  render() {
    return (
      <div className='Message'>
        {this.props.children}
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <Message>
        <h1>I am going to be inside the message component</h1>
        <div className="inside">
          <p>I too will be inside the message compnent</p>
        </div>
      </Message>
    )
  }
}
```
<!--more-->
This allows us to pass into whatever is in between `<Message>` and `</Message>` to the component to be rendered. This would be very useful if you want all of your text or certain html elements to look the same way when they are rendered. You would just pass all of your info, elements, etc into that component and it would look the same across your site where implemented. Very cool!

### React Router Patterns
We will continue on with some more concepts to know when working with React Router. Like URL Parameters, redirects, setting up 404 pages, and others.

#### URL Parameters
So lets say theoretically we wanted to create routes that dynamically brought the user to a certain part of our page, or rendered a component based on the route. ex.
```javascript
<App>
  <Route path="/food/tacos"
         render={() => <Food name="tacos" />} />
  <Route path="/food/sushi"
         render={() => <Food name="sushi" />} />
</app>
```
This list could go on forever! The problem here is that it includes LOTS of code duplication and a huge waste of time if we want to add more foods. A better way is to use `routeProps` which is given to us by React Router. `routeProps` are passed in as an argument to the render function you use in the route.

```javascript
<Route path="/food/:name"
       render={routeProps => <Food {...routeProps} />}
```
An example of what would be passed in as `match` if a user visited `/foods/tacos` would look like this:
```javascript
{
  path: '/food/:name',
  url: '/food/tacos',
  isExact: true,
  params: {
    name: 'tacos'
  }
}
```
**path** is the same as parth prop passed to Route. **url** is the specific url found in the URL bar. **isExact** is the match between url & path exact. **params** is an object of all the url parameters.

It's possible to have multiple parameters in a single route. ex. `/food/:foodName/drink/:drinkName`

It is also possible to use `component` instead of `render` in your route. The routeProps will be passed to the component as though they were regular props. However, if you need to pass in additional props, it will not work. You must use `render` instead.

#### Adding 404 Route
This is pretty simple. To do this, we would add a Route to the end of our switch component route list, that does not include a path. That way, if none of the previous routes were matched, the 'empty' one would render.

```javascript
<Switch>
...other routes
<Route render={() => <h1>Error! Not Found!</h1>} />
</Switch>
```

#### Easy search form
Another useful way to use links and routes that React Router provides us is to use them to build a simple search form. To do so would look like this.

```javascript
class FoodSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {query: ''}
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange(evt) {
    this.setState({query: evt.target.value})
  }
  render() {
    return (
      <div>
        <h1>Search for a food!</h1>
        <input
          type='text'
          placeholder='search for a food'
          value={this.state.query}
          onChange={this.handleChange}
        />
        // when clicked this link will render what should be rendered at the URL
        <Link to={`/food/${this.state.query}`}>Go!</Link>
      </div>
    )
  }
}
```

#### Client Side Redirects
With React Router we can mimic behavior of server side redirects. This would be useful after certain user actions like submitting a form. It can also be used in lieu of having a catch-all 404 component.

We can do this with `<Redirect>` component.

A simple example would look like this :
```javascript
// ...component code
// this would ALWAYS redirect to the specified route, not a good idea
<Redirect to="/"/>

// this would redirect if the :name was something we didnt want to render
{ this.props.match.params.name === 'forbiddenName' ? (
  <Redirect to="/" />
) : (
  <h1> You are allowed to be here </h1>
)
}
// ...rest of component code
```
Another way to redirect is a little more complicated, but we can `.push` on the `history` route prop. React Router has its own wrapper on browser's history object.

If we wanted to save data to a database, and THEN perform a redirect, we couldn't use `<Link>` like we did earlier. We would have to setup a button with a handler function, that would perform its saving function, then `.push` onto the routeProps history object the route to go to. React Router will automatically perform a redirect when a new item is added to the history. Here is a simple example.
```javascript
// component code
handleClick() {
  // do stuff with data
  this.props.history.push(`/food/${this.state.query}`);
}

// render method on component
<button onClick={this.handleClick}>Save New Food!</button>
```
This code would do something with the data saved to `query` then add '/food/...data' to the history object. React Router will then see something was added to the history object, and perform the redirect to the specified route.

#### Using `withRouter`
Now, if you create a component that doesnt have anything to do with `Routes` it will not have any information that React Router gives us, like access to the React Router history method and so on. For example
```javascript
import {withRouter} from 'react-router-dom'

class Navbar extends Component {
  constructor(props) {
    super(props)
    this.handleLogin = this.handleLogin.bind(this)
  }
  handleLogin() {
    // log in code....
    // unless we export this component with `withRouter(Navbar)` down below
    // the component will not have access to history
    this.props.hisotry.push("/food/salmon")
  }
  render() {
    return (
      <button onClick={this.handleLogin}Log In</button>
    )
  }
}

export default withRouter(Navbar)
```

#### Implementing a back button
There are a couple methods given to us in the history object passed to our components with React Router. They allow us to go back or move forward in the site history without re loading the page.

```javascript
// inside of a component
render() {
  return (
    <button onClick={this.props.history.goBack}>Go back!</button>
  )
}
```
This would call the `goBack()` method on `history` and bring us back one direction in the browser history.

### Algorithms Course
Moving on, I will now cover the Algorithms course I am working through. I left off with an exercise to solve a problem using the Sliding Window pattern. Here was the given prompt:
_Given an array of integers and a number, write a function called `maxSubarraySum` which finds the maximum sum of a subarray with the length of the number passed to the function. The subarrayu MUST consist of CONSECUTIVE numbers from the original array._

Here was my solution.

```javascript
// maxSubarraySum([100,200,300,400],2) -> 700
// maxSubarraySum([1,4,2,10,23,3,1,0,20], 4) -> 39
// maxSubarraySum([-3,4,0,-2,-6,-1], 2) -> 5
// maxSubarraySum([3,-2,7,-4,1,-1,4,-2,1], 2) -> 5
// maxSubarraySum([2,3],3) -> null

function maxSubarraySum(arr,length) {
    if (arr.length < length) return null;

    let maxSum = 0;
    let curSum = 0;

    let start = 0;
    let end = length;

    // initialize maxSum with the first subarray sum
    while(length-1 >= 0) {
        maxSum += arr[length-1];
        curSum = maxSum;
        length--
    }

    // move the active window through the array, redefine maxSum if the curSum is greater
    while(end < arr.length) {
        curSum = curSum - arr[start] + arr[end]
        if (curSum > maxSum) maxSum = curSum;
        start++
        end++
    }

    return maxSum

}
```
