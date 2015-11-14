/**
 * Created by ljs on 15/10/30.
 */


let React = require('react');
let ReactDom = require('react-dom')
let Mui = require('material-ui');

let injectTapEventPlugin = require("react-tap-event-plugin");
let defaultStyle = {
    defaultPadding: {paddingTop: 0, paddingBottom: 0}
};


injectTapEventPlugin();
window.React = React;
window.Mui = Mui;
window.defaultStyle = defaultStyle;





window.onload = ()=> {
    let Root = require('../js/app.js');

    ReactDom.render(<Root />, document.getElementById("mainContent"));

}


