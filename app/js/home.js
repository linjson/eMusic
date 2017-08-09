import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from "./top";
import MusicList from "./musiclist";
import TrackList from "./tracklist";
import TrackPlay from "./trackplay";

import {Link} from 'react-router-dom'
const muiTheme = getMuiTheme()


class App extends Component {
    render() {
        return <MuiThemeProvider muiTheme={muiTheme}>
            <div className="applicationBoby">
                <div className="homeTop"><AppBar /></div>
                <div className="homeMiddle">
                    <div className="homeLeft"><MusicList /></div>
                    <div className="homeRight"><TrackList /></div>
                </div>
                <div className="homeBottom"><TrackPlay /></div>
            </div>
        </MuiThemeProvider>
    }
}
module.exports = App;