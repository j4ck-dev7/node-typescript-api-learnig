import { AxiosError } from 'axios'
import { InternalError } from '@src/utill/errors/internal-error'
import config, { IConfig } from 'config'
import * as HTTPUtil from '@src/utill/request'

export interface stormGlassPointSource { // Especifica uma chave do tipo string com o seu valor do tipo number
    [key: string] : number
}

export interface stormGlassPoint { // Especifica o tipo de cada campo, juntando com o stormGlassPointSouce (swellHeight : { noaa : 1 })
    readonly time : string,
    readonly swellHeight: stormGlassPointSource,
    readonly swellDirection: stormGlassPointSource,
    readonly windSpeed: stormGlassPointSource,
    readonly windDirection: stormGlassPointSource,
    readonly swellPeriod: stormGlassPointSource,
    readonly waveDirection: stormGlassPointSource,
    readonly waveHeight: stormGlassPointSource
}

// interface define a estrutura de dados | tipos de cada campo 
export interface StormGlassForecastResponse { // Especifica o tipo do conjunto de arrays
    hours: stormGlassPoint[]
}

export interface ForecastPoint {
    time: string,
    waveHeight: number,
    waveDirection: number,
    windSpeed: number,
    windDirection: number,
    swellHeight: number,
    swellDirection: number,
    swellPeriod: number
}

// Erro ao comunicar com a api externa
export class ClientRequestError extends InternalError {
    constructor(message: string) {
        const internalMessage = `Unexpected error when trying to communicate to StormGlass`
        super(`${internalMessage}: ${message}`)
    }
};

// Erro retornado pela api quando houve falha
export class StormGlassResponseError extends InternalError{
    constructor(message: string){
        const internalMessage = 'Unexpected error returned by the StormGlass service';
        super(`${internalMessage}: ${message}`)
    }
}

// Aqui recupera os objetos definidos no config/default.json | test.json para usar suas propriedades
const stormGlassResourceConfig : IConfig = config.get('App.resources.StormGlass');

export class StormGlass { 
    // O readonly serve para ter um dado fixo
    readonly stormGlassAPIParams = 
     'swellHeight,swellDirection,windSpeed,swellPeriod,waveDirection,windDirection,waveHeight';
    readonly stormGlassAPISource = 'noaa';

    // O constructor é necessário para declarar e receber a dependência com tipo correto, permitindo que o TypeScript valide o código 
    // e que frameworks façam injeção automática.
    constructor(protected request = new HTTPUtil.Request()){} // O protected pode ser acessado por outras  que herdam a classes 
    // com protected (clases novas não podem) diferentemente do privateclasses

    public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> { // É recomendado que todas as funções sejam tipadas, dizendo o tipo dos argumentos e o tipo de retorno.
        try {
            const response = await this.request.get<StormGlassForecastResponse>(
            `${stormGlassResourceConfig.get('apiUrl')}/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`,
            {
                headers: {
                    Authorization: stormGlassResourceConfig.get('apiToken')
                }
            }
            ) 
            return this.normalizeResponse(response.data) // Sempre use o return 
        } catch (error){ // O error é desconhecido pelo typescript, ou seja ele não sabe se há propriedades nele
            if(HTTPUtil.Request.isRequestError(error as AxiosError)) { // É necessário afirmar ao typescript que este erro
                // vem do axios utilizando type assertion
                throw new StormGlassResponseError(`Error: ${JSON.stringify((error as AxiosError).response?.data)} Code: ${(error as AxiosError).response?.status}`)
            }
            throw new ClientRequestError((error as Error).message) // (error) Por isso é necessário afirmar ao typescript que este error
            // é um Error com type assertion
            // Caso o error retorne null, corre o risco de quebrar a aplicação
        }
    }

    private normalizeResponse(
        points: StormGlassForecastResponse
    ): ForecastPoint[] { // O bind(this) é a classe atual, o StormGlass
        return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({ // bind() é um método que cria uma nova função com o contexto this
            swellDirection: point.swellDirection[this.stormGlassAPISource],
            swellHeight: point.swellHeight[this.stormGlassAPISource],
            swellPeriod: point.swellPeriod[this.stormGlassAPISource],
            time: point.time,
            waveDirection: point.waveDirection[this.stormGlassAPISource],
            waveHeight: point.waveHeight[this.stormGlassAPISource],
            windDirection: point.windDirection[this.stormGlassAPISource],
            windSpeed: point.windSpeed[this.stormGlassAPISource],
        }));
    }

  // Este Partial<T> é um utilitário que torna todos os campos de um objeto em tipos opcionais, assim criando um novo
  // tipo onde cada campo pode ser ou não definida 
    private isValidPoint(point: Partial<stormGlassPoint>): boolean {
        return !!( // Converte o retorno em boolean
            point.time &&
            point.swellDirection?.[this.stormGlassAPISource] &&
            point.swellHeight?.[this.stormGlassAPISource] &&
            point.swellPeriod?.[this.stormGlassAPISource] &&
            point.waveDirection?.[this.stormGlassAPISource] &&
            point.waveHeight?.[this.stormGlassAPISource] &&
            point.windDirection?.[this.stormGlassAPISource] &&
            point.windSpeed?.[this.stormGlassAPISource]
            // ?. = optional chaining (acessa só se existir)
            // && = AND lógico (todos precisam ser verdadeiros)
            // !! = converte para booleano (transforma qualquer valor em true ou false)
        );
    }
}