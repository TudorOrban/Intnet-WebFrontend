export interface GridSearchDto {
    id: number;
    name: string;
    description?: string;
}

export interface CreateGridDto {
    name: string;
    description?: string;
}

export interface UpdateGridDto {
    id: number;
    name: string;
    description?: string;
}
