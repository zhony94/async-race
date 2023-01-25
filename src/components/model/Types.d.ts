export type QueryMap = { [key: string]: string[] };
export type RequestParams = { endpoint: string; queries?: QueryMap };
export type I = HTMLInputElement;
export type E = HTMLElement;
export type State = {
    carsPage: number;
    cars: Car[];
    carsCount: number;
    winnersPage: number;
    winners: Winner[];
    winnersCount: number;
    animation: { [key: number]: AnimationState };
    view: string;
    sortBy: 'wins' | 'time';
    sortOrder: 'ASC' | 'DESC';
};

type Car = {
    name: string;
    color: string;
    id?: number;
    isEngineStarted?: boolean;
};

type Winner = {
    wins: number;
    id?: number;
    time: number;
    car?: Car;
};

type WinnerRender = {
    wins: number;
    id?: number;
    time: number;
    car: Car;
};

export type AnimationState = {
    id: number;
};

export type Race = {
    success: boolean;
    id: number;
    time: number;
};
