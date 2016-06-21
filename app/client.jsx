var $ = window.jQuery = window.$ = require('jQuery');
var React     = require('react');
var ReactDom  = require('react-dom')
var Main      = require('././clientjs/flux/components/Main.react.jsx');
var ActivityBox      = require('././clientjs/flux/components/ActivityBox.react.jsx');
var bootstrap = require('bootstrap');
import layout 	from '././clientjs/flux/components/plugins/layout.jquery.js';
import App 		from '././clientjs/object-model/App.js';
import { Router, Route, hashHistory } from 'react-router';




/* Creates app instance. */
window.app = new App();

/* Renders Main. */
ReactDom.render(
	<Router history={hashHistory}>
		<Route 
			path="/" 
			component={Main}
		/>
		<Route 
			path="/show" 
			component={ActivityBox}
		/>
    </Router>, 
    document.getElementById("app")
);

/* Display "<body>" when this file is loaded. */
$("body").show();

/* Calls the chat window plugin. */
layout();