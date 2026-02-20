// Em resumo, o TDD serve para contruir a lógica de testes baseado na lógica de negócio | apresentações 
// esperando o erro, e após este erro, evoluir o codigo de acordo com o erro retornado pelo jest

import { StormGlass } from '@src/clients/stormGlass';
import * as HTTPUtil from '@src/utill/request';
// Este import é o dados crus, que vem por padrão da api
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
// Este import é os dados normalizados (tranforma os objetos que vem da api em um objeto mais legível e objetivo)
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_3_hours.json';

jest.mock('@src/utill/request')

describe('StormGlass client', () => {
    // é um type cast que diz ao TypeScript que axios é um mock do Jest, possibilitando testes sem fazer requisições reais.
    // Este padrão é necessário em bibliotecas que fazem chamadas de api, acessa bancos de dados, serviços externos e envio de emails
    const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request> //Permite o uso do expect, toHaveBeenCalledWith e controle de erros
    test('should return the normalized forecast from the StormGlass service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        // O data é padrão do axios
        mockedRequest.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture } as HTTPUtil.Response<any>)

        const stormGlass = new StormGlass(mockedRequest);
        const response = await stormGlass.fetchPoints(lat, lng);

        expect(response).toEqual(stormGlassNormalized3HoursFixture); // Dados nomalizados
    });

    test('should exclude incomplete data points', async () => {
        const lat = -33.792726;
        const lng = 151.289824;
        const inconpleteRespeonse = {
            hours: [
                {
                    windDirection: {
                        noaa: 300
                    },
                    time: '2020-01-01T00:00:00Z'
                }
            ]
        };
        mockedRequest.get.mockResolvedValue({ data: inconpleteRespeonse } as HTTPUtil.Response<any>);
        const stormGlass = new StormGlass(mockedRequest);
        const response = await stormGlass.fetchPoints(lat, lng);
        expect(response).toEqual([]);
    });

    test('shold get a generic error from StormGlass service when the request fail before reaching the service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        mockedRequest.get.mockRejectedValue({ message: 'Network Error' });
        const stormGlass = new StormGlass(mockedRequest);

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error when trying to communicate to StormGlass: Network Error'
        )
    });

    test('should get an StormGlassResponseError when the StormGlass service responds with error', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        mockedRequest.get.mockRejectedValue({
            response: {
                status: 429,
                data: { errors: ['Rate Limit reached'] }
            }
        });

        const stormGlass = new StormGlass(mockedRequest);

        await expect(stormGlass.fetchPoints(lat, lng)).rejects.toThrow(
            'Unexpected error returned by the StormGlass service: Error: {"errors":["Rate Limit reached"]} Code: 429'
        )
    })
})