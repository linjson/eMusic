import React, {Component} from 'react';
import {
    IconButton, Slider
} from 'material-ui';
import {connect} from 'react-redux';
import {formatDate} from "./utils";
import action from "./action/a_music";
import keymirror from "fbjs/lib/keymirror";

const PlayModel = keymirror({
    icon_loop: null,
    icon_repeat: null,
    icon_all_loop: null,
    icon_random: null,
    icon_list: null,
});

function* playModel() {
    while (true) {
        // yield PlayModel.icon_list;
        yield PlayModel.icon_repeat;
        // yield PlayModel.icon_all_loop;
        yield PlayModel.icon_random;
        yield PlayModel.icon_loop;
    }
}

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
        playModel: PlayModel.icon_loop,
        repeat: false,
    }
    sliderValue = 0;

    constructor(props) {
        super(props);
        this.modelList = playModel();
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
        const {tracklist, currentIndex} = this.props.trackSelect;
        const {playModel} = this.state;

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
        let v = this.modelList.next();
        let model = v.value;
        let repeat = false;
        switch (model) {
            case PlayModel.icon_repeat: {
                repeat = true;
            }
        }

        this.setState({playModel: model, repeat});
    }

    render() {
        let audio = null;
        let totalTime;
        let totalLength = 1;
        let name = "";
        let playicon = "icon_play";
        let sliderEnabled = true;
        if (this._hasList()) {
            sliderEnabled = false;
            const {tracklist, currentIndex} = this.props.trackSelect;
            let audioUrl = tracklist[currentIndex].path;
            totalLength = tracklist[currentIndex].length;
            name = tracklist[currentIndex].name;
            totalTime = formatDate(totalLength);
            audio = <audio ref={"audio"} src={audioUrl} autoPlay onTimeUpdate={this._onPlaying}
                           loop={this.state.repeat}
                           onEnded={this._audioEnd}
            />;
            playicon = this.state.play ? "icon_pause" : "icon_play";
        }


        let soundicon = this.state.silent ? "icon_volume_off" : "icon_volume_on";
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
                        disableFocusRipple={true} defaultValue={this.props.volume}
                ></Slider>
                <IconButton iconClassName={this.state.playModel} onTouchTap={this._playModelChange}/>
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
    }
}

function mapActionToProps(dispatch) {
    return {
        selectTrack: (list, index, trackId) => {
            dispatch(action.selectTrack(list, index, trackId))
        }
    }
}


module.exports = connect(mapStateToProps, mapActionToProps)(TrackPlay);