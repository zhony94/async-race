import {
    createCar,
    deleteCar,
    deleteWinner,
    drive,
    getCar,
    getCars,
    getWinners,
    updateCar,
    saveWinner,
    startEngine,
    stopEngine,
} from '../api/api';

import { Car, E, Winner } from '../model/Types';
import store from '../store/store';
import { generateRandomCars, getDistanceBetwenElemet, animation, race } from '../utilities/Utils';

export const renderCarImg = (color: string) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="60" height="60" viewBox="0 0 256 256" xml:space="preserve">

  <defs>
  </defs>
  <g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: ${color}; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" >
    <circle cx="70.735" cy="56.775" r="1.955" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: ${color}; fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
    <circle cx="19.765" cy="56.775" r="1.955" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: ${color}; fill-rule: nonzero; opacity: 1;" transform="  matrix(1 0 0 1 0 0) "/>
    <path d="M 75.479 36.045 l -7.987 -1.22 l -2.35 -2.574 c -5.599 -6.132 -13.571 -9.649 -21.874 -9.649 h -6.245 c -1.357 0 -2.696 0.107 -4.016 0.296 c -0.022 0.004 -0.044 0.006 -0.066 0.01 c -7.799 1.133 -14.802 5.468 -19.285 12.106 C 5.706 37.913 0 45.358 0 52.952 c 0 3.254 2.647 5.9 5.9 5.9 h 3.451 c 0.969 4.866 5.269 8.545 10.416 8.545 s 9.447 -3.679 10.416 -8.545 h 30.139 c 0.969 4.866 5.27 8.545 10.416 8.545 s 9.446 -3.679 10.415 -8.545 H 84.1 c 3.254 0 5.9 -2.646 5.9 -5.9 C 90 44.441 83.894 37.331 75.479 36.045 z M 43.269 26.602 c 7.065 0 13.848 2.949 18.676 8.094 H 39.464 l -3.267 -8.068 c 0.275 -0.009 0.55 -0.026 0.826 -0.026 H 43.269 z M 32.08 27.118 l 3.068 7.578 H 18.972 C 22.429 30.813 27.018 28.169 32.08 27.118 z M 19.767 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 s 6.623 2.971 6.623 6.623 C 26.39 60.427 23.419 63.397 19.767 63.397 z M 70.738 63.397 c -3.652 0 -6.623 -2.971 -6.623 -6.622 c 0 -3.652 2.971 -6.623 6.623 -6.623 c 3.651 0 6.622 2.971 6.622 6.623 C 77.36 60.427 74.39 63.397 70.738 63.397 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: ${color}; fill-rule: nonzero; opacity: 1;" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" />
  </g>
  </svg>`;
};

export const renderCar = (car: Car) => {
    return `
  <div class="control">
      <div class="car-item__header">
          <button class="car-item__select" id="select-car-${car.id}">Select</button>
          <button class="car-item__remove" id="remove-car-${car.id}">Remove</button>
          <div class="car-item__name">${car.name}</div>
      </div>
      <div class="car-item__engine-commands">
          <button class="car-item__start-engine" id="start-engine-car-${car.id}" ${
        car.isEngineStarted ? 'disabled' : ''
    }>Start</button>
          <button class="car-item__stop-engine" id="stop-engine-car-${car.id}" ${
        !car.isEngineStarted ? 'disabled' : ''
    }>Stop</button>
      </div>
  </div>
  <div class="car-flag">
      <div class="car" id="car-${car.id}">
          ${renderCarImg(car.color)}
      </div>
      <div class="flag" id="flag-${car.id}">🏴</div>
  </div>`;
};

export const renderCars = () => {
    return `<div class="garage-title">Garage (${store.carsCount})</div>
  <div class="garage-page-number">Page #${store.carsPage}</div>
  <ul class="car-list">
    ${store.cars
        .map(
            (car: Car) => `
      <li class="car-list__item">${renderCar(car)}</li>
      `
        )
        .join('')}
  `;
};

const sorter = { byWins: 'wins', byTime: 'time' };

export const renderWinners = () => {
    return `<h1>Winners (${store.winnersCount})</h1>
  <h2>Page #${store.winnersPage}</h2>
  <table class="table">
      <thead>
          <th>Number</th>
          <th>Car</th>
          <th>Name</th>
          <th class="table-button table-wins ${
              store.sortBy === sorter.byWins ? store.sortOrder : ''
          }" id="sort-by-wins">Wins</th>
          <th class="table-button table-time ${
              store.sortBy === sorter.byTime ? store.sortOrder : ''
          }" id="sort-by-time">Best time (seconds)</th>
      </thead>
      <tbody>
        ${store.winners
            .map((winner: Winner, index: number) => {
                return `
                <tr>
                    <td>${index + 1}</td>
                    <td>${renderCarImg((winner.car as Car).color)}</td>
                    <td>${(winner.car as Car).name}</td>
                    <td>${winner.wins}</td>
                    <td>${winner.time}</td>
                </tr>
            `;
            })
            .join('')}
      </tbody>
  </table>`;
};

export const renderBody = () => {
    const html = `
    <div class="main">
      <div class="menu">
          <button class="button garage-menu-button primary" id="garage-menu">To garage</button>
          <button class="button winners-menu-button primary" id="winners-menu">To winners</button>
      </div>
      <div id="garage-view">
          <div>
            <form class="form create-car" id="create">
                  <input class="input" id="create-name" name="name" type="text">
                  <input class="color" id="create-color" name="color" type="color">
                  <button class="button" type="submit">Create</button>
             </form>
            <form class="form update-car" id="update">
                  <input class="input" id="update-name" name="name" type="text" disabled>
                  <input class="color" id="update-color" name="color" type="color" value="#ffffff" disabled>
                  <button class="button" id="update-submit" type="submit">Update</button>
            </form>
          </div>
          <div class="race-controls">
              <button class="button race-button primary" id="race">Race</button>
              <button class="button reset-button primary" id="reset" disabled>Reset</button>
              <button class="button generator-button" id="generator">Generate cars</button>
          </div>
          <div id="garage">
              ${renderCars()}
          </div>
          <div>
              <p class="message" id="message"></p>
          </div>
      </div>
      <div id="winners-view" style="display: none">
          ${renderWinners()}
      </div>
      <div class-"pagination">
          <button class="button primary prev-button" disabled id="prev">Prev</button>
          <button class="button primary next-button" disabled id="next">Next</button>
      </div>
    </div>`;
    return html;
};

export const renderPage = () => {
    const elem = document.createElement('div');
    elem.innerHTML = renderBody();
    document.body.append(elem);
};

export const updateStateGarage = async () => {
    const { items, count } = await getCars(store.carsPage);
    const pageLimit = 7;
    store.cars = items;
    store.carsCount = count;

    if (store.carsPage * pageLimit < store.carsCount) {
        (document.querySelector('#next') as HTMLButtonElement).disabled = false;
    } else {
        (document.querySelector('#next') as HTMLButtonElement).disabled = true;
    }

    if (store.carsPage > 1) {
        (document.querySelector('#prev') as HTMLButtonElement).disabled == false;
    } else {
        (document.querySelector('#prev') as HTMLButtonElement).disabled = true;
    }
};

export const updateStateWinner = async () => {
    const { items, count } = await getWinners(store.winnersPage, 10, store.sortBy, store.sortOrder);
    const pageLimit = 10;
    store.winners = items;
    store.winnersCount = count;

    if (store.winnersPage * pageLimit < store.winnersCount) {
        (document.querySelector('#next') as HTMLButtonElement).disabled = false;
    } else {
        (document.querySelector('#next') as HTMLButtonElement).disabled = true;
    }

    if (store.winnersPage > 1) {
        (document.querySelector('#prev') as HTMLButtonElement).disabled == false;
    } else {
        (document.querySelector('#prev') as HTMLButtonElement).disabled = true;
    }
};

const startDriving = async (id: number) => {
    const startBtn = document.querySelector(`#start-engine-car-${id}`) as HTMLButtonElement;
    startBtn.disabled = true;
    startBtn.classList.toggle('enabling', true);

    const { velocity, distance } = await startEngine(id);
    const time = Math.round(+distance / +velocity);

    startBtn.classList.toggle('enabling', false);
    (document.querySelector(`#stop-engine-car-${id}`) as HTMLButtonElement).disabled = false;

    const car = document.querySelector(`#car-${id}`) as E;
    const flag = document.querySelector(`#flag-${id}`) as E;
    const htmlDistance = Math.floor(getDistanceBetwenElemet(car, flag)) + 75;

    store.animation[id] = animation(car, htmlDistance, time);
    const { success } = await drive(id);

    if (!success) {
        window.cancelAnimationFrame(store.animation[id].id);
    }
    return { success, id, time };
};

