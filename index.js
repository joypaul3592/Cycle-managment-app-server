const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000
require('dotenv').config()




// middle wear

app.use(cors())
app.use(express())








const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.8ngni.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });





async function run() {
    try {
        await client.connect();
        const productCollection = client.db("cycleDB").collection("product");


        app.post('/product', async (req, res) => {
            const products = req.body;
            if (!products.name || !products.price || !products.image || !products.pdQuentity || !products.spName || !products.pdDetails) {
                return res.send({ success: false, error: `Please Provide All Information` })
            }
            const result = await productCollection.insertOne(products);
            res.send({ success: true, message: `SuccesFully Added ${products.name}` })

        })



        // app.post('/products', async (req, res) => {
        //     const product = req.body;
        //     if (!product.name || !product.price) {
        //         return res.send({ success: false, error: `Please Provide All Information` })
        //     }
        //     const result = await productCollection.insertOne(product);
        //     console.log(result);
        //     res.send({ success: true, message: `Succesfully Added ${product.name}` })

        // })




        // app.get('/products', async (req, res) => {
        //     const cursor = productCollection.find();
        //     const products = await cursor.toArray();

        //     if (!products?.length) {
        //         return res.send({ success: false, error: `No Product Found` })
        //     }
        //     res.send({ success: true, data: products });
        // })




        // app.post('/products/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) }
        //     const result = await productCollection.deleteOne(query);
        //     res.send(result)

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