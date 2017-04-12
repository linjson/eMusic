import React, {Component} from 'react';
import {
    Subheader, List, ListItem,
    Divider, IconButton, IconMenu,
    MenuItem, Menu, TextField
} from 'material-ui';
import {connect} from 'react-redux';

const action = require('./action/a_music');

class GroupName extends Component {

    static propTypes = {
        label: React.PropTypes.string,
        iconClick: React.PropTypes.func,
    }

    render() {

        let icon = this.props.iconClassName;

        return (
            <div style={styles.subheader}>
                <div style={styles.subheader_label}>{this.props.label}</div>
                <IconButton iconClassName={icon} onTouchTap={this.props.iconClick}/>
            </div>
        );
    }
}

class ListMenu extends Component {

    static propTypes = {
        importMulti: React.PropTypes.func,
        importSingle: React.PropTypes.func,
        rename: React.PropTypes.func,
        moveUp: React.PropTypes.func,
        moveDown: React.PropTypes.func,
        delMusic: React.PropTypes.func,
        data: React.PropTypes.object,
    }

    menuClick = (e, child) => {
        const value = child.props.value;
        if (!this.props.data) {
            return;
        }
        let {id}=this.props.data;
        if (value == 1) {
            this.props.importMulti && this.props.importMulti(id);
        } else if (value == 2) {
            this.props.importSingle && this.props.importSingle(id);
        } else if (value == 3) {
            this.props.rename && this.props.rename(id);
        } else if (value == 4) {
            this.props.moveUp && this.props.moveUp(id);
        } else if (value == 5) {
            this.props.moveDown && this.props.moveDown(id);
        } else if (value == 6) {
            this.props.delMusic && this.props.delMusic(id);
        }
    }


    render() {
        const iconButtonElement = (
            <IconButton
                iconClassName={"icon_chevron_right"}
            />
        )

        return (<IconMenu iconButtonElement={iconButtonElement}
                          listStyle={{paddingTop: 0, paddingBottom: 0}}
                          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                          desktop={true}
                          onItemTouchTap={this.menuClick}
            >
                <MenuItem value="1">批量导入</MenuItem>
                <MenuItem value="2">单个导入</MenuItem>
                <MenuItem value="3">重命名</MenuItem>
                <MenuItem value="4">上移</MenuItem>
                <MenuItem value="5">下移</MenuItem>
                <MenuItem value="6">删除</MenuItem>
            </IconMenu>
        )
    }
}

class MusicItem extends Component {
    static propTypes = {
        text: React.PropTypes.string,
        data: React.PropTypes.object,
        renameMusic: React.PropTypes.func,
    }

    state = {
        edit: false
    }

    showInput = () => {
        this.setState({edit: true});
    }

    hideInput = () => {
        this.setState({edit: false});
    }

    inputKeyDown = (e) => {
        let {keyCode}=e;

        if (keyCode == 13) {
            let {data}=this.props;
            this.props.renameMusic && this.props.renameMusic(data.id, e.target.value)
            this.hideInput();
        } else if (keyCode == 27) {
            this.hideInput();
        }


    }

    render() {
        let {edit}=this.state;
        let {data}=this.props;
        let v = null;
        if (edit) {
            v = <TextField inputStyle={styles.editInput}
                           name={"name" + data.id}
                           defaultValue={data.name}
                           underlineShow={false}
                           rowsMax={1}
                           autoFocus={true}
                           onKeyDown={this.inputKeyDown}
                           onBlur={this.hideInput}/>
        } else {
            const el = <div><ListMenu data={data} delMusic={this.props.delMusic} rename={this.showInput}/>
            </div>;
            v = <ListItem primaryText={this.props.text} rightIconButton={el}/>;
        }


        return <div>
            {v}
            <Divider />
        </div>
    }
}


class MusicList extends Component {

    static propTypes = {
        addMusic: React.PropTypes.func,
        delMusic: React.PropTypes.func,
        musicList: React.PropTypes.object,
    }

    addMusic = () => {
        this.props.addMusic();
    }

    delMusic = (id) => {
        this.props.delMusic(id);
    }

    renameMusic = (id, name) => {
        this.props.renameMusic(id, name);
    }

    renderItems() {
        let {musicList}=this.props;
        console.log("==>", musicList)
        if (!musicList) {
            return null;
        }

        return musicList.list.map(n => {
            return <MusicItem key={n.id}
                              text={n.name}
                              data={n}
                              delMusic={this.delMusic}
                              renameMusic={this.renameMusic}/>
        });


    }

    render() {
        return (
            <List>
                <Subheader><GroupName label="全部" iconClassName={"icon_add"} iconClick={this.addMusic}/></Subheader>
                {this.renderItems()}
            </List>
        );
    }
}

const styles = {
    subheader: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
    },

    subheader_label: {
        flex: 1,
    },
    editInput: {
        color: '#33aeff',
        paddingLeft: 15,
        paddingRight: 15,
    }
}


function mapStateToProps(state) {
    return {
        musicList: state.musicList,
    }
}

function mapActionToProps(dispatch) {
    return {
        addMusic: () => {
            dispatch(action.addMusic())
        },
        delMusic: (id) => {
            dispatch(action.delMusic(id))
        },
        renameMusic: (id, name) => {
            dispatch(action.renameMusic(id, name))
        }
    }
}


module.exports = connect(mapStateToProps, mapActionToProps)(MusicList);