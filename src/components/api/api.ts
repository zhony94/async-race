import { Car, Winner } from '../model/Types';

const base = 'http://localhost:3000';
const garage = `${base}/garage`;
const engine = `${base}/engine`;
const winners = `${base}/winners`;

export const getCars = async (page: number, limit = 7) => {
    const response = await fetch(`${garage}?_page=${page}&_limit=${limit}`);
    return {
        items: await response.json(),
        count: +(response.headers.get('X-Total-Count') as string),
    };
};

export const getCar = async (id: number) => {
    return (await fetch(`${garage}/${id}`)).json();
};

export const createCar = async (body: Car) => {
    return (
        await fetch(garage, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();
};

export const deleteCar = async (id: number) => {
    return (await fetch(`${garage}/${id}`, { method: 'DELETE' })).json();
};

export const updateCar = async (id: number, body: Car) => {
    return (
        await fetch(`${garage}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();
};

export const startEngine = async (id: number) => {
    const result = (
        await fetch(`${engine}?id=${id}&status=started`, {
            method: 'PATCH',
        })
    ).json();
    return result;
};

export const stopEngine = async (id: number) => {
    return (
        await fetch(`${engine}?id=${id}&status=stopped`, {
            method: 'PATCH',
        })
    ).json();
};

export const drive = async (id: number) => {
    const response = await fetch(`${engine}?id=${id}&status=drive`, {
        method: 'PATCH',
    }).catch();
    return response.status !== 200 ? { success: false } : { ...(await response.json()) };
};

export const getWinner = async (id: number) => {
    return (await fetch(`${winners}/${id}`)).json();
};

export const getSortOrder = (sort?: 'wins' | 'time', order?: 'ASC' | 'DESC') => {
    return sort && order ? `&_sort=${sort}&_order=${order}` : '';
};

export const getWinners = async (page: number, limit = 10, sort?: 'wins' | 'time', order?: 'ASC' | 'DESC') => {
    const response = await fetch(`${winners}?_page=${page}&_limit=${limit}${getSortOrder(sort, order)}`);
    const items = await response.json();
    return {
        items: await Promise.all(
            items.map(async (winner: Winner) => ({ ...winner, car: await getCar(winner.id as number) }))
        ),
        count: +(response.headers.get('X-Total-Count') as string),
    };
};

export const getWinnerStatus = async (id: number) => {
    return (await fetch(`${winners}/${id}`)).status;
};

export const deleteWinner = async (id: number) => {
    return (await fetch(`${winners}/${id}`, { method: 'DELETE' })).json();
};

export const createWinner = async (body: Winner) => {
    return (
        await fetch(winners, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();
};

export const updateWinner = async (id: number, body: Winner) => {
    return (
        await fetch(`${winners}/${id}`, {
            method: 'PUT',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        })
    ).json();
};

export const saveWinner = async (id: number, time: number) => {
    const winnerStatus = await getWinnerStatus(id);

    if (winnerStatus === 404) {
        await createWinner({
            id,
            wins: 1,
            time,
        });
    } else {
        const winner = await getWinner(id);
        await updateWinner(id, {
            id,
            wins: winner.wins + 1,
            time: time < winner.time ? time : winner.time,
        });
    }
};
