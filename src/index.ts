import './style.scss';
import { renderPage, updateStateGarage } from './components/car/car';
import { addListeners } from './components/car/car';
// import store from './components/store/store';
// import { getWinners } from './components/api/api';

renderPage();
await updateStateGarage();
addListeners();
