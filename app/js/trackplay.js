import React, {Component} from 'react';
import {
    IconButton, Slider
} from 'material-ui';
import {connect} from 'react-redux';
import {formatDate} from "./utils";
import action from "./action/a_music";


class TrackPlay extends Component {

    static propTypes = {
        trackSelect: React.PropTypes.object,
        selectTrack: React.PropTypes.func,
        volume: React.PropTypes.number,
    }

    state = {
        play: true,
        durationTime: "00:00",
        durationLength: 0,
        silent: false,
    }
    sliderValue = 0;

    constructor(props) {
        super(props);
    }

    _startMusic = () => {
        if (!this.props.trackSelect) {
            return;
        }

        let audio = this._getAudio();

        if (!audio) {
            return;
        }

        let {play} = this.state;


        if (play) {
            audio.pause();
        } else {
            audio.play();
        }

        this.setState({play: !play});
    }

    _previousMusic = () => {
        this._play("pre");


    }

    _nextMusic = () => {
        this._play("next");

    }

    _hasList() {
        return this.props.trackSelect && this.props.trackSelect.tracklist;
    }

    _getAudio() {
        return this.refs.audio;
    }

    _onPlaying = () => {
        let audio = this._getAudio();

        this.setState({durationTime: formatDate(audio.currentTime), durationLength: Number.parseInt(audio.currentTime)})
    }

    _onSliderChange = (e, newValue) => {
        let audio = this._getAudio();
        if (!audio) {
            return;
        }

        this.sliderValue = newValue;

    }

    _onSliderDragStop = () => {
        let audio = this._getAudio();
        if (!audio) {
            return;
        }

        audio.currentTime = this.sliderValue;
    }

    _onVolumeChange = (e, val) => {
        let audio = this._getAudio();
        if (!audio) {
            return;
        }
        audio.volume = val;
    }

    _onVolumeSilent = () => {
        let audio = this._getAudio();
        if (!audio) {
            return;
        }
        let {silent} = this.state;

        if (silent) {
            audio.muted = false;
        } else {
            audio.muted = true;
        }

        this.setState({silent: !silent});

    }

    _audioEnd = () => {
        this._play("next");
    }

    _play = (flag: String) => {

        if (!this.props.trackSelect) {
            return;
        }
        const {tracklist, currentIndex, mid} = this.props.trackSelect;
        if (flag === "next") {
            let next = currentIndex + 1;
            next = Math.min(next, tracklist.length - 1);
            this.props.selectTrack(tracklist, next, mid);
        } else if (flag === "pre") {
            let pre = currentIndex - 1;
            pre = Math.max(pre, 0);
            this.props.selectTrack(tracklist, pre, mid);
        }
    }


    render() {
        let audio = null;
        let totalTime;
        let totalLength = 1;
        let name = "";
        let playicon = "icon_play";
        if (this._hasList()) {
            const {tracklist, currentIndex} = this.props.trackSelect;
            let audioUrl = tracklist[currentIndex].path;
            totalLength = tracklist[currentIndex].length;
            name = tracklist[currentIndex].name;
            totalTime = formatDate(totalLength);
            audio = <audio ref={"audio"} src={audioUrl} autoPlay onTimeUpdate={this._onPlaying}
                           onEnded={this._audioEnd}
            />;
            playicon = this.state.play ? "icon_pause" : "icon_play";
        }


        let soundicon = this.state.silent ? "icon_volume_off" : "icon_volume_on";
        return (
            <div style={styles.controller}>

                <IconButton style={styles.iconButton} iconClassName={"icon_previous"} onTouchTap={this._previousMusic}/>
                <IconButton style={styles.iconButton} iconClassName={playicon} onTouchTap={this._startMusic}/>
                <IconButton style={styles.iconButton} iconClassName={"icon_next"} onTouchTap={this._nextMusic}/>
                <div style={styles.message}>
                    <div style={styles.title}>{name}</div>
                    <div style={{flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Slider style={{flex: 1, marginRight: 15,}} sliderStyle={{margin: 0}}
                                min={0}
                                max={totalLength}
                                value={this.state.durationLength}
                                onChange={this._onSliderChange}
                                disableFocusRipple={true}
                                onDragStop={this._onSliderDragStop}></Slider>
                        <div>{this.state.durationTime}/{totalTime || "00:00"}</div>
                    </div>
                    {audio}
                </div>
                <IconButton style={styles.iconButton} iconClassName={soundicon}
                            onTouchTap={this._onVolumeSilent}/>
                <Slider style={{width: 100, ...styles.iconButton}} sliderStyle={{margin: 0}} min={0} max={1} step={0.01}
                        onChange={this._onVolumeChange}
                        disableFocusRipple={true} defaultValue={this.props.volume}
                ></Slider>
            </div>
        );
    }
}

TrackPlay.defaultProps = {
    volume: 0.8,
}


const styles = {
    controller: {
        display: 'flex',
        flex: 1,
        // alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 10,
    },
    message: {
        marginLeft: 10,
        flex: 1,
        flexDirection: 'column',
        display: 'flex',
    },

    iconButton: {
        alignSelf: 'center',
    },
    title: {
        position: 'absolute',
        padding: 5,
        fontSize: 13
    },
}


function mapStateToProps(state) {
    return {
        trackSelect: state.trackSelect,
    }
}

function mapActionToProps(dispatch) {
    return {
        selectTrack: (list, index, mid) => {
            dispatch(action.selectTrack(list, index, mid))
        }
    }
}


module.exports = connect(mapStateToProps, mapActionToProps)(TrackPlay);