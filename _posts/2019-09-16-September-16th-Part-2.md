---
layout: post
date: '2019-09-16 12:30:00'
---
I have a fairly decent understanding of React (in my humble opinion ;) ). I do however want to get deeper with it and learn more about it. So I am continuing my self paced learning with a [Udemy Course on React by Colt Steele](https://www.udemy.com/share/1012SkA0oYdVtVRn4=/). He was one of the instructors on the first dev course I took and I liked his teaching style a lot.

#### Create React App
**Goals**
- Understand what Create React App is and how to use it. (I believe I know this.)
  - Sidenode, to my understanding of what Create React App is, I feel like it is way too bulky and should come with a minimal install option.
- Use ES2015 modules to share code across files (I know this as well! :)
- Compare default vs non default exports
<!--more-->
Create React App is a utility script that builds a skeleton project for you rather than having everything compile in the browser. Since Babel is used to transpile JSX into javscript and html, it is quicker for it to be running automatically on the server.

Using CRA also makes testing and deployment much easier.

It is definitely NOT the only way to use react and create apps, but it does make things smoother and easier to get up and running.

This being said, I do feel like I have a solid grasp on the currently covered concepts so I feel funny documenting things I have already learned. As the course continues, I will be documenting more about my learning process with React.

### CRA Conventions
Each React component goes in a separate file!
- `src/Car.js` for `Car` component.
- `src/House.js` for `House` component.

Components extends `Component` imported from React.
- Export the component as the default object.

Skeleton assumes top object in App is `App.js`
- Best to keep this

### CRA and Assets
To include images and CSS, you can actually import them in JS files as if they were javascript files. `import logo from "./logo.svg"` or `import "./App.css"` both are examples of this.

**CSS**
- make a css file for each React Component
  - `House.css` for `House` component
- Import it at the top of `House.js`
- Convential to add `className="House"` onto House div
  - Use that as prefix for sub-items
```jsx
<div className="house">
  <p className="House-title">{ this.props.title }</p>
  <p className="House-address">{ this.props.addr }</p>
</div>
```

**Images**
- Store in src/ folder with components
