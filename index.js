const express = require('express');

const app = express();

const { pool } = require('./connection');



app.get('/', async (req, res) => {
    try {
        console.log(pool)
        let client = await pool.connect();
        let sql_query = `SELECT * FROM test`;
        let result = await client.query(sql_query)
        console.log(result.rows)
        res.send(result.rows);
    } catch(e){
        throw("failed to fetch", e);
    }
  })

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})
  