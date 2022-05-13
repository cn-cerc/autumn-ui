import React from 'react';
import ReactDOM from 'react-dom';
import diteng from '../src/diteng'
import FrmAccTran from './FrmAccTran';

export default {
    ...diteng,
    //ksdl
}

let app = document.getElementById('app');
if (app) {
    let el = React.createElement(FrmAccTran);
    ReactDOM.render(el, app)
}