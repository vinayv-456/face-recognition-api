const express = require('express');

const app = express();

const { pool } = require('./connection');



app.get('/users', async (req, res) => {
    let client = await pool.connect();
    try {
        let sql_query = `SELECT * FROM users`;
        let result = await client.query(sql_query)
        res.status(200).send(result.rows);
    } catch(e){
        throw("failed to fetch", e);
    }
})

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})
  