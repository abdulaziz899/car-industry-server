
const express = require('express')
require('dotenv').config()
const bodyParser=require('body-parser');
const cors=require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;


const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 4000;


app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-shard-00-00.w8vla.mongodb.net:27017,cluster0-shard-00-01.w8vla.mongodb.net:27017,cluster0-shard-00-02.w8vla.mongodb.net:27017/${process.env.DB_NAME}?ssl=true&replicaSet=atlas-kn5rpb-shard-0&authSource=admin&retryWrites=true&w=majority`;

MongoClient.connect(uri, function(err, client) {

  const collection = client.db("carCare").collection("car");
  const staffCollection = client.db("carCare").collection("staff");
  const reviewCollection = client.db("carCare").collection("review");
  const usersCollection = client.db("carCare").collection("users");
  
  console.log("data base connect success full");

   //service  add in data base 
    app.post('/addService',(req,res)=>{
        const event=req.body;
        console.log(event);
        collection.insertOne(event)
        .then(result=>{
        console.log(result.insertedCount);
        res.send(result.insertedCount>0);
        })
    });

    //show service ui
    
    app.get('/allService',(req,res)=>{
      collection.find({})
      .toArray((err,documents)=>{
          console.log(documents);
          res.send(documents);
      })
  })

  // delete service 

  app.delete('/delete/:id',(req,res)=>{
    collection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
     console.log(result);
     res.send(result.deletedCount>0)
    })
  })

  //user details add db
    app.post('/usersDetails',(req,res)=>{
        const user=req.body;
        usersCollection.insertOne(user)
        .then(result=>{
        res.send(result.insertedCount>0);
        })
    });


  app.patch('/update/:id',(req,res)=>{
    console.log(req.params.id);
    usersCollection.updateOne({_id:ObjectId(req.params.id)},{
      $set:{status:req.body.status}
    })
    .then(result=>{
      console.log(result);
    //  res.send(result.deletedCount>0)
    })
  })

    app.get('/usersDetailShow',(req,res)=>{
      const email=req.query.email;
      staffCollection.find({email:email})
        .toArray((err,admin)=>{
          if (admin.length===0) {
            usersCollection.find({email:email})
            .toArray((err,documents)=>{
                res.send(documents);
            })
          }
          else if(admin.length>0){
            usersCollection.find({})
            .toArray((err,documents)=>{
                res.send(documents);
            })
          }
        })
        
    })


    //staff add db
    app.post('/addStaff',(req,res)=>{
      const newStaff=req.body;
      staffCollection.insertOne(newStaff)
      .then(result=>{
      res.send(result.insertedCount>0);
      })
  });

  app.post('/isAdmin',(req,res)=>{
    const email=req.body.email;
    staffCollection.find({email: email})
    .toArray((err,admin)=>{
    res.send(admin.length>0);
    })
})

  // staff details show ui
    app.get('/allStaff',(req,res)=>{
      staffCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    });

    //delete staff 
    app.delete('/deletes/:id',(req,res)=>{
      staffCollection.deleteOne({_id:ObjectId(req.params.id)})
      .then(result=>{
       res.send(result.deletedCount>0)
      })
    })


      //review add db
      app.post('/addReview',(req,res)=>{
        const review=req.body;
        reviewCollection.insertOne(review)
        .then(result=>{
        res.send(result.insertedCount>0);
        })
    })

    //review show ui
    app.get('/allReview',(req,res)=>{
      reviewCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    });

    //find one service id
    app.get('/services/:id',(req,res)=>{
      collection.find({_id:ObjectId(req.params.id)})
      .toArray((err,documents)=>{
        res.send(documents[0])
      })
    })

    // success full working project

    app.get('/successFullProject',(req,res)=>{
      usersCollection.find({})
        .toArray((err,documents)=>{
            res.send(documents);
        })
    });


});


app.listen(port)