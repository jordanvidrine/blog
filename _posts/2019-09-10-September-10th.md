---
layout: post
---
Spent the morning working through one of the last Eloquent Javascript Chapters. This one dealt with node specifically, and finally, I understood everything going on in the chapter.

The book covered the very basics of Node, which by now has been solidified for me while working through the Udemy course. At the end of the chapter there was an exercise suggestion that I may take up once I am finished with my static website generator.

The exercise is to create a directory that will be served to the web via node. This directory should have read/write privileges and should be made editable from a browser interface. The suggestion seems fun, seeing that this app would allow anyone who visits the site to create, delete, and edit files to be served to the user.
<!--more-->

For the rest of the day I continued my progress working on the InGen static site generator app. I had a tough time today because about halfway through the day, my app stopped working properly.

I narrowed it down to the fs.promises methods I was using (which are still experimental according to node) and switched them out for a couple of methods provided with [fs-extra](https://www.npmjs.com/package/fs-extra). I think I will also go back and refactor a lot of the methods to use `fs-extra` as it is much simpler and more straightforward.

Other than that hurdle, I added some code to copy any assets stored in the `content` directory into the `site` directory. The post functionality is also now working properly. I just need to figure out the design and implementation of rendering a 'blog' type format and pagination.
