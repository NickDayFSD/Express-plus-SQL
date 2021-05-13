/* eslint-disable indent */
/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import items from './items.js';
import users from './users.js';

run();

async function run() {

  try {

    const data = await Promise.all(
      users.map(user => {
        return client.query(`
          INSERT INTO users (name, email, password_hash)
          VALUES ($1, $2, $3)
          RETURNING *;
          `,
          [user.name, user.email, user.password]
        );
      })
    );

    const user = data[0].rows[0];

    await Promise.all(
      items.map(item => {
        return client.query(`
          INSERT INTO items (name, description, type, rarity,
                      requires_attunement, user_id)
          VALUES ($1, $2, $3, $4, $5, $6);
          `,
          [item.name, item.description, item.type, item.rarity, item.requiresAttunement, user.id]);
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