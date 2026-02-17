// Em resumo, o TDD serve para contruir a lógica de testes baseado na lógica de negócio | apresentações 
// esperando o erro, e após este erro, evoluir o codigo de acordo com o erro retornado pelo jest

import { StormGlass } from '@src/clients/stormGlass';
import axios from 'axios';
// Este import é o dados crus, que vem por padrão da api
import stormGlassWeather3HoursFixture from '@test/fixtures/stormglass_weather_3_hours.json';
// Este import é os dados normalizados (tranforma os objetos que vem da api em um objeto mais legível e objetivo)
import stormGlassNormalized3HoursFixture from '@test/fixtures/stormglass_normalized_3_hours.json';

jest.mock('axios')

describe('StormGlass client', () => {
    // é um type cast que diz ao TypeScript que axios é um mock do Jest, possibilitando testes sem fazer requisições reais.
    // Este padrão é necessário em bibliotecas que fazem chamadas de api, acessa bancos de dados, serviços externos e envio de emails
    const mockedAxios = axios as jest.Mocked<typeof axios> //Permite o uso do expect, toHaveBeenCalledWith e controle de erros
    test('should return the normalized forecast from the StormGlass service', async () => {
        const lat = -33.792726;
        const lng = 151.289824;

        // O data é padrão do axios
        mockedAxios.get.mockResolvedValue({ data: stormGlassWeather3HoursFixture })

        const stormGlass = new StormGlass(mockedAxios);
        const response = await stormGlass.fetchPoints(lat, lng);

        expect(response).toEqual(stormGlassNormalized3HoursFixture); // Dados nomalizados
    });

    test('should exclude incompllete data points', async () => {
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
        mockedAxios.get.mockResolvedValue({ data: inconpleteRespeonse });
        const stormGlass = new StormGlass(mockedAxios);
        const response = await stormGlass.fetchPoints(lat, lng);
        expect(response).toEqual([]);
    })
})