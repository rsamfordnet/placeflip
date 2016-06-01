var React = require('react');

module.exports = React.createClass(
    {
        render : function()
        {
            return (
                <div>
                    <input type="text" />
                    <input type="button" value="send" />
                </div>
            );
        }
    }
);