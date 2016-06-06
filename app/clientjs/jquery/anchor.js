var $ = require('jQuery');

//for each element that is classed as 'pull-down', set its margin-top to the difference between its own height and the height of its parent
module.exports = 
    $('.pull-down').each(
        function() 
        {
            var $this = $(this);
            $this.css('margin-top', $this.parent().height() - $this.height())
        }
    );