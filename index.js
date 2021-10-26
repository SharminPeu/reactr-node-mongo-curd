const express = require('express');
const { MongoClient } = require('mongodb');
const cors=require('cors')
const ObjectId=require('mongodb').ObjectId;

const app = express();

const port =process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

// user: mydbuser1
// password: WBzAVWJkXb85usYv

const uri = "mongodb+srv://mydbuser1:WBzAVWJkXb85usYv@cluster0.qqycq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//   const collection = client.db("foodMaster").collection("users");
//   // perform actions on the collection object
//   console.log('hitting the database');

//   const user={name:'Mahiya Mahi', email:'mahi@gmail.com',phone:'019999999'};
//   collection.insertOne(user)
//   .then(()=>{
//       console.log('insert success');
//   })
// //   console.error(err);
// //   client.close();
// });

async function run() {
    try {
      await client.connect();
      const database = client.db("foodMaster");
      const usersCollection = database.collection("users");
    // get API
    app.get('/users',async(req,res)=>{
        const cursor=usersCollection.find({});
        const users=await cursor.toArray();
        res.send(users)
    })

    app.get('/users/:id',async(req,res)=>{
        const id=req.params.id;
        console.log('load user with id:',id);
        const query={_id:ObjectId(id)};
        const user=await usersCollection.findOne(query);

        res.send(user)
    })
    //   POST API
    app.post('/users',async(req,res)=>{
        const newUser=req.body;
        const result=await usersCollection.insertOne(newUser);
        console.log('got new user',req.body);
        console.log('added user',result);
        res.json(result);
    });
    // update API
    app.put('/users/:id',async(req,res)=>{
        const id=req.params.id;
        const updatedUser=req.body;
        const filter={_id:ObjectId(id)};
        const options={upsert:true};
        const updateDoc={
            $set:{
                name:updatedUser.name,
                email:updatedUser.email
            },
        };
        const result= await usersCollection.updateOne(filter,updateDoc,options)
        console.log('updating user',req);
        res.json(result)
    })
    // delete API:
    app.delete('/users/:id',async(req,res)=>{
const id=req.params.id;
const query ={_id:ObjectId(id)};
const result =await usersCollection.deleteOne(query);
console.log('deleting user with id',id);
console.log('deleting user with id',result);
res.json(result);
    })
    }
     finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Running my CURD server');
});

app.listen(port, () => {
  console.log('listening to port',port)
});