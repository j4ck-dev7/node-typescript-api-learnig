describe('Beach forecast functional tests', () => {
    // Descreve um conjunto de testes
    test('should return a forecast with just a few times', async () => {
        const { body, status } = await global.testRequest.get('/forecast');
        expect(status).toBe(200);
        expect(body).toEqual({
            message: 'Previsão do tempo: Sol com algumas nuvens',
        });
    });
});
