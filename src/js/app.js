

let LeftContent=require('./left');

let Root = React.createClass({
    render(){
        return <div>
            <div id="topContent">
                <div id="leftContent"><LeftContent /></div>
                <div id="rightContent">right</div>
            </div>
            <div id="bottomContent">
                bottom
            </div>
        </div>;
    }
});


module.exports = Root;
