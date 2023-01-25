// import { Car } from '../model/Types';
import { AnimationState, Car, E, Race, Winner } from '../model/Types';
import CarBrands from './CarBrands.json';

import store from '../store/store';

export const getPositionAtCenter = (element) => {
    const { top, left, width, height } = element.getBoundingClientRect();
    return {
        x: left + width / 2,
        y: top + height / 2,
    };
};

export const getDistanceBetwenElemet = (a, b) => {
    const aPosition = getPositionAtCenter(a);
    const bPosition = getPositionAtCenter(b);
    return Math.hypot(aPosition.x - bPosition.x, aPosition.y - bPosition.y);
};

export const getRandomName = () => {
    const model = CarBrands.models[Math.floor(Math.random() * CarBrands.models.length)];
    const name = CarBrands.names[Math.floor(Math.random() * CarBrands.names.length)];
    return `${model} ${name}`;
};

export const animation = (car: E, distance: number, animationTime: number) => {
    let start: number;
    const state = {} as AnimationState;

    function step(timestamp: number) {
        if (!start) {
            start = timestamp;
        }
        const time = timestamp - start;
        const passed = Math.round(time * (distance / animationTime));
        car.style.transform = `translateX(${Math.min(passed, distance)}px)`;

        if (passed < distance) {
            state.id = window.requestAnimationFrame(step);
        }
    }
    state.id = window.requestAnimationFrame(step);
    return state;
};

export const race = async (action: (id: number) => Promise<Race>) => {
    const promises = store.cars.map(({ id }: Car) => action(id as number));
    console.log(promises);
    const winner = await raceAll(
        promises,
        store.cars.map((car: Car) => car.id as number)
    );
    return winner;
};

const raceAll = async (promises, ids: number[]) => {
    const { success, id, time } = await Promise.race(promises);

    if (!success) {
        const failedIndex = ids.findIndex((i: number) => i === id);
        const restPromises = [...promises.slice(0, failedIndex), ...promises.slice(failedIndex + 1, promises.length)];
        const restIds = [...ids.slice(0, failedIndex), ...ids.slice(failedIndex + 1, ids.length)];
        return raceAll(restPromises, restIds);
    }
    return { car: store.cars.find((car) => car.id === id), time: +(time / 1000).toFixed(2) } as Winner;
};

export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

export const generateRandomCars = (count = 100) => {
    return new Array(count).fill(1).map(() => ({ name: getRandomName(), color: getRandomColor() }));
};
