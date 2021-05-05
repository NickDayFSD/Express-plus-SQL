/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import magicItems from './magic-items.js';

run();

async function run() {

  try {

    await Promise.all(
      magicItems.map(item => {
        return client.query(`
          INSERT INTO items (name, description, type, rarity, requires-attunement)
          VALUES ($1, $2, $3, $4, $5);
          `,
          [item.name, item.desc, item.type, item.rarity, item.requresAttunement]);
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