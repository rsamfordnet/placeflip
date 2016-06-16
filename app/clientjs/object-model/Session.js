var $ = require('jQuery');

export default {
    name    : $("#sessionContainer").text(),
    isvalid : function()
    {
        return true;
    }
};