/**
 * Created by ljs on 2017/3/17.
 */

require('../css/index.scss');

import React from "react";
import ReactDOM from "react-dom";
import {ipcRenderer as ipc} from "electron";
import 'react-virtualized/styles.css';
import {AppEventName} from '../ipc/EventNameConfig';
import {readConfig, Conf, PlayModel, playModelAction} from './appconfig';
import {createStore, applyMiddleware, compose} from 'redux'
import {persistStore} from 'redux-persist'
import thunk from 'redux-thunk'
import {Provider} from 'react-redux';
import createHistory from 'history/createBrowserHistory'
import {Route, Link, Switch} from 'react-router-dom'
import {ConnectedRouter, routerReducer, routerMiddleware, push} from 'react-router-redux'
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppReduce from "./reducer";
import Home from "./home";
// Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

function configStore(initState) {
    let store = createStore(
        AppReduce,
        initState,
        compose(applyMiddleware(thunk, middleware))
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

injectTapEventPlugin();


var store = configStore({
    musicList: {
        loading: false, list
    },
    trackList: {
        loading: false, list: null, trackId: -1,
    },
    selectMusicId: 0,
    trackSelect: readConfig(Conf.trackSelect, null),
    appConfig: {
        volume: readConfig(Conf.volume, 0.8),
        silent: readConfig(Conf.silent, false),
        playModel: readConfig(Conf.playModel, PlayModel.icon_list),
    },
});

// var Test = () => {
//     return <div style={{height: 100, width: 100, backgroundColor: 'red'}}>test
//         <Link style={{paddingLeft: 300,}} to={'/'}>index
//         </Link>
//     </div>
// }
// ReactDOM.render(<Provider store={store}>
//         <ConnectedRouter history={history}>
//             <div>
//                 <Switch>
//                     <Route exact path="/" component={Home}/>
//                     <Route path="/test" component={Test}/>
//                     <Route component={Home}/>
//                 </Switch>
//             </div>
//         </ConnectedRouter>
//     </Provider>,
//     document.getElementById('application')
// );

ReactDOM.render(<Provider store={store}>
        <Home/>
    </Provider>,
    document.getElementById('application')
);