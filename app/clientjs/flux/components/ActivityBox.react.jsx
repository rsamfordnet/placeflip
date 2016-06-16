/* npm */      import $         from 'jquery';
/* npm */      import React     from 'react';
/* class */    import Actions   from '../actions/Actions.jsx';
/* class */    import ChatStore from '../stores/ChatStore.jsx';
/* class */    import Room      from '../../object-model/Room.js';
/* class */    import Message   from '../../object-model/Message.js';
/* object */   import assign    from 'object-assign';
/* object */   import session   from '../../object-model/Session.js';

module.exports = React.createClass(
    {
        getInitialState : function()
        {
            return {
                text : ""
            };
        },

        createActivity : function()
        {
            var activityText = $("#activityText").val();
            if (this.props.onNewActivity)
                this.props.onNewActivity(activityText)
        },

        render : function()
        {
            return (
                <div>
                    <textarea id="activityText"></textarea>
                    <input type="button" value="Create" onClick={this.createActivity}></input>
                </div>
            );
        }
    }
);