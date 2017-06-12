/**
 * Created by ljs on 2017/3/17.
 */

require('../css/index.scss');


import {createStore, applyMiddleware, compose} from 'redux'
import {persistStore, autoRehydrate} from 'redux-persist'
import thunk from 'redux-thunk'


const React = require('react');
const ReactDOM = require('react-dom');

const AppReduce = require('./reducer')
const Home = require('./home');
import {Provider, connect} from 'react-redux';

function configStore(initState) {
    let store = createStore(AppReduce,
        initState,
        compose(applyMiddleware(thunk),
        )
    );
    persistStore(store)

    return store;

}
const ipc = require('electron').ipcRenderer
import {DataEvent} from '../ipc/DataBaseIPCConfig';
let list = ipc.sendSync(DataEvent.listMusic, {})
var store = configStore({
        musicList: {
            loading: false, list
        },
        trackList: {
            loading: false, list: null, trackId: -1,
        },
        selectMusicId: 0,
        trackSelect: null,

    }
    )
;

ReactDOM.render(<Provider store={store}>
        <Home /></Provider>,
    document.getElementById('application')
);