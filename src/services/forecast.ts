import { StormGlass, ForecastPoint } from "@src/clients/stormGlass";
import { InternalError } from "@src/utill/errors/internal-error";

export enum BeachPosition {
    S = 'S',
    E = 'E',
    W = 'W',
    N = 'N'
};

export interface Beach {
    name: string;
    position: BeachPosition;
    lat: number;
    lng: number;
    user: string;
};

export class ForecastProcessingError extends InternalError {
    constructor(message: string) {
        super(`Unexpected error during the forecast processing: ${message}`)
    }
}

export interface TimeForecast {
    time: string;
    forecast: BeachForecast[]
};

export interface BeachForecast extends Omit<Beach, 'user'>, ForecastPoint {} // Esta interface BeachForecast é uma concatenação
// interface Beach com a interface ForecastPoint, mas com o Beach omitindo | ocultando o campo user

export class Forecast {
    constructor(protected stormGlass = new StormGlass()){}

    public async processForecastForBeaches(beaches: Beach[]): Promise<TimeForecast[]>{
        const pointsWithCorrectSource: BeachForecast[] = [];
        try {
            for(const beach of beaches){
            const points = await this.stormGlass.fetchPoints(beach.lat, beach.lng);
            const enrichedBeachData = this.enrichedBeachData(points, beach)
            pointsWithCorrectSource.push(...enrichedBeachData) // Inclui o enrichedBeachData no array pointsWithCorrectSource, mas tem um porém, se o enrichedBeachData
            // estiver sem o spread operator (...) o array pointsWithCorrectSource receberá um array dentro de outro array, o que é um erro
        }

        return this.mapForecastByTime(pointsWithCorrectSource);
        } catch (error) {
            throw new ForecastProcessingError((error as Error).message);
        }
        
    };

    private enrichedBeachData (points: ForecastPoint[], beach: Beach): BeachForecast[] {
        return points.map((e) => ({
            ...{ // Concatena este objeto com outro objeto (e)
                lat: beach.lat,
                lng: beach.lng,
                name: beach.name,
                position: beach.position,
                rating: 1
            },
            ...e
        }));
    }

    private mapForecastByTime(forecast: BeachForecast[]): TimeForecast[] {
        const forecastByTime: TimeForecast[] = [];
        for(const point of forecast){
            const timePoint = forecastByTime.find((f) => f.time === point.time);
            if(timePoint){ // Se o timePoint não retornar undefined, é porque o horário já existe, então o horário é adicionado. 
                timePoint.forecast.push(point);
            } else { // Se o timePoint retornar undefined, um novo objeto TimeForecast é criado
                forecastByTime.push({ time: point.time, forecast: [point] });
            }
        }
        return forecastByTime;
    }
}