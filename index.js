const express = require('express');

const app = express();

const { pool } = require('./connection');

const bodyParser = require('body-parser');
app.use(bodyParser.json());


app.get('/users', async (req, res) => {
    let client = await pool.connect();
    try {
        const {id} = req.query;
        let sql_query = `SELECT * FROM users`;
        if(id)
        sql_query += ` WHERE id=${id}`;
        let result = await client.query(sql_query)
        res.status(200).send(result.rows);
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
        const joined_on = time.toLocaleDateString();
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


app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})
  