let {
    List,
    FontIcon,
    IconButton,
    IconMenu,
    }=require('material-ui');
const Color = require('material-ui/lib/styles/colors');
const StylePropable = require('material-ui/lib/mixins/style-propable');
let MenuItem = require('material-ui/lib/menus/menu-item');
let ListItem = require('./slistitem');
let itemStyle = {
    paddingTop: 10, paddingBottom: 10
}

let SelectList = React.createClass({

    mixins: [StylePropable],
    getInitialState(){

        return {
            selectItem: 0
        };
    },

    getDefaultProps(){
        return {
            onTouchItem: null,
            dataSet: [],
            selectItemStyle: {backgroundColor: Color.blue500, color: 'white'},

        }
    },

    handleItemClick(e, ix){

        this.setState({
            selectItem: ix
        });

        return this.props.onTouchItem && this.props.onTouchItem();
    },

    handleItemChange(val,ix){
        //this.setState({
        //    selectItem: val
        //});
        //
        //console.log('handleItemChange',val);
    },
    renderItem(){

        let children = this.props.dataSet;
        let self = this;

        return children.map(function (n, i) {

            let styles = itemStyle;
            let select = false;
            if (self.state.selectItem == i) {
                select = true;
                styles = self.mergeStyles(itemStyle, self.props.selectItemStyle);
            }

            return <ListItem key={"selectlistitem"+i} index={i} primaryText={n} innerDivStyle={styles}
                             select={select}
                             onTouchTap={self.handleItemClick}
                             onChangeValue={self.handleItemChange}
                />
        });
    },


    render(){
        return <div style={defaultStyle.defaultPadding}>
            {this.renderItem()}
        </div>;
    }
})


module.exports = SelectList;


