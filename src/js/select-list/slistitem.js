let {
    ListItem,
    IconButton,
    IconMenu,
    TextField
    }=require('material-ui');
const Color = require('material-ui/lib/styles/colors');
const StylePropable = require('material-ui/lib/mixins/style-propable');
let MenuItem = require('material-ui/lib/menus/menu-item');


var SListItem = React.createClass({

    getInitialState(){
        return {
            primaryText: this.props.primaryText,
            editable: false
        }
    },

    handleListItemMenuItemClick(e, item){

        if (item.key == "updateName") {
            this.setState({editable: true})
        }
    },

    renderItemMenu(select){
        let cls = select ? "icon-more-white" : "icon-more-black";
        return <IconMenu desktop={true} openDirection={"bottom-left"}
                         onItemTouchTap={this.handleListItemMenuItemClick}
                         listStyle={defaultStyle.defaultPadding}
                         iconButtonElement={
                          <IconButton iconClassName={cls}/>
                         }>
            <MenuItem primaryText="修改" key={"updateName"}/>
        </IconMenu>;
    },
    changeValue() {
        let val = this.refs.tfEdit.getValue();
        this.setState({editable: false, primaryText: val});
        this.props.onChangeValue && this.props.onChangeValue(val, this.props.index);
    },
    handleTextBlur(){
        this.changeValue();
    },
    handleEditKeyDown(e){
        if (e.nativeEvent.keyCode == 13) {
            this.changeValue();
        }
    },
    renderEdit(){
        let color = this.props.select ? 'white' : 'black';

        return <TextField ref="tfEdit" onBlur={this.handleTextBlur}
                          inputStyle={{color:color}}
                          style={{width:"100%",height:"100%",lineHeight:"0px"}}
                          underlineStyle={{bottom:0}}
                          onEnterKeyDown={this.handleEditKeyDown}
                          defaultValue={this.state.primaryText}/>;

    },
    handleTouchTap(e){
        this.props.onTouchTap && this.props.onTouchTap(e, this.props.index);
    },
    render(){

        let el = this.state.editable ? this.renderEdit() : this.state.primaryText;


        return <ListItem primaryText={el} innerDivStyle={this.props.innerDivStyle}
                         rightIconButton={this.renderItemMenu(this.props.select)}
                         onTouchTap={this.handleTouchTap}

            />
    }
})

module.exports = SListItem;