import { State } from '../model/Types';
import { getCars, getWinners } from '../api/api';

const { items: cars, count: carsCount } = await getCars(1);
const { items: winners, count: winnersCount } = await getWinners(1);

export default {
    carsPage: 1,
    cars,
    carsCount,
    winnersPage: 1,
    winners,
    winnersCount,
    animation: {},
    view: 'garage',
    sortBy: 'time',
    sortOrder: 'ASC',
} as State;
