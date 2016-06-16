import React from 'react';

class ChatInput extends React.Component
{
    constructor(props)
    {
        super(props);
    }

    render()
    {
        return(
            <table className="chat-inputs-container">
                <tbody>
                    <tr>
                        <td className="_-textcell">
                            <input 
                                type      = "text" 
                                className = "chat-text" 
                                onChange  = { this.props.onTextChange } 
                                onKeyDown = { this.props.onTyping     } 
                                onKeyUp   = { this.props.onTypingComplete   } 
                            />
                        </td>
                        <td className="_-buttoncell">
                            <input 
                                type      = "button" 
                                className = "chat-button" 
                                value     = "Send" 
                                onClick   = { this.props.onSend } 
                            />
                        </td>
                    </tr>
                </tbody>                
            </table>
        );
    }
}

export default ChatInput;