import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

const AppBar = require('./top');


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
                    <div className="homeLeft">33<br/>332</div>
                    <div className="homeRight">33</div>
                </div>
                <div className="homeBottom"></div>
            </div>
        </MuiThemeProvider>
    }
}
module.exports = App;