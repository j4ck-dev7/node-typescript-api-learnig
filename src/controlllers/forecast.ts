import { Controller, Get } from '@overnightjs/core';
import { Request, Response } from 'express';

@Controller('forecast') // Define que as rotas que serão concatenadas ao prefixo que foi definido no controller
export class ForecastController {
    @Get('') // Método HTTP Get
    public getForecast(_: Request, res: Response) {
        return res.json({
            message: 'Previsão do tempo: Sol com algumas nuvens',
        });
    }
}
