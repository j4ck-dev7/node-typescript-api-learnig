import { AxiosStatic } from 'axios'

export class StormGlass { 
    readonly stormGlassAPIParams = 
     'swellHeight,swellDirection,windSpeed,windDirection,swellPeriod,waveDirection,windDirection';
    readonly stormGlassAPISource = 'noaa';

    constructor(protected request: AxiosStatic){}

    public async fetchPoints(lat: number, lng: number): Promise<[]> { // É recomendado que todas as funções sejam tipadas, dizendo o tipo dos argumentos e o tipo de retorno.
        return this.request.get(`https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.stormGlassAPIParams}&source=${this.stormGlassAPISource}`) // Sempre use o return 
    }
}