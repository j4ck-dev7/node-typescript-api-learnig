import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";;

export interface RequestConfig extends AxiosRequestConfig {}
export interface Response<T> extends AxiosResponse<T> {}

// Aqui abstrai o uso do axios, permitindo que ele não seja exposto
export class Request {
    constructor(private request = axios) {}

    public get<T>(url: string, config: RequestConfig = {}): Promise<Response<T>> {
        return this.request.get<T, Response<T>>(url, config)
    }

    public static isRequestError(error: AxiosError): boolean {
        return !!(error.response && error.response.status);
    }
}