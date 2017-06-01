import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';
import AppBar from "./top";
import MusicList from "./musiclist";
import TrackList from "./tracklist";
import TrackPlay from "./trackplay";

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
                <div className="homeBottom"><TrackPlay /></div>
            </div>
        </MuiThemeProvider>
    }
}
module.exports = App;