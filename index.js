var http = require('http');
var fs = require('fs');
var url = require('url');
var request = require('request');

var success =  function(response, data) {
    //Page found	  
    // HTTP Status: 200 : OK
    // Content Type: text/plain
    response.writeHead(200, {'Content-Type': 'text/html'});	
    
    // Write the content of the file to response body
    response.write(data.toString());		
}

var error = function(response) {
    // HTTP Status: 404 : NOT FOUND
    // Content Type: text/plain
    response.writeHead(404, {'Content-Type': 'text/html'});
}

// Create a server
http.createServer( function (req, response) {  
   // Parse the request containing file name
   var pathname = url.parse(req.url).path;
   
   // Print the name of the file for which request is made.
   console.log("Request for " + pathname + " received.");
   if (pathname.indexOf("/words/complete") == 0) {
       request.get('http://dev.b8ta.com' + pathname).pipe(response);
   } else { 
       // Read the requested file content from file system
       fs.readFile(pathname.substr(1), function (err, data) {
          if (err) {
            error(response);
          } else{	
             success(response, data.toString());
          }
          // Send the response body 
          response.end();
       });
   }   
}).listen(8081);