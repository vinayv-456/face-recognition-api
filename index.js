const express = require('express');
const {ClarifaiStub, grpc} = require("clarifai-nodejs-grpc");

const app = express();

var cors = require('cors')
const { pool } = require('./connection');

const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(cors())


app.get('/user/:id', async (req, res) => {
    let client = await pool.connect();
    try {
        const {id} = req.params;
        let sql_query = `SELECT * FROM users`;
        if(id)
        sql_query += ` WHERE id=${id}`;
        let result = await client.query(sql_query)
        res.status(200).send(result.rows[0]);
    } catch(e){
        throw("failed to fetch", e);
    }
    finally{
        client.release();
    }
})

app.post('/sign-up', async(req, res) => {
    let client = await pool.connect();
    try {
        await client.query('BEGIN');
        const {email, name, password} = req.body;
        const time = new Date();
        const joined_on = time.toISOString();
        let auth_insert = `INSERT INTO authenticate(email, password) VALUES ('${email}', MD5('${password}'))`
        await client.query(auth_insert); 
        let user_insert = `INSERT INTO users(name, email, entries, joined_on) VALUES ('${name}', '${email}', 0, '${joined_on}') RETURNING *`
        const user_record = await client.query(user_insert); 
        await client.query('COMMIT');
        res.status(201).send(user_record.rows[0]);
    } catch(e) {
        throw("unable to insert data", e);
    }
    finally{
        client.release();
    }
})

app.post('/sign-in', async(req, res) => {
    let client = await pool.connect();
    try
    {
        const {email, password} = req.body;
        const user_query = ` SELECT * FROM authenticate WHERE email='${email}' AND password=MD5('${password}')`;
        const result = await client.query(user_query);
        if(result.rowCount!=0)
        {
            const user_data_query = `SELECT * FROM users WHERE email='${email}'`;
            const user_data = await client.query(user_data_query);
            res.status(200).send(user_data.rows[0]);
        }
        else{
            //invalid user
            res.status(200).send()
        }
    } catch(e) {
        throw("error while fetching data", e);
    }
    finally{
        client.release();
    }
})

app.put('/score-increment/:id', async(req, res) => {
    let client = await pool.connect();
    try{
        const { id } = req.params;
        const sql_query = `UPDATE users SET entries=entries+1 WHERE id=${id} RETURNING *`
        const result = await client.query(sql_query);
        res.status(200).send(result.rows[0]);
    } catch(e){
        throw("failed to increment entries", e);
    }
    finally{
        client.release();
    }
})

app.get('/fr-image', async(req, res)=>{
    try{

        const stub = ClarifaiStub.grpc();

        const metadata = new grpc.Metadata();
        metadata.set('authorization', 'Key ' + "43887df9f7c9430a9e805186b990fb2a");
        const {imageUrl} = req.query;
        stub.PostModelOutputs(
            {
                // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
                model_id: "f76196b43bbd45c99b4f3cd8e8b40a8a",
                inputs: [{data: {image: {url: `${imageUrl}`}}}]
                },
                metadata,
                (err, response) => {
                    if (err) {
                        console.log("Error: " + err);
                        res.status(500).send();
                    }

                    if (response.status.code !== 10000) {
                        console.log("Received failed status: " + response.status.description + "\n" + response.status.details);
                        res.status(403).send();
                    }

                    console.log("Predicted concepts, with confidence values:", response.outputs[0].data.regions[0].region_info.bounding_box)
                    for (const c of response.outputs[0].data.regions) {
                        console.log(c.region_info);
                        res.status(200).send(c.region_info.bounding_box)
                    }
                }
            );
    }   
    catch(e){

    } 
})

app.listen(process.env.PORT || 4000, ()=> {
    console.log(`app is running on port ${process.env.PORT}`);
})
  