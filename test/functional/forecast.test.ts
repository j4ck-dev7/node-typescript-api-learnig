import supertest from 'supertest';

describe('Beach forecast functional tests', () => { // Descreve um conjunto de testes
    it('should return a forecast with just a few times', async () => {
        const { body, status } = await supertest(app).get('/forecast');
        expect(status).toBe(200)
        expect(body).toBe(0)
    })
})