const stopDriving = async (id: number) => {
    const stopBtn = document.querySelector(`#stop-engine-car-${id}`) as HTMLButtonElement;
    stopBtn.disabled = true;
    stopBtn.classList.toggle('enabling', true);

    await stopEngine(id);
    stopBtn.classList.toggle('enabling', false);
    (document.querySelector(`#start-engine-car-${id}`) as HTMLButtonElement).disabled = false;

    const car = document.querySelector(`#car-${id}`) as HTMLDivElement;
    car.style.transform = 'translateX(0)';

    if (store.animation[id]) {
        window.cancelAnimationFrame(store.animation[id].id);
    }
};

export const setSortOrder = async (sortBy: 'wins' | 'time') => {
    store.sortOrder = store.sortOrder === 'ASC' ? 'DESC' : 'ASC';
    store.sortBy = sortBy;

    await updateStateWinner();
    (document.querySelector('#winners-view') as HTMLDivElement).innerHTML = renderWinners();
};

export const addListeners = () => {
    createCarListener();
    selectDeleteListeners();
    generateRaceListener();
    startStopEngineBtnListeners();
    resetListener();
    paginationListeners();
    menuBtnListener();
    sortListener();
};

const createCarListener = () => {
    const nameInput = document.querySelector('#create-name') as HTMLInputElement;
    const colorInput = document.querySelector('#create-color') as HTMLInputElement;
    document.body.addEventListener('submit', async (e) => {
        e.preventDefault();
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('create-car')) {
            if (nameInput.value.length !== 0) {
                await createCar({ name: nameInput.value, color: colorInput.value });
                await updateStateGarage();
                (document.querySelector('#garage') as HTMLDivElement).innerHTML = renderCars();
                nameInput.value = '';
                colorInput.value = '#000000';
            }
        }
    });
};

