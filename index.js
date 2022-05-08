const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000
require('dotenv').config()
const jwt = require('jsonwebtoken');



// middle wear

app.use(cors())
app.use(express.json())








const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.8ngni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run() {
    try {
        await client.connect();
        const productCollection = client.db("cycleDB").collection("product");


        app.post('/product', async (req, res) => {
            const product = req.body;
            const accessToken = req.body.token;
            const email = product.email;
            const decoded = verifyToken(accessToken);
            console.log(decoded.email);

            if (email === decoded.email) {

                if (!product.name || !product.price || !product.image || !product.quantity || !product.SPName || !product.details) {
                    return res.send({ success: false, error: `Please Provide All Information` })
                }
                await productCollection.insertOne(product);
                res.send({ success: true, message: `SuccesFully Added ${product.name}` })
            }
            else {
                res.send({ success: 'UnAuthoraized Access' })
            }

        })



        app.get('/product', async (req, res) => {
            const email = req.query;
            if (email) {
                const cursor = productCollection.find(req.query);
                const product = await cursor.toArray();
                if (!product?.length) {
                    return res.send({ success: false, error: `No Product Found` })
                }
                res.send({ success: true, data: product });
            } else {
                const cursor = productCollection.find();
                const product = await cursor.toArray();

                if (!product?.length) {
                    return res.send({ success: false, error: `No Product Found` })
                }
                res.send({ success: true, data: product });
            }
        })




        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.deleteOne(query);
            res.send({ success: true, data: product });
        })


        app.get('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const cursor = productCollection.find(query);
            const product = await cursor.toArray();
            res.send({ success: true, data: product });
        })




        app.put('/product/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: data.quantity
                },
            };
            const product = await productCollection.updateOne(filter, updateDoc, options);
            res.send({ success: true, data: product });
        })


        // jwt verification
        app.post('/login', async (req, res) => {
            const email = req.body;
            console.log(email);
            const token = jwt.sign(email, process.env.ACCESS_TOKEN);
            res.send({ token });
        })

        app.get('/product', async (req, res) => {
            const query = req.query;
            const cursor = collection.find(query);
            const product = await cursor.toArray();
            res.send({ success: true, data: product });
        })

    } catch (error) {
        console.log(error);
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('databage is runing')
})



app.listen(port, () => {
    console.log(`listing to the port Of : `, port);
})



// verify token
function verifyToken(token) {
    let email;
    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, decoded) {
        if (err) {
            email = 'Invalid Email'
        }
        if (decoded) {
            email = decoded
        }
    })
    return email;
}