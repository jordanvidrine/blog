---
layout: post
title: "November 4th, Mongodb"
---
Today I will be getting back into the Courses I am going through on Udemy. First up, will be the MongoDB course I am taking. We are currently working through a DB exercise for a website to act as a blog. We will not be writing any web development code, just structuring the database.

Our goal is to define a schema and how we would model the relations and then play around the some queries to see how the MongoDB driver would interact with our database.

I would say our Users need to be in their own collection, and then Posts can have a collection for themselves, with comments being embedded inside of them in an array.

### Implementing Exercise
First off, lets use the shell to insert some users into our Blog db.
```javascript
use blog
db.users.insertMany([{name: "Jordan Vidrine", email: "jordan@email.com"},{name:"Skies Speak", email: "skies@speak.com"}])

// looks like This
db.users.find().pretty()
{
        "_id" : ObjectId("5dc05feee71cacc7501721de"),
        "name" : "Jordan Vidrine",
        "email" : "jordan@email.com"
}
{
        "_id" : ObjectId("5dc05feee71cacc7501721df"),
        "name" : "Skies Speak",
        "email" : "skies@speak.com"
}
```
<!--more-->
Now lets inset some posts into the post collection.
```javascript
db.posts.insertOne({title:"My first post", text:"My first post text", tags: ["new","post"], creator: ObjectId("5dc05feee71cacc7501721de"), comments: [{text: "I love your posts", author: ObjectId("5dc05feee71cacc7501721df")}]})

// looks like this
db.posts.find().pretty()
{
        "_id" : ObjectId("5dc0609401894c7604a7e996"),
        "title" : "My first post",
        "text" : "My first post text",
        "tags" : [
                "new",
                "post"
        ],
        "creator" : ObjectId("5dc05feee71cacc7501721de"),
        "comments" : [
                {
                        "text" : "I love your posts",
                        "author" : ObjectId("5dc05feee71cacc7501721df")

                }
        ]
}
```
### Understanding Schema Validation
MongoDB is super flexible, which is a huge plus, but sometimes we need to get it to be more strict. We can do this with schema validation. When we add schema validation, MongoDB will only allow the insertion of data if the data validates based on your specifications for validation.

**`validationLevel`**
Which documents get validated?

strict -> All inserts & updates
moderate -> all inserts & updates to correct documents

**`validationAction`**
What happens if validation fails?

error -> throw error and deny any inserts or updates
warn -> log warning, but proceed

Some examples:

Previously we created collections in a "lazy" way by just inserting documents into the collection. MongoDb allows this which is like we said before, very flexible. To have a more strict collection, we can use `db.createCollection()`

```javascript
db.createCollection("posts",{
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "text", "creator", "comments"],
      properties: {
        title: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        text: {
          bsonType: "string",
          description: "must be a string and is required"
        },
        creator: {
          bsonType: "objectId",
          description: "must be an objectId and is required"
        },
        comments: {
          bsonType: "array",
          description: "must be an array and is required",
          items: {
            bsonType: "object",
            required: ["text", "author"],
            properties: {
              text: {
                bsonType: "string",
                description: "must be a string and is required"
              },
              author: {
                bsonType: "objectId",
                description: "must be an objectId and is required"
              }
            }
          }
        }
      }
    }
  }
});

// {"ok" : 1}
```
The previous code will create a collection called "posts" where the validator is a reccomended `jsonSchema`. Now, if any item is inserted into this collection, it must match all of the parameters set in the validation specs.

#### Useful Links
The MongoDB Limits: https://docs.mongodb.com/manual/reference/limits/</br>
The MongoDB Data Types: https://docs.mongodb.com/manual/reference/bson-types/</br>
More on Schema Validation: https://docs.mongodb.com/manual/core/schema-validation/</br>

### MongoDB Compass
MongoDB compass is a visual way to look at and edit your MongoDB data, which I worked with on the NodeJS course when implementing some of the exercises. I personally enjoy working with Compass as long as my information in the db is fairly simple. It makes it easy to work with visually rather than only working with data from the shell.

### Diving into Create Operations
In this module we will look at other ways to insert data into a Mongo database. We will also look at importing documents. We will cover `insertOne()`, `insertMany()`, and `mongoimport`.

Using `insertOne()` will, obviously, insert one document into the database. To insert more than one, we would use `insertMany([{},{}])` where your documents would be listed in the array passed into the method.

#### Ordered Insert
One issue we may and could run into is if we use `insertMany()` and in your list, is a document with and `_id` that is a duplicate, the insert method will fail at that item, and not move onto try inserting the following documents, regardless if they would throw an error.

We can bypass this by configuring the insertMany method like so.

`insertMany([...documents], {ordered: false})`

This will still throw errors, but it will also continue to try and insert subsequent documents into the database.

#### Understanding `WriteConcern`
MongoDB has the ability for us to enhance the reliability of our data being written to the database. By default, our data is inserted into the database without any write concern. To give ourselves security, we could implemenent the use of the `Journal`. What happens behind the scenes is that our data is inserted into the Journal, which acts sort of like a todo list. It is then written to the database when ready. This would be helpful if during our insert method, the server crashed, or something else happened. The journal would keep in mind that a task was not complete, and once the server was back online, would save the data to the disk.

It's up to use to use this depending on our needs. To do so, we would add `writeConcern: {w: 1, j: true}` to our insert method as a second argument. We can also set a timeout if we want to not cancel the operation if it is taking too long. We do that with adding `wtimeout: 200` to the `writeConcern` option with the number being in milliseconds.

### Importing Data
We can import more than just JSON documents, but we will focus on this one for now. First navigate to the directory where your JSON document is stored. Next we will execute this line of code `mongoimport filename.json -d databaseName -c collectionName --jsonArray (if its an array of documents) --drop (this will drop the existing collection from the DB, then re add it from this file)`.
