const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000
require('dotenv').config()




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
            console.log(product);
            if (!product.name || !product.price || !product.image || !product.quentity || !product.SPName || !product.details) {
                return res.send({ success: false, error: `Please Provide All Information` })
            }
            const result = await productCollection.insertOne(product);
            res.send({ success: true, message: `SuccesFully Added ${product.name}` })

        })

        //  || !product.pdDetails

        // app.post('/products', async (req, res) => {
        //     const product = req.body;
        //     if (!product.name || !product.price) {
        //         return res.send({ success: false, error: `Please Provide All Information` })
        //     }
        //     const result = await productCollection.insertOne(product);
        //     console.log(result);
        //     res.send({ success: true, message: `Succesfully Added ${product.name}` })

        // })




        app.get('/product', async (req, res) => {
            const cursor = productCollection.find();
            const product = await cursor.toArray();

            if (!product?.length) {
                return res.send({ success: false, error: `No Product Found` })
            }
            res.send({ success: true, data: product });
        })




        app.delete('/product/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const product = await productCollection.deleteOne(query);
            res.send({ success: true, data: product });
        })



        app.get('/product', async (req, res) => {
            const query = req.query;
            const cursor = collection.find(query);
            const product = await cursor.toArray();


            res.send({ success: true, data: product });
        })




        // app.get('/items', async (req, res) => {
        //     const query = req.query;
        //     if (query) {
        //         const cursor = collection.find(req.query);
        //         const result = await cursor.toArray();
        //         res.send(result)
        //     }
        //     else {
        //         const query = {};
        //         const cursor = collection.find(query);
        //         const result = await cursor.toArray();
        //         res.send(result)
        //     }
        // })









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