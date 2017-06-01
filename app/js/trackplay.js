import React, {Component} from 'react';
import {
    IconButton, Slider
} from 'material-ui';
import {connect} from 'react-redux';
import action from "./action/a_music";


class TrackPlay extends Component {

    static propTypes = {
        trackSelect: React.PropTypes.object,
    }

    constructor(props) {
        super(props);
        this.state = {
            play: false,
        }
    }

    _startMusic = () => {
        if (!this.props.trackSelect) {
            return;
        }
        let {play} = this.state;
        this.setState({play: !play});
    }

    _previousMusic = () => {
        if (!this.props.trackSelect) {
            return;
        }

    }

    _nextMusic = () => {
        if (!this.props.trackSelect) {
            return;
        }

    }

    render() {

        let playicon = this.state.play ? "icon_pause" : "icon_play";
        return (
            <div style={styles.controller}>
                <IconButton iconClassName={"icon_previous"} onTouchTap={this._previousMusic}/>
                <IconButton iconClassName={playicon} onTouchTap={this._startMusic}/>
                <IconButton iconClassName={"icon_next"} onTouchTap={this._nextMusic}/>
                <div style={styles.message}>
                    <div style={{flex: 1,}}>[]</div>
                    <div style={{flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Slider style={{flex: 1, marginRight: 10,}} sliderStyle={{margin: 0}}></Slider>
                        <div style={{}}>00:00</div>
                    </div>
                </div>
            </div>
        );
    }
}

const styles = {
    controller: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    message: {
        marginLeft: 10,
        flex: 1,
        flexDirection: 'column',
        display: 'flex',
    }
}


function mapStateToProps(state) {
    return {
        trackSelect: state.trackSelect,
    }
}

function mapActionToProps(dispatch) {
    return {}
}


module.exports = connect(mapStateToProps)(TrackPlay);