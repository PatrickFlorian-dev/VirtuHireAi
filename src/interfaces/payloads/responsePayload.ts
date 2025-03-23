export interface IResponsePayload<T = unknown> {
    statusCode: number;
    success: boolean;
    message: string;
    data?: T;
}