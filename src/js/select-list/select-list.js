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
        let id = 0;
        //if (this.props.dataSet&&this.props.dataSet.length!=0) {
        //    id = this.props.dataSet[0].dataValues.id;
        //}

        return {
            selectItem: id
        };
    },

    getDefaultProps()
    {
        return {
            onTouchItem: null,
            dataSet: [],
            selectItemStyle: {backgroundColor: Color.blue500, color: 'white'},
        }
    }
    ,

    handleItemClick(e, ix)
    {

        this.setState({
            selectItem: ix
        });

        return this.props.onTouchItem && this.props.onTouchItem();
    }
    ,

    handleItemChange(val, ix)
    {
        DataSet.updateMulu(ix,val,()=>{

        })

        //this.setState({
        //    selectItem: val
        //});
        //
        //console.log('handleItemChange',val);
    }
    ,
    renderItem()
    {

        let children = this.props.dataSet;
        let self = this;

        return children.map(function (n, i) {

            let data = n.dataValues;
            let styles = itemStyle;
            let select = false;
            if (self.state.selectItem == data.id) {
                select = true;
                styles = self.mergeStyles(itemStyle, self.props.selectItemStyle);
            }

            return <ListItem key={"selectlistitem"+i} index={data.id} primaryText={data.name} innerDivStyle={styles}
                             select={select}
                             onTouchTap={self.handleItemClick}
                             onChangeValue={self.handleItemChange}
                />
        });
    }
    ,


    render()
    {
        return <List style={[defaultStyle.defaultPadding]}>
            {this.renderItem()}
        </List>;
    }
})


module.exports = SelectList;


