/* eslint-disable indent */
/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import items from './items.js';

run();

async function run() {

  try {

    await Promise.all(
      items.map(item => {
        return client.query(`
          INSERT INTO items (name, description, type, rarity, requires_attunement)
          VALUES ($1, $2, $3, $4, $5);
          `,
          [item.name, item.description, item.type, item.rarity, item.requiresAttunement]);
      })
    );


    console.log('seed data load complete');
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}