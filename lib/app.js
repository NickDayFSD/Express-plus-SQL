/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

// heartbeat route
app.get('/', (req, res) => {
  res.send('Dungeons and Dragons Magic Items API');
});

/** API routes **/
app.post('/api/items', async (req, res) => {
  try {
    const item = req.body;

    const data = await client.query(`
      INSERT INTO  items (name, description, type, rarity, requires_attunement)
      VALUES       ($1, $2, $3, $4, $5)
      RETURNING    id, name, description, type, rarity, requires_attunement as "requiresAttunement";
      `, [item.name, item.description, item.type, item.rarity, item.requiresAttunement]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/items/:id', async (req, res) => {
  try {
    const item = req.body;

    const data = await client.query(`
      UPDATE  items
      SET     name = $1, description = $2, type = $3,
              rarity = $4, requires_attunement = $5
      WHERE   id = $6
      RETURNING id, name, description, type, rarity, requires_attunement as "requiresAttunement";
      `, [item.name, item.description, item.type, item.rarity, item.requiresAttunement, req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/items/:id', async (req, res) => {
  try {
    const data = await client.query(`
      DELETE FROM   items
      WHERE id = $1
      RETURNING id, name, description, type, rarity, requires_attunement as "requiresAttunement";
      `, [req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/items', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              type,
              description,
              rarity,
              requires_attunement AS "requiresAttunement"
      FROM    items;
    `);

    // send back the data
    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/items/:id', async (req, res) => {
  // use SQL query to get data...
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              type,
              description,
              rarity,
              requires_attunement AS "requiresAttunement"
      FROM    items
      WHERE   id = $1;
    `, [req.params.id]);

    // send back the data
    res.json(data.rows[0] || null);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/items/name/:name', async (req, res) => {
  // use SQL query to get data...
  console.log(req.params.name);
  try {
    const data = await client.query(`
      SELECT  id,
              name,
              type,
              description,
              rarity,
              requires_attunement AS "requiresAttunement"
      FROM    items
      WHERE   name = $1;
    `, [req.params.name]);

    // send back the data
    res.json(data.rows[0] || null);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;