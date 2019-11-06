---
layout: post
title: "November 6th, Algorithms + ReactJS"
---
Today I'll be starting off the day working through an hour or so in the Algorithms course. To be honest, this has been a tougher course for me to follow. I get most of what is happening, but this topic is not my strong suit when it comes to development, which is why I want to complete it.

The first section I'll be working through today is...

### Recursion
I had an issue with recursion when I first encountered it earlier in the year, but I do feel like I understand what's going on. At its core though, to me it is not a super simple topic.

Recursion is a way of thinking about ways to solve problems. It essentially is taking a problem, and working on it over and over, on a changing piece, until you arrive at your solution/end point (base case).
<!--more-->

#### Why use recursion?
Formally, **Recursion** is a process (a function) that calls _itself._

Recursion is _everywhere_. `JSON.parse` and `JSON.stringify` are often recursive in their implementation. `document.getElementById` and Dom traversal are also usually written recursively. It is also sometimes a cleaner alternative to iterative solutions.

#### Recursion behind the scenes
In almost all programing languages, there is a built in data structure that manages what happens when functions are invoked. In javascript we have the **call stack.**

It is a data structure called a `stack`. Anytime a function is invoked, it is pushed on top of the call stack. When JS sees the return keyword, or when the function ends, the compiler will remove/pop that function from the stack. (I knew this already, but it's good to review)

When we write recursive functions, we keep pushing new functions onto the call stack.

#### How they work
They invoke the same function, with a **different input**, until reaching a **base case**.

This is the condition when the recursion will end. This is the most important aspect of a recursive function.

Simple Recursive Functions
```javascript
function countDown(num) {
  // base case
  if(num <= 0) {
    console.log("All done!")
    return;
  }
  console.log(num)
  // change input
  num--
  countDown(num)
}

function sumRange(num){
  // base case
  if (num === 1) return 1;
               // change input
  return num + sumRange(num-1)
}
```
#### Common Pitfalls
- Base case is nonexistent, or wrong.
- Returning the wrong value, or not returning at all
- stack overflow! (recursion is not stopping because of the above)

#### Helper Method Recursion
So far, we have seen functions that call themselves explicitly. With a helper method recursion, we have a function, wrapped with an outer function. Ex.
```javascript
function collectOddValues(arr) {
  let result = [];

  function helper(helperInput){
    if(helperInput.length === 0){
      return;
    }
    if(helperInput[0] % 2 !== 0){
      result.push(helperInput[0])
    }
    helper(helperInput.slice(1))
  }

  helper(arr)

  return result;
}
```
This is helpful, like above, when we need to store values into an array or object. There is also a way to do this with a pure recursive function. An example of that is below. The first is my example I came up with before watching the instructors solution.
```javascript
function collectOddValues(arr){
    // if the function is called with a second argument AND the array is empty, we know we need to return that second argument, which is an array of ODD values
    if(arr.length === 0) return arguments[1];
    let odds = arguments[1] ? arguments[1] : []
    if(arr[0] % 2 !== 0) odds.push(arr[0])
    return collectOddValues(arr.slice(1),odds)
}

// instructor version
function collectOddValues(arr){
  let newArr = [];
  if(arr.length === 0) return newArr;

  if(arr[0] % 2 !== 0) newArr.push(arr[0])

  newArr = newArr.concat(collectOddValues(arr.slice(1)))

  return newArr;
}
```
#### Pure recursion tips
- For arrays, use methods like **slice**, **spread operator**, and **concat** that make copies of arrays so you do not mutate them.
- Remember that strings are immutable so you will need to use methods like **slice**,**substr**, or **substring** to make copies of strings.
- To make copes of objects use **Object.assign** or the spread operator.

Now onto react!

### Massive Color Project
We are now going to start work on a **HUGE** react project that will cover lots of ground, as well as build on what we have already learned. Some of the new tools and things we will use are:
- MateriualUI (material-ui.com) React components that implement Google's Material design.
- Chroma.js (library to interact with and manipulate colors)
- Emoji-mart an emoji library
- Drag & Drop with react-sortable Higher order components
- copy to clip board with react-copy-to-clipboard
- React.PureComponent
- form validations with react-form-validator-core
- transition group to add dynamic transitions
- all styles with JSS rather than CSS for dynamic styles and organization

There will not be much to document here while coding along this app. I figure that I will document anything interesting I run into to keep a memory of it.
