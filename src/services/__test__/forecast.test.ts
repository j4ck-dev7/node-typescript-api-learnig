import { StormGlass } from "@src/clients/stormGlass";
import stormGlassNormalizedResponse from '@test/fixtures/stormglass_normalized_3_hours.json';
import { Beach, BeachPosition, Forecast, ForecastProcessingError } from '../forecast'

jest.mock('@src/clients/stormGlass');

describe('Forecast Service', () => {
    const mockedStormGlassService = new StormGlass() as jest.Mocked<StormGlass>;
    test('should return the forecast for a list of beaches', async () => {
        // StormGlass.prototype.fetchPoints = jest.fn().mockResolvedValue(stormGlassNormalizedResponse) // Esta forma de mockar uma classe é ruim, por não ter como tipar.
        // Esta forma não mock a classe, e sim modifica o protótipo da classe diretamente. Neste caso o typescript não consegue saber os tipos do jest.fn()
        // assim ficando genérico, perdendo o autocompletar e validação de tipos.

        mockedStormGlassService.fetchPoints.mockResolvedValue(stormGlassNormalizedResponse);

        const beaches: Beach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E,
                user: 'some-id'
            }
        ]

        const expectedResponse = [
            {
                time: '2020-04-26T00:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 64.26,
                        swellHeight: 0.15,
                        swellPeriod: 3.89,
                        time: '2020-04-26T00:00:00+00:00',
                        waveDirection: 231.38,
                        waveHeight: 0.47,
                        windDirection: 299.45,
                        windSpeed: 100,
                    }
                ]
            },
            {
                time: '2020-04-26T01:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 123.41,
                        swellHeight: 0.21,
                        swellPeriod: 3.67,
                        time: '2020-04-26T01:00:00+00:00',
                        waveDirection: 232.12,
                        waveHeight: 0.46,
                        windDirection: 310.48,
                        windSpeed: 100
                    }
                ]
            },
            {
                time: '2020-04-26T02:00:00+00:00',
                forecast: [
                    {
                        lat: -33.792726,
                        lng: 151.289824,
                        name: 'Manly',
                        position: 'E',
                        rating: 1,
                        swellDirection: 182.56,
                        swellHeight: 0.28,
                        swellPeriod: 3.44,
                        time: '2020-04-26T02:00:00+00:00',
                        waveDirection: 232.86,
                        waveHeight: 0.46,
                        windDirection: 321.5,
                        windSpeed: 100
                    }
                ]
            }
        ];

        const forecast = new Forecast(mockedStormGlassService); // No uso de classes, é necessário que a classe testada comece com new. Caso o constructor esteja
        // inicializando uma outra classe, é necessário que dentro dos parenteses esteja a classe iniciando com o new (new class(new class()))
        const beachesWithList = await forecast.processForecastForBeaches(beaches); // o processForecastForBeaches é uma propriedade da classe Forecast
        expect(beachesWithList).toEqual(expectedResponse);
    });

    test('should return an empty list if no beaches are provided', async () => {
        const forecast = new Forecast();
        const response = await forecast.processForecastForBeaches([]);

        expect(response).toEqual([])
    });

    test('should throw internal processing error when something goes wrong during the rating process', async () => {
        const beaches: Beach[] = [
            {
                lat: -33.792726,
                lng: 151.289824,
                name: 'Manly',
                position: BeachPosition.E,
                user: 'some-id'
            }
        ];

        mockedStormGlassService.fetchPoints.mockRejectedValue(
            'Error fetching points'
        );

        const forecast = new Forecast(mockedStormGlassService);
        await expect(forecast.processForecastForBeaches(beaches)).rejects.toThrow(ForecastProcessingError);

    })
});