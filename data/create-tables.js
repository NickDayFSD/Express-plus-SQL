/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(`  
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(50) NOT NULL,
        email VARCHAR(50) NOT NULL,
        password_hash VARCHAR(512) NOT NULL
      );
    
      CREATE TABLE items (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        type VARCHAR(512) NOT NULL,
        description VARCHAR(1024) NOT NULL,
        rarity VARCHAR(512) NOT NULL,
        requires_attunement BOOLEAN NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
      );
    `);

    console.log('create tables complete');
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}