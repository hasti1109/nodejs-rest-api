const express = require('express');
const { connectToDb, getDb } = require('./db');
const { ObjectId } = require('mongodb');

//init app and middleware
const app = express();
//parses the JSON payload of the request and converts it into a JavaScript object, 
//which is then available as req.body
app.use(express.json());

//db connection
let db;

connectToDb((err) => { // err would be null in callback func if promise resolved
    //only listen to request if successfully connected to db
    if (!err){
        app.listen(3000, () => {
            console.log("app listening on port 3000");
        });
        db = getDb();
    }
});

//routes
app.get('/books', (req, res) => {
    let books = []

    db.collection('books')
    .find() // returns a cursor that points to a set of documents
    .sort({author : 1}) // also returns a cursor
    .forEach((book) => { // to iterate over each book individually
        books.push(book); // this foreach is async
    })
    .then( () => {
      res.status(200).json(books);  
    })
    .catch( (err) => {
        res.status(500).json({error: "could not fetch data."});
    })
});

app.get('/books/:id', (req,res) => {
    //checking if the valid id is given or not
    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
        .findOne({_id: new ObjectId(req.params.id)})
        .then( (doc) => {
            res.status(200).json(doc);
        })
        .catch( (err) => { 
            res.status(500).json({error: "Could not fetch the document"});
        })
    }
    else{
        res.status(500).json({error: "Id is not valid"})
    }
})

app.post('/books', (req, res) => {
    const book = req.body;

    db.collection('books')
    .insertOne(book)
    .then( (result) => {
        res.status(201).json(result)
    })
    .catch( err => {
        res.status(500).json({error: "Could not create a new document"})
    })
})

app.delete('/books/:id', (req,res) => {
   if (ObjectId.isValid(req.params.id)){
    db.collection('books')
    .deleteOne({_id : new ObjectId(req.params.id)})
    .then( result => {
        res.status(200).json(result)
    })
    .catch( err => {
        res.status(500).json({error: "Could not delete book"})
    })
   } else {
        res.status(500).json({error: "Not a valid id"})
   } 
});

app.patch('/books/:id', (req,res) => {
    const updates = req.body;

    if (ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id : new ObjectId(req.params.id)}, {$set: updates})
        .then( result => {
            res.status(200).json(result)
        })
        .catch( err => {
            res.status(500).json({error: "Could not update book"})
        })
    } 
    else {
        res.status(500).json({error: "Not a valid id"})
    } 
})