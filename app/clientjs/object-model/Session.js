var $ = require('jQuery');

module.exports = {
    name    : $("#sessionContainer").text(),
    isvalid : function()
    {
        return true;
    }
};