import $ from 'jquery';

/* Adjusts the chat window to the browser height. */
export default function()
{
    var onResize = function() 
        {
            

            $(".chat-messages-container")
                .css(
                    "height",
                    $( window ).height()
                    -
                    $(".chat-table.header").height()
                    -
                    $(".chat-table.footer").height()
                );
            $(".chat-table.container")
                .css("height", $( window ).height())
                .css("position", "fixed");
        };

    setTimeout(function() {
        onResize();
    }, 10);

    $( window ).resize(onResize);
    window.onResize = onResize;
}