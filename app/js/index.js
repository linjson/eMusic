/**
 * Created by ljs on 2017/3/17.
 */

require('../css/index.scss');

const React = require('react');
const ReactDOM = require('react-dom');

const Home = require('./home');

ReactDOM.render(
    <Home />,
    document.getElementById('application')
);