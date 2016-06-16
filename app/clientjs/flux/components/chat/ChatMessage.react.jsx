/* namespace */ import React    from 'react';
/* object    */ import session  from '../../../object-model/Session.js';

class ChatMessage extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    /* string property. */
    get message() { return this.props.message; }

    /* string property. */
    get messageClass() 
    { 
        return this.props.message.userName == session.name ? 
            "chat-message bubble-message-mine left" 
            :
            "chat-message bubble-message-theirs right"; 
    } 

    render()
    {
        return (
            <div className={ this.messageClass } key={ this.message.id }> 
                <span><strong>{ this.message.userName }</strong></span>
                <div className="chat-message">
                    {this.message.text}
                </div>
            </div>
        );
    }
}

export default ChatMessage;