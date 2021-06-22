//SETUP EXPRESS
const express = require('express');
const cors = require('cors');
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const dotenv = require('dotenv');
const { addAbortSignal } = require('stream');
dotenv.config();

let app = express();//Creating an express app
app.use(express.json());//Because we have to send the response back as a JSON file, therefore we need this
app.use(cors());


//Function to connect to the MongoDB database
async function connect(){
    const mongo_url = process.env.MONGO_URL;
    let client = await MongoClient.connect(mongo_url, {
        "useUnifiedTopology": true
    })
    let db = client.db("stock_watchlist");
    console.log("database connected");
    return db;
}


async function main(){

    let db = await connect();//Connecting to MongoDb "stock_watchlist" database

    /*--------UNCOMMENT THE CODE BELOW TO SEARCH FOR DOCUMENTS IN THE "stock_watchlist" collection-----------------
        let results = await db.collection("stock_watchlist").find().toArray();
        for (let r of results){
            console.log(r);
        }
    */ 
  
    
    app.get('/stocks' , async(req,res)=>{
        let stocks = await db.collection('stock_watchlist').find().toArray();
        res.json(stocks)
    })

    app.post('/stocks' , async(req,res)=>{
        let results = await db.collection('stock_watchlist').insertOne({
            name: req.body.name,
            ticker: req.body.ticker,
            price: req.body.price
        })
        res.json(results.ops);
    })
}   

main();

//ROUTES




//START SERVER
app.listen(8888, () => {
    console.log("Server has started")
})