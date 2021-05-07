import app from '../lib/app.js';
import supertest from 'supertest';
import client from '../lib/client.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API routes', () => {


  afterAll(async () => {
    return client.end();
  });

  describe('post, put, delete, get', () => {

    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Waffle the user',
          email: 'waffle@user.com',
          password: 'Syrup'
        });

      expect(response.status).toBe(200);

      user = response.body;
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
      health.userId = user.id;
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
      planes.userId = user.id;
      const r1 = await request.post('/api/items').send(planes);
      planes = r1.body;

      shield.userId = user.id;
      const r2 = await request.post('/api/items').send(shield);
      shield = r2.body;

      const response = await request.get('/api/items');

      expect(response.status).toBe(200);

      const expected = [planes, shield, health].map(item => {
        return {
          userName: user.name,
          ...item
        };
      });

      expect(response.body).toEqual(expect.arrayContaining(expected));
    });

    it('GET shield from /api/items/:id', async () => {
      const response = await request.get(`/api/items/${shield.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...shield, userName: user.name });
    });

    it('DELETE health from /api/items/:id', async () => {
      const response = await request.delete(`/api/items/${health.id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(health);

      const getResponse = await request.get('/api/items');
      expect(getResponse.status).toBe(200);
      expect(getResponse.body.find(item => item.id === health.id)).toBeUndefined();
    });

    it('GET planes from /api/items/name/:name', async () => {
      const response = await request.get(`/api/items/name/${shield.name}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ ...shield, userName: user.name });
    });
  });

  describe('Seed data tests', () => {

    beforeAll(() => {
      execSync('npm run setup-db');
    });

    it('GET /api/items', async () => {
      // act - make the request
      const response = await request.get('/api/items');

      // was response OK (200)?
      expect(response.status).toBe(200);

      // did it return some data?
      expect(response.body.length).toBeGreaterThan(0);

      // did it return the data we expected?
      expect(response.body[0]).toEqual({
        id: expect.any(Number),
        name: expect.any(String),
        description: expect.any(String),
        type: expect.any(String),
        rarity: expect.any(String),
        requiresAttunement: expect.any(Boolean),
        userId: expect.any(Number),
        userName: expect.any(String)
      });

    });
  });

});