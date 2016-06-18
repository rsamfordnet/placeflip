import $ from 'jquery';

/* Adjusts the chat window to the browser height. */
export default function()
{
	$(
		function()
		{
			window.showSmall = function()
			{
				window.isSmallMode = true;
				switch(window.currentWindowMode)
				{
					case undefined:
						window.showSmallRoom();
					break;
					case "room":
						window.showSmallRoom();
					break;
					case "chat":
						window.showSmallChat();
					break;
				}
			}

			window.showSmallRoom = function(){
				if (!window.isSmallMode)
					return;
				
				window.currentWindowMode = "room";
				$(".t").removeClass("medium");
				$(".t").removeClass("large");	
				$(".t").addClass("small");

				$(".t.small .c3").addClass("hide");
				$(".t.small .c2").removeClass("hide");
				$(".if-small").show();
			}

			window.showSmallChat = function(){
				if (!window.isSmallMode)
					return;

				window.currentWindowMode = "chat";
				$(".t").removeClass("medium");
				$(".t").removeClass("large");	
				$(".t").addClass("small");
				$(".t.small .c2").addClass("hide");
				$(".t.small .c3").removeClass("hide");
				$(".if-small").show();
			}

			window.enterMediumMode = function()
			{
				$("html").css("overflow", "hidden");
				$("html").css("overflow-y", "hidden");
				$(".t .r .c2").css("overflow-y", "scroll");
				$(".t .r .c2").css("display", "inline-block");
				$(".t .r .c2").css("height", document.body.clientHeight);
				$(".t .r .c3").css("width", 400);
				$(".t .r .c2").css("width", document.body.clientWidth - $(".t .r .c3").width());
				$(".t .r").css("height", document.body.clientHeight);
				$(".t").css("height", document.body.clientHeight);
				$(window).scrollTop(0);
			}

			window.exitMediumMode = function()
			{
				$(".t .r .c2").css("overflow-y", "");
				$(".t .r .c2").css("overflow-y", "");
				$(".t .r .c2").css("display", "table-cell");
				$(".t .r .c2").css("width", "");
				$(".t .r .c3").css("width", "");

				$("html").css("overflow", "");
				$("html").css("overflow-y", "auto");
			}

			$(window).resize(
					function()
					{
						$(".chat-table")
							.css(
								"height",
								document.body.clientHeight
							);

						$(".chat-table .r2 .c")
							.css(
								"height",
								document.body.clientHeight -
								$(".chat-table .r1 .c").height()  -
								$(".chat-table .r3 .c").height() 
							);

						var large  = true;
						var medium = false;
						var small  = false;

						if ($(window).width() < 1100)
						{
							large = false;
							medium = true;
						}

						if ($(window).width() < 600)
						{
							large = false;
							medium = false;
							small = true;
						}

						if (large)
							$(".if-large").show();
						else
							$(".if-large").hide();

						if (large || medium)
						{
							window.isSmallMode = false;
							$(".hide").removeClass("hide");
						}

						if (large)
						{
							$(".t").removeClass("medium");
							$(".t").removeClass("small");
						}

						if (medium)
						{
							$(".t").addClass("medium");
							window.enterMediumMode();
						}
						else
						{
							window.exitMediumMode();
						}

						if (small)
						{
							window.showSmall();
						}
						else
						{
							$(".if-small").hide();
						}
					}
				);

			$(window).scroll(
					function()
					{
						$(".chat-table").css(
							"margin-top",
							$(window).scrollTop()
						);

					}
				);

			window.onResize = function(){ $(window).resize(); };
			$(window).resize();
		}
	);
}