'use strict';

var $ = require('jQuery');
var React = require('react');
var ReactDom = require('react-dom');
var ChatInput = require('././clientjs/flux/components/ChatInput.react.jsx');

ReactDom.render(React.createElement(
  'div',
  null,
  React.createElement(ChatInput, null),
  ' Good'
), document.getElementById("app"));