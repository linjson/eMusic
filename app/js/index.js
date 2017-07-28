/**
 * Created by ljs on 2017/3/17.
 */
import {ipcRenderer as ipc} from "electron";
import 'react-virtualized/styles.css';
import {AppEventName} from '../ipc/EventNameConfig';
import {readConfig, Conf, PlayModel, playModelAction} from './appconfig';
import {createStore, applyMiddleware, compose} from 'redux'
import {persistStore, autoRehydrate} from 'redux-persist'
import thunk from 'redux-thunk'

require('../css/index.scss');

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

let list = ipc.sendSync(AppEventName.listMusic, {})

function initState() {
    let model = readConfig(Conf.playModel, PlayModel.icon_loop);
    while (playModelAction.next().value != model);

}

initState();


var store = configStore({
    musicList: {
        loading: false, list
    },
    trackList: {
        loading: false, list: null, trackId: -1,
    },
    selectMusicId: 0,
    trackSelect: null,
    appConfig: {
        volume: readConfig(Conf.volume, 0.8),
        silent: readConfig(Conf.silent, false),
        playModel: readConfig(Conf.playModel, PlayModel.icon_list),
    }
});


ReactDOM.render(<Provider store={store}>
        <Home /></Provider>,
    document.getElementById('application')
);