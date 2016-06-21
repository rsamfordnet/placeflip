'use strict';

var _layoutJquery = require('././clientjs/flux/components/plugins/layout.jquery.js');

var _layoutJquery2 = _interopRequireDefault(_layoutJquery);

var _App = require('././clientjs/object-model/App.js');

var _App2 = _interopRequireDefault(_App);

var _reactRouter = require('react-router');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var $ = window.jQuery = window.$ = require('jQuery');
var React = require('react');
var ReactDom = require('react-dom');
var Main = require('././clientjs/flux/components/Main.react.jsx');
var ActivityBox = require('././clientjs/flux/components/ActivityBox.react.jsx');
var bootstrap = require('bootstrap');


/* Creates app instance. */
window.app = new _App2.default();

/* Renders Main. */
ReactDom.render(React.createElement(
	_reactRouter.Router,
	{ history: _reactRouter.hashHistory },
	React.createElement(_reactRouter.Route, {
		path: '/',
		component: Main
	}),
	React.createElement(_reactRouter.Route, {
		path: '/show',
		component: ActivityBox
	})
), document.getElementById("app"));

/* Display "<body>" when this file is loaded. */
$("body").show();

/* Calls the chat window plugin. */
(0, _layoutJquery2.default)();