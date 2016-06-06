window.jQuery = window.$ = require('jQuery');
var React     = require('react');
var ReactDom  = require('react-dom')
var ChatInput = require('././clientjs/flux/components/ChatInput.react.jsx');
var bootstrap = require('bootstrap');

ReactDom.render(<ChatInput />, document.getElementById("app"));