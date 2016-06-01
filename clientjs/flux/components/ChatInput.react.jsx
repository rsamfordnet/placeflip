var $          = require('jQuery');
var React      = require('react');
var Actions    = require('../actions/Actions.jsx');
var ChatStore  = require('../stores/ChatStore.jsx');

module.exports = React.createClass(
    {
        getInitialState : function()
        {
            return {
                messages : [],
                currentMessage : ""
            };
        },
        
        componentDidMount : function()
        {
            var component = this;
            
            ChatStore.addChangeListener(
                function(message)
                {
                    var state = ChatStore.getState();
                    
                    component.setState(
                        {
                            messages : state.messages
                        }
                    );
                }
            );
        },
        
        onSend : function()
        {
            var userName = $("#sessionContainer").text();
            
            Actions.sendMessage({ message : this.state.currentMessage, user : userName}, true);
            $(".chat-input").val("");
        },
        
        onTextChange : function(ev)
        {
            this.state.currentMessage = ev.target.value;
        },
        
        onEnter : function(ev)
        {
            if (ev.keyCode == 13)
                this.onSend();
        },
        
        render : function()
        {
            return (
                <div>
                    <div>
                        {
                            this.state.messages.map(
                                function(message) 
                                {
                                    return <div> 
                                        <span><strong>{ message.user }</strong></span>
                                        <div className="chat-message">
                                            <span key={message.message}>{message.message}</span>
                                        </div>
                                    </div>
                                }
                            )
                        }
                    </div>
                    <input type="text" className="chat-input" onChange={ this.onTextChange } onKeyDown={ this.onEnter } />
                    <input type="button" value="Send" onClick={ this.onSend } />
                </div>
            );
        }
    }
);