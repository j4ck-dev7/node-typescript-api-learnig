import './utill/module-alias';
import { Server } from '@overnightjs/core';
import express from 'express';
import { ForecastController } from './controlllers/forecast';

// Class é um modelo para criar objetos com propriedades e métodos específicos
export class SetupServer extends Server { // O uso class junto com o extends permite que as funções presentes no Server sejam acessadas pela classe SetupServer  
    constructor(private port = 5000) { // O constructor é um método especial para criar e inicializar uma instência de uma classe quando chama a palavra-chave new
        super(); // O super inicializa os parâmetros vindo de uma herança
    } // O constructor não pode ser async, então banco de dados e outras conexões devem ser feitas em outro método, como o init

    public init(): void { // O void diz que nada será retornado
        this.setupExpress()
        this.setupControllers()
    }

    private setupExpress(): void { // Private é um modificador de acesso que torna o método acessível apenas dentro da classe onde foi definido, ou seja, não pode ser chamado de fora da classe
        this.app.use(express.json());
    }

    private setupControllers(): void{
        const forecastController = new ForecastController()
        this.addControllers([forecastController]);
    }

    public getApp(): express.Application {
        return this.app;
    }
}