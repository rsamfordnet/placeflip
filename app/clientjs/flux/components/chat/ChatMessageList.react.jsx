import React from 'react';
import ChatMessage from './ChatMessage.react.jsx';

class ChatMessageList extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    get messages(){ return this.props.messages; }

    render()
    {
        return (
            <div>
                {
                    this.messages.map(
                        function(message) 
                        {
                            return <ChatMessage 
                                key={message.id} 
                                message = { message } 
                            />
                        }
                    )
                }
            </div>
        );
    }
} 

export default ChatMessageList;