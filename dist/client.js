'use strict';

var $ = require('jQuery');
var React = require('react');
var ReactDom = require('react-dom');
var ChatInput = require('././clientjs/flux/components/ChatInput.react.jsx');

ReactDom.render(React.createElement(ChatInput, null), document.getElementById("app"));