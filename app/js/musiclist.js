import React, {Component} from 'react';
import {Subheader, List, ListItem, Divider, IconButton, IconMenu, MenuItem, Menu} from 'material-ui';
// import {DataEvent} from '../ipc/DataBaseIPCConfig';
// const ipc = require('electron').ipcRenderer
//
// ipc.on(DataEvent.renameMusic, (e,r) => {
//     console.log("==>from node", r);
// })
//
//
// ipc.send(DataEvent.renameMusic, {name: 'test3',id:8});


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
    }

    menuClick = (e, child) => {
        const value = child.props.value;

        if (value == 1) {
            this.props.importMulti && this.props.importMulti();
        } else if (value == 2) {
            this.props.importSingle && this.props.importSingle();
        } else if (value == 3) {
            this.props.rename && this.props.rename();
        } else if (value == 4) {
            this.props.moveUp && this.props.moveUp();
        } else if (value == 5) {
            this.props.moveDown && this.props.moveDown();
        }
    }


    render() {
        const iconButtonElement = (
            <IconButton
                iconClassName={"icon_chevron_right"}
            />
        )

        const listid = this.props.listid;

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
            </IconMenu>
        )
    }
}

class MusicItem extends Component {
    static propTypes = {
        text: React.PropTypes.string,
    }

    render() {
        const el = <div><ListMenu/></div>;
        return <div>
            <ListItem primaryText={this.props.text} rightIconButton={el}/>
            <Divider />
        </div>
    }
}


class MusicList extends Component {


    addMusic = () => {
        console.log("==>xx")
    }

    render() {


        return (
            <List>
                <Subheader><GroupName label="全部" iconClassName={"icon_add"} iconClick={this.addMusic}/></Subheader>
                <MusicItem text={"test"}/>
                <MusicItem text={"test"}/>
                <MusicItem text={"test"}/>
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
    }
}

module.exports = MusicList;