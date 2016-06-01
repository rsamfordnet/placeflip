var Dispatcher   = require('../dispatcher/Dispatcher.jsx');
var assign       = require('object-assign');
var EventEmitter = require('events').EventEmitter;
var Constants    = require('../constants/Constants.jsx');

/* -- */
const SENDMESSAGE_EVENT = Constants.SENDMESSAGE_EVENT;

/* ----- */
var message  = "";
var messages = [];

const ChatStore = assign(EventEmitter.prototype, {
    getState: function () {
        return {
            message  : message,
            messages : messages
        };
    },
 
    addChangeListener: function (callback) {
        this.on(SENDMESSAGE_EVENT, callback);
    },
 
    removeChangeListener: function (callback) {
        this.on(SENDMESSAGE_EVENT, callback);
    },
 
    emitChange: function () {
        this.emit(SENDMESSAGE_EVENT);
    }
});


Dispatcher.register(function (action) {
    switch (action.actionType) {
        case SENDMESSAGE_EVENT:
            message = action.message;
            
            messages.push(message);
            ChatStore.emitChange();
            break;
 
        default:
            // no op
    };
});


module.exports = ChatStore;