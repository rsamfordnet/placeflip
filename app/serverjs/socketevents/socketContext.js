/* Socket events */
var socketEvents = {
    chatStart      : require("../../serverjs/socketevents/chatStart.js"),
    chatJoin       : require("../../serverjs/socketevents/chatJoin.js"),
    chatExit       : require("../../serverjs/socketevents/chatExit.js"),
    chatTyping     : require("../../serverjs/socketevents/chatTyping.js"),
    chatMessage    : require("../../serverjs/socketevents/chatMessage.js"),
    chatDisconnect : require("../../serverjs/socketevents/chatDisconnect.js")
};


/* public class */ function socketContext(io)
{
    /* Properties -> */
    /* public */  this.userSockets = new Object();
    /* private */ var self = this;
    /* <- */

    /* private function */ function wrapEvent(/* function */ eventHandler, /* socket */ socket)
    {
        return function(eventArgs){
                
            var e = {
                context : self,
                args    : eventArgs,
                socket  : socket,
                caller  : this
            };            

            eventHandler(e);
        }
    }

    /* public function */ this.start = function()
    {
        io.on(
            'connection', 
            function(socket){
                socket.on(
                    'chat-start',
                    wrapEvent( socketEvents.chatStart, socket )
                );
                
                socket.on(
                    'chat-join', 
                    wrapEvent( socketEvents.chatJoin, socket )
                );

                socket.on(
                    'chat-exit', 
                    wrapEvent( socketEvents.chatExit, socket )
                );

                socket.on(
                    'chat-typing',
                    wrapEvent( socketEvents.chatTyping, socket )
                );
                
                socket.on(
                    'chat-message', 
                    wrapEvent( socketEvents.chatMessage, socket )
                );
                
                socket.on(
                    'disconnect',
                    wrapEvent( socketEvents.chatDisconnect, socket )
                );
            }
        );
    }

    this.start(io);
}

module.exports = socketContext;