const express = require("express");
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const Task = require('./models/tasks');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
const dburi = "mongodb+srv://neel:neel007@node.tflje.mongodb.net/node?retryWrites=true&w=majority";
mongoose.connect(dburi, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((result) => console.log('connected to db'))
    .catch((err) => console.log('not connected'));

mongoose.set('useFindAndModify',false);


app.set('view engine','ejs');
app.use(express.static('public'));



app.get('/blog',(req, res) => {

   let  t = req.query.title;
    let d = req.query.dis;
    let tf = req.query.tf;
    const task = new Task({
        title: t,
        discription: d,
        completed: tf
    });

    task.save()
        .then((result) => {
            res.redirect('/');
        })
        .catch((err) => {
            console.log(err);
        });

});




app.get("/all", (req, res) => {
    Task.find().sort( { createdAt: -1 } )
        .then((result) => {
            res.render('index',{ title: 'all blogs',tasks: result });
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get("/new", (req, res) => {
    res.render('new',{ title: 'Add New Task' });
});


app.get("/", (req, res) => {
    res.redirect('/all');
});


// render edit form

app.get("/all/edit/:id", (req, res) => {
    Task.findById(req.params.id)
        .then((result) => {
            res.render('update',{ tasks: result });
        })
        .catch((err) => {
            console.log(err);
        })
});

// update

app.post('/all/edit/:id',(req, res) => {

    let  t = req.body.title;
     let d = req.body.dis;
     let tf = req.body.tf;
     const task = {
         title: t,
         discription: d,
         completed: tf
     };

     Task.findByIdAndUpdate(req.params.id,task, (err) =>{
         if(err){
             console.log('kuchh gadbad hey');
         }
     })
         .then((result) => {
            // console.log(result);
             res.redirect('/');
         })
         .catch((err) => {
             console.log(err);
         });
 
 });
 
 app.get("/all/:id", (req, res) => {
    Task.findById(req.params.id)
        .then((result) => {
            res.render('details',{ tasks: result });
        })
        .catch((err) => {
            console.log(err);
        })
});

 app.delete('/all/delete/:id',(req, res) => {

    Task.findByIdAndDelete(req.params.id, (err) =>{
         if(err){
             console.log('kuchh gadbad hey');
         }
        // res.send('Success');
     })
        .then(result =>{
            res.json({ redirect: '/' });
           //res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });
         
 
 });


app.listen(PORT);
