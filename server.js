const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/chuckDB', {useNewUrlParser: true, useUnifiedTopology: true});

const factSchema = {
    title: String,
    content: String
};

const Fact = mongoose.model('Fact', factSchema);

//chained route handler
//for all records
app.route('/facts')
.get((req, res)=>{
    Fact.find((error, facts)=>{
        if(!error){
            console.log(facts);
            res.send(facts);
        }else{
            console.log(error);
        }
    });
})
.post((req, res)=>{
    console.log(req.body.title);
    console.log(req.body.content);
    //save a new fact send by hte POST request to the database
    const newFact = new Fact({
        title: req.body.title,
        content: req.body.content
    });

    newFact.save((error) =>{
        if(!error){
            res.send("Successfully added a new fact about Chuck Norris");
        }else{
            res.send(error);
        }
    });

})
.delete((req, res) =>{
    Fact.deleteMany((error)=>{
        if(!error){
            res.send("Successfully deleted all facts.");
        }else{
            res.send(error);
        }
    });
});

app.route('/facts/:factTitle')
.get((req, res) => {
    Fact.findOne(
        {title: req.params.factTitle},
        (error, fact) =>{
            if(!error){
                res.send(fact);
            }else{
                res.send(error);
            }
        });
})
.put((req,res) => {
    Fact.update(
        {title: req.params.factTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite: true},
        (error) =>{
            if(!error){
                res.send("Successfully updated the fact.");
            }else{
                console.log(error);
            }
        });
})
.patch((req, res) => {
    Fact.update(
        {title: req.params.factTitle},
        {$set: req.body},
        (error) => {
            if(!error){
                res.send("Successfulle patched the fact.");
            }
        });
})
.delete((req, res) => {
    Fact.deleteOne(
        {title: req.params.factTitle},
        (error) => {
            if(!error) {
                console.log("Successfulle deleted the corresponding fact.");
            } else {
                res.send(error);
            }
        });
});




app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
});