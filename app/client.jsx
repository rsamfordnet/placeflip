var $ = window.jQuery = window.$ = require('jQuery');
var React     = require('react');
var ReactDom  = require('react-dom')
var Main      = require('././clientjs/flux/components/Main.react.jsx');
var bootstrap = require('bootstrap');
import chatWindowPlugin from '././clientjs/flux/components/plugins/chatwindow.jquery.js';
import App from '././clientjs/object-model/App.js';

/* Creates app instance. */
var app = new App();

/* Renders Main. */
ReactDom.render(
    <Main app={ app } />, 
    document.getElementById("app")
);

/* Display "<body>" when this file is loaded. */
$("body").show();

/* Calls the chat window plugin. */
chatWindowPlugin();