const selectDeleteListeners = () => {
    document.body.addEventListener('click', async (e) => {
        const nameInput = document.querySelector('#update-name') as HTMLInputElement;
        const colorInput = document.querySelector('#update-color') as HTMLInputElement;
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('car-item__select')) {
            const selectedCar = await getCar(+target.id.split('select-car-')[1]);
            nameInput.value = selectedCar.name;
            colorInput.value = selectedCar.color;
            nameInput.disabled = false;
            colorInput.disabled = false;
            (document.querySelector('#update-submit') as HTMLButtonElement).disabled = false;
            document.body.addEventListener('submit', async (elem) => {
                elem.preventDefault();
                const target = elem.target as HTMLButtonElement;
                if (target.classList.contains('update-car')) {
                    if (nameInput.value.length !== 0) {
                        await updateCar(selectedCar.id, { name: nameInput.value, color: colorInput.value });
                        await updateStateGarage();
                        (document.querySelector('#garage') as HTMLDivElement).innerHTML = renderCars();
                        nameInput.value = '';
                        colorInput.value = '#000000';
                        nameInput.disabled = true;
                        colorInput.disabled = true;
                        (document.querySelector('#update-submit') as HTMLButtonElement).disabled = true;
                    }
                }
            });
        }
        if (target.classList.contains('car-item__remove')) {
            const selectedCar = await getCar(+target.id.split('remove-car-')[1]);
            await deleteCar(selectedCar.id);
            await deleteWinner(selectedCar.id);
            await updateStateGarage();
            (document.querySelector('#garage') as HTMLDivElement).innerHTML = renderCars();
        }
    });
};

