import initModel from './Model';
import app from './App';
import view from './View';
import update from './Update';

const node = document.querySelector('#app');

app(initModel, update, view, node);
