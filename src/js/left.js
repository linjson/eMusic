/**
 * Created by ljs on 15/10/30.
 */

let {
    AppBar,
    FontIcon,
    IconMenu,
    IconButton,
    SvgIcon,

    }=Mui;
let SelectList = require('./select-list/select-list');
let Menu = require('material-ui/lib/menus/menu');
let MenuItem = require('material-ui/lib/menus/menu-item');
let MenuDivider = require('material-ui/lib/menus/menu-divider');


const ThemeManager = require('material-ui/lib/styles/theme-manager');
const theme = require('./theme');

let LeftContent = React.createClass({
    //the key passed through context must be called "muiTheme"
    childContextTypes: {
        muiTheme: React.PropTypes.object,
    },

    getChildContext() {
        return {
            muiTheme: ThemeManager.getMuiTheme(theme),
        };
    },

    renderTitle(){
        let style = {
            fontSize: 15,
            color: 'white',
            lineHeight: theme.spacing.desktopKeylineIncrement + "px"
        }

        return <div style={style}>我的音乐</div>
    },

    onMenuItemClick(e, item){
        console.log("a", item);
    },

    renderMenu(){

        return <IconMenu desktop={true} openDirection={"bottom-right"}
                         onItemTouchTap={this.onMenuItemClick}
                         listStyle={defaultStyle.defaultPadding}
                         iconButtonElement={
                          <IconButton iconClassName="icon-menu-white"/>
                         }>
            <MenuItem primaryText="新建列表" key={"newList"}
                      leftIcon={<FontIcon className="icon-add-black icon-style"/>}/>
        </IconMenu>;
    },

    render(){


        let itemlist = ["Starred", "Inbox"];

        return <div>
            <AppBar title={this.renderTitle()} showMenuIconButton={false}
                    iconElementRight={this.renderMenu()}
                />

            <div className="left-list">
                <SelectList dataSet={itemlist}/>
            </div>
        </div>;

    }
})


module.exports = LeftContent;