const startStopEngineBtnListeners = () => {
    document.body.addEventListener('click', async (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('car-item__start-engine')) {
            const id = +target.id.split('start-engine-car-')[1];
            startDriving(+id);
        }
        if (target.classList.contains('car-item__stop-engine')) {
            const id = +target.id.split('stop-engine-car-')[1];
            stopDriving(id);
        }
    });
};

const generateRaceListener = () => {
    document.body.addEventListener('click', async (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('generator-button')) {
            target.disabled = true;
            const cars = generateRandomCars();
            await Promise.all(cars.map(async (c: Car) => createCar(c)));
            await updateStateGarage();
            (document.querySelector('#garage') as HTMLDivElement).innerHTML = renderCars();
            target.disabled = false;
        }
        if (target.classList.contains('race-button')) {
            target.disabled = true;
            const winner: { car: Car; time: number } = await race(startDriving);
            await saveWinner(winner.car.id as number, winner.time); //
            const message = document.querySelector('#message') as HTMLDivElement;
            (document.querySelector('#reset') as HTMLButtonElement).disabled = false;
            message.innerHTML = `${winner.car.name} went first (${winner.time})s`;
            message.classList.toggle('visible', true);
        }
    });
};

const resetListener = () => {
    document.body.addEventListener('click', async (e) => {
        const target = e.target as HTMLButtonElement;

        if (target.classList.contains('reset-button')) {
            store.cars.map(({ id }: Car) => stopDriving(id as number));
            (document.querySelector('#message') as HTMLDivElement).classList.toggle('visible', false);
            (document.querySelector('#race') as HTMLButtonElement).disabled = false;
            (document.querySelector('#reset') as HTMLButtonElement).disabled = true;
        }
    });
};

const paginationListeners = () => {
    document.body.addEventListener('click', async (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('prev-button')) {
            switch (store.view) {
                case 'garage': {
                    store.carsPage--;
                    await updateStateGarage();
                    (document.querySelector('#garage') as HTMLDivElement).innerHTML = renderCars();
                    if (store.carsPage - 1 !== 0) {
                        (document.querySelector('.prev-button') as HTMLButtonElement).disabled = false;
                    } else {
                        (document.querySelector('.prev-button') as HTMLButtonElement).disabled = true;
                    }
                    break;
                }
                case 'winners': {
                    store.winnersPage--;
                    await updateStateGarage();
                    (document.querySelector('#winners-view') as HTMLDivElement).innerHTML = renderWinners();
                    break;
                }
            }
        }
        if (target.classList.contains('next-button')) {
            switch (store.view) {
                case 'garage': {
                    store.carsPage++;
                    await updateStateGarage();
                    (document.querySelector('#garage') as HTMLDivElement).innerHTML = renderCars();
                    if (store.carsPage - 1 !== 0) {
                        (document.querySelector('.prev-button') as HTMLButtonElement).disabled = false;
                    } else {
                        (document.querySelector('.prev-button') as HTMLButtonElement).disabled = true;
                    }
                    break;
                }
                case 'winners': {
                    store.winnersPage++;
                    await updateStateGarage();
                    (document.querySelector('#winners-view') as HTMLDivElement).innerHTML = renderWinners();
                    break;
                }
            }
        }
    });
};

const menuBtnListener = () => {
    document.body.addEventListener('click', async (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('garage-menu-button')) {
            (document.querySelector('#garage-view') as HTMLDivElement).style.display = 'block';
            (document.querySelector('#winners-view') as HTMLDivElement).style.display = 'none';
        }
        if (target.classList.contains('winners-menu-button')) {
            (document.querySelector('#winners-view') as HTMLDivElement).style.display = 'block';
            (document.querySelector('#garage-view') as HTMLDivElement).style.display = 'none';
            await updateStateWinner();
            (document.querySelector('#winners-view') as HTMLDivElement).innerHTML = renderWinners();
        }
    });
};

const sortListener = () => {
    document.body.addEventListener('click', async (e) => {
        const target = e.target as HTMLButtonElement;
        if (target.classList.contains('table-wins')) {
            setSortOrder('wins');
        }
        if (target.classList.contains('table-time')) {
            setSortOrder('time');
        }
    });
};
