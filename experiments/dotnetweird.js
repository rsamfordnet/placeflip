var http = require('http');
var edge = require('edge');
var helloWorld = edge.func('async (input) => { return input.ToString(); }');
 
var getShipments = edge.func('sql', function()
	{
		/*SELECT 1 AS Num*/
	}
);

http.createServer(function (req, res) {
  var html = "Hi there!";
  res.writeHead(200, {'Content-Type': 'text/plain'});
  
  /*
  helloWorld(
	'C# Hello World!', 
	function (error, result) {
		if (error) throw error;
		html = result;
	}
  );
  */
  
  getShipments(null, 
	function(error, result)
	{
		
		if (error) throw error;
		
		
		if (result)
			html = html + "result has something";
			
		/*
		result.forEach(
			function(row)
			{
				html = html + row.Num;
			}
		);*/
	}
  );
  
  res.end(html);
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');