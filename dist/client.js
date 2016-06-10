'use strict';

var $ = window.jQuery = window.$ = require('jQuery');
var React = require('react');
var ReactDom = require('react-dom');
var ChatInput = require('././clientjs/flux/components/ChatInput.react.jsx');
var bootstrap = require('bootstrap');

try {
    ReactDom.render(React.createElement(ChatInput, null), document.getElementById("app"));
} catch (e) {
    console.log("The application was loaded outside of the main page.");
}

/* Display "<body>" when this file is loaded. */
//window.document.body.style='display:visible'

$("body").show();