import React, {Component} from 'react';
import {
    IconButton, Slider
} from 'material-ui';
import {connect} from 'react-redux';
import {formatDate} from "./utils";
import action from "./action/a_music";
import appAction from './action/a_appconfig';
import {Conf, playModelAction, PlayModel} from './appconfig';


class TrackPlay extends Component {

    static propTypes = {
        trackSelect: React.PropTypes.object,
        appConfig: React.PropTypes.object,
        selectTrack: React.PropTypes.func,
        saveConfig: React.PropTypes.func,
    }

    state = {
        play: true,
        durationTime: "00:00",
        durationLength: 0,
    }
    sliderValue = 0;

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
        this.props.saveConfig(Conf.volume, val);

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
        let {silent} = this.props.appConfig;

        if (silent) {
            audio.muted = false;
        } else {
            audio.muted = true;
        }
        this.props.saveConfig(Conf.silent, !silent);

    }

    _audioEnd = () => {
        this._play("next");
    }

    _play = (flag: String) => {

        if (!this.props.trackSelect) {
            return;
        }
        const {tracklist, currentIndex} = this.props.trackSelect;
        const {playModel} = this.props.appConfig;

        if (playModel == PlayModel.icon_random) {

            let m = Math.random();
            let index = Math.floor(m * tracklist.length);
            this.props.selectTrack(tracklist, index, tracklist[index].id);
            return;
        }

        if (flag === "next") {
            let next = currentIndex + 1;
            if (playModel == PlayModel.icon_loop) {
                if (next >= tracklist.length) {
                    next = 0;
                }
            } else {
                next = Math.min(next, tracklist.length - 1);
            }
            this.props.selectTrack(tracklist, next, tracklist[next].id);
        } else if (flag === "pre") {
            let pre = currentIndex - 1;
            pre = Math.max(pre, 0);
            this.props.selectTrack(tracklist, pre, tracklist[pre].id);
        }
    }

    _playModelChange = () => {
        let v = playModelAction.next();
        let model = v.value;
        this.props.saveConfig(Conf.playModel, model);

    }

    render() {
        let audio = null;
        let totalTime;
        let totalLength = 1;
        let name = "";
        let playicon = "icon_play";
        let sliderEnabled = true;
        const {appConfig} = this.props;
        if (this._hasList()) {
            sliderEnabled = false;
            const {tracklist, currentIndex} = this.props.trackSelect;

            let audioUrl = tracklist[currentIndex].path;
            totalLength = tracklist[currentIndex].length;
            name = tracklist[currentIndex].name;
            totalTime = formatDate(totalLength);
            audio = <audio ref={"audio"} src={audioUrl} autoPlay onTimeUpdate={this._onPlaying}
                           loop={appConfig.playModel == PlayModel.icon_repeat}
                           onEnded={this._audioEnd}
            />;
            playicon = this.state.play ? "icon_pause" : "icon_play";
        }


        let soundicon = this.props.appConfig.silent ? "icon_volume_off" : "icon_volume_on";
        return (
            <div style={styles.controller}>
                <IconButton iconClassName={"icon_previous"} onTouchTap={this._previousMusic}/>
                <IconButton iconClassName={playicon} onTouchTap={this._startMusic}/>
                <IconButton iconClassName={"icon_next"} onTouchTap={this._nextMusic}/>
                <div style={styles.message}>
                    <div style={styles.title}>{name}</div>
                    <div style={{flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Slider style={{flex: 1, marginRight: 15,}} sliderStyle={{margin: 0}}
                                disabled={sliderEnabled}
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
                <Slider style={{width: 100}} sliderStyle={{margin: 0}}
                        onChange={this._onVolumeChange}
                        disableFocusRipple={true} defaultValue={this.props.appConfig.volume}
                ></Slider>
                <IconButton iconClassName={appConfig.playModel} onTouchTap={this._playModelChange}/>
            </div>
        );
    }
}

TrackPlay.defaultProps = {}


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
        alignSelf: 'stretch'
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
        appConfig: state.appConfig,
    }
}

function mapActionToProps(dispatch) {
    return {
        selectTrack: (list, index, trackId) => {
            dispatch(action.selectTrack(list, index, trackId))
        },
        saveConfig: (key, value) => {
            dispatch(appAction.saveConfig(key, value));
        }
    }
}


module.exports = connect(mapStateToProps, mapActionToProps)(TrackPlay);