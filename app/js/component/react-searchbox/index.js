import React from 'react';
import Ripple from 'react-material-ripple'
require('./searchbox.scss');
class SearchBox extends React.Component {


    static propTypes = {
        onSearch: React.PropTypes.func,
    }


    constructor() {
        super();
        this.state = {
            open: false,
            hidenRipple: false,
        }
    }

    _openSearch = () => {
        this.refs["searchInput"].focus();
        this.setState({open: true});
    }

    _closeSearch = () => {
        this.refs["searchInput"].value = "";
        this.setState({open: false, hidenRipple: false});
    }

    _renderRipple() {
        return <Ripple style={{width: '100%', height: '100%', position: 'absolute', borderRadius: '100%'}}></Ripple>;
    }

    componentDidMount() {
        this.refs.searchbtn.addEventListener("webkitAnimationEnd", () => {
            this.setState({hidenRipple: true})
        })
    }

    _onKeyDown = (e) => {

        let {keyCode} = e;
        if (keyCode == 13 && this.props.onSearch) {
            this.props.onSearch(e.target.value);
        }

    }


    render() {

        let {open, hidenRipple} = this.state;
        let boxStyle = "box";
        if (open) {
            boxStyle = "box_open";
        }


        return <div className={boxStyle}>
            <input ref="searchInput" placeholder="搜索" className="searchInput" onKeyDown={this._onKeyDown}/>
            <span className="closebtn" onClick={this._closeSearch}>
                {this._renderRipple()}
                </span>
            <span ref="searchbtn" className="searchbtn" onClick={this._openSearch}>
                     {!hidenRipple && this._renderRipple()}
                </span>
        </div>
    }
}


module.exports = SearchBox;