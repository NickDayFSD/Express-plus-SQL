import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  // beforeAll(() => {
  //   execSync('npm run setup-db');
  // });

  beforeAll(() => {
    execSync('npm run recreate-tables');
  });

  afterAll(async () => {
    return client.end();
  });

  const expectedItems = [
    {
      id: 1,
      name: 'Adamantine Armor',
      description: 'This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you\'re wearing it, any critical hit against you becomes a normal hit.',
      type: 'Armor (medium or heavy)',
      rarity: 'uncommon',
      requiresAttunement: false
    },
    {
      id: 2,
      name: 'Amulet of Health',
      description: 'Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher.',
      type: 'Wondrous item',
      rarity: 'rare',
      requiresAttunement: true
    },
    {
      id: 3,
      name: 'Amulet of Proof against Detection and Location',
      description: 'While wearing this amulet, you are hidden from divination magic. You can\'t be targeted by such magic or perceived through magical scrying sensors.',
      type: 'Wondrous item',
      rarity: 'uncommon',
      requiresAttunement: true
    },
    {
      id: 4,
      name: 'Amulet of the Planes',
      description: 'While wearing this amulet, you can use an action toname a location that you are familiar with on another plane of existence. Then make a DC 15 Intelligence check. On a successful check, you cast the _plane shift_ spell. On a failure, you and each creature and object within 15 feet of you travel to a random destination. Roll a d100. On a 1-60, you travel to a random location on the plane youname . On a 61-100, you travel to a randomly determined plane of existence.',
      type: 'Wondrous iem', 'rarity': 'very rare',
      requiresAttunement: true
    },
    {
      id: 5,
      name: 'Animated Shield',
      description: 'While holding this shield, you can speak its command word as a bonus action to cause it to animate. The shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The shield remains animated for 1 minute, until you use a bonus action to end this effect, or until you are incapacitated or die, at which point the shield falls to the ground or into your hand if you have one free.',
      type: 'Armor (shield)',
      rarity: 'very rare',
      requiresAttunement: true
    }
  ];

  // If a GET request is made to /api/items, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data?
  it.skip('GET /api/items', async () => {
    // act - make the request
    const response = await request.get('/api/items');

    // was response OK (200)?
    expect(response.status).toBe(200);

    // did it return the data we expected?
    expect(response.body).toEqual(expectedItems);

  });

  // If a GET request is made to /api/cats/:id, does:
  // 1) the server respond with status of 200
  // 2) the body match the expected API data for the cat with that id?
  test.skip('GET /api/items/:id', async () => {
    const response = await request.get('/api/items/2');
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedItems[1]);
  });

  let health = {
    id: expect.any(Number),
    name: 'Amulet of Health',
    description: 'Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher.',
    type: 'Wondrous item',
    rarity: 'rare',
    requiresAttunement: true
  };

  let planes = {
    id: expect.any(Number),
    name: 'Amulet of the Planes',
    description: 'While wearing this amulet, you can use an action toname a location that you are familiar with on another plane of existence. Then make a DC 15 Intelligence check. On a successful check, you cast the _plane shift_ spell. On a failure, you and each creature and object within 15 feet of you travel to a random destination. Roll a d100. On a 1-60, you travel to a random location on the plane youname . On a 61-100, you travel to a randomly determined plane of existence.',
    type: 'Wondrous iem', 'rarity': 'very rare',
    requiresAttunement: true
  };

  let shield = {
    id: expect.any(Number),
    name: 'Animated Shield',
    description: 'While holding this shield, you can speak its command word as a bonus action to cause it to animate. The shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The shield remains animated for 1 minute, until you use a bonus action to end this effect, or until you are incapacitated or die, at which point the shield falls to the ground or into your hand if you have one free.',
    type: 'Armor (shield)',
    rarity: 'very rare',
    requiresAttunement: true
  };

  it('POST health to /api/items', async () => {
    const response = await request
      .post('/api/items')
      .send(health);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(health);

    health = response.body;
  });

  it('PUT updated shield to /api/items/:id', async () => {
    health.name = 'Suberb Amulet of Health';
    health.rarity = 'legendary';

    const response = await request
      .put(`/api/items/${health.id}`)
      .send(health);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(health);
  });

  it('GET list of items from /api/items', async () => {
    const r1 = await request.post('/api/items').send(planes);
    planes = r1.body;
    const r2 = await request.post('/api/items').send(shield);
    shield = r2.body;

    const response = await request.get('/api/items');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([health, planes, shield]));
  });
});