var $ = require('jQuery');

export default {
    name    : $("#sessionContainer").text(),
    user	: function()
    {
    	if (!this._userObject)
    		this._userObject = JSON.parse($("#userContainer").html());
    	
    	return this._userObject;
    },
    isvalid : function()
    {
        return true;
    }
};