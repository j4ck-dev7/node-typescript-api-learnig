// Neste arquivo, é criado os erros internos, ou seja, não será enviado para o usuário.
// Estes erros serão utilizados quando estiver usando monitoring, para saber se foi um 
// erro de desenvolvimento ou erro externos

export class InternalError extends Error {
    constructor(
        public message: string,
        protected code: number = 500,
        protected description?: string
    ) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}