var $ = require('jQuery');
var React = require('react');
var ReactDom = require('react-dom')
var ChatInput = require('./clientjs/components/chatinput.jsx');


ReactDom.render(<div><ChatInput /> Good</div>, document.getElementById("app"));