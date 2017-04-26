import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

const AppBar = require('./top');
const MusicList = require('./musiclist');
const TrackList = require('./tracklist');

class App extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        injectTapEventPlugin();
    }

    render() {
        return <MuiThemeProvider >
            <div className="applicationBoby">
                <div className="homeTop"><AppBar /></div>
                <div className="homeMiddle">
                    <div className="homeLeft"><MusicList /></div>
                    <div className="homeRight"><TrackList /></div>
                </div>
                <div className="homeBottom"></div>
            </div>
        </MuiThemeProvider>
    }
}
module.exports = App;