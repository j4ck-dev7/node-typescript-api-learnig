import { AxiosStatic } from 'axios'

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

export class StormGlass { 
    readonly stormGlassAPIParams = 
     'swellHeight,swellDirection,windSpeed,swellPeriod,waveDirection,windDirection,waveHeight';
    readonly stormGlassAPISource = 'noaa';

    // O constructor é necessário para declarar e receber a dependência com tipo correto, permitindo que o TypeScript valide o código 
    // e que frameworks façam injeção automática.
    constructor(protected request: AxiosStatic){} // O protected pode ser acessado por outras classes que herdam a classes 
    // com protected (clases novas não podem) diferentemente do private

    public async fetchPoints(lat: number, lng: number): Promise<ForecastPoint[]> { // É recomendado que todas as funções sejam tipadas, dizendo o tipo dos argumentos e o tipo de retorno.
        const response = await this.request.get<StormGlassForecastResponse>(
            `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`) 
            return this.normalizeResponse(response.data) // Sempre use o return 
    }

    private normalizeResponse(
        points: StormGlassForecastResponse
    ): ForecastPoint[] {
        return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
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

  private isValidPoint(point: Partial<stormGlassPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.stormGlassAPISource] &&
      point.swellHeight?.[this.stormGlassAPISource] &&
      point.swellPeriod?.[this.stormGlassAPISource] &&
      point.waveDirection?.[this.stormGlassAPISource] &&
      point.waveHeight?.[this.stormGlassAPISource] &&
      point.windDirection?.[this.stormGlassAPISource] &&
      point.windSpeed?.[this.stormGlassAPISource]
    );
  }
}