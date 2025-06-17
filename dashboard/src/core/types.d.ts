export interface IApiPaginationResponse <T>{
    total_page: number, current_page: number, data:T
}

export interface IApiPayload {
    page: number;
    limit?: number;
}
