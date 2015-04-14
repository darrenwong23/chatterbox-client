/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/

var storage = {};
storage['results'] = [];
var objectId = 100;
var path = require('path');
var fs = require('fs');

exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code
  console.log("Serving request type " + request.method + " for url " + request.url);


  if(request.url !== '/classes/messages') {
    var filePath = '.' + request.url;
    var contentObj = {'Content-Type':'text/html'};
    switch (filePath){
      case './':
        filePath = '../client/index.html';
        break;
      case './styles/styles.css':
        filePath = '../client/styles/styles.css';
        contentObj['Content-Type'] = 'text/css';
        break;
      case './bower_components/jquery/dist/jquery.min.js':
        filePath = '../client/bower_components/jquery/dist/jquery.min.js';

        break;
        case './bower_components/jquery/dist/jquery.min.map':
          filePath = '../client/bower_components/jquery/dist/jquery.min.map';
          break;
      case './bower_components/underscore/underscore.js':
        filePath = '../client/bower_components/underscore/underscore.js';
        break;
      case './bower_components/backbone/backbone.js':
        filePath = '../client/bower_components/backbone/backbone.js';
        break;
      case './scripts/app.js':
        filePath = '../client/scripts/app.js';
        break;
       case './images/spiffygif_46x46.gif':
        filePath = '../client/images/spiffygif_46x46.gif';
        break;
    }


    path.exists(filePath, function(exists){

      if (exists){
        fs.readFile(filePath, function(error, content){
          if (error){
            response.writeHead(500);
            response.end();
          }else{
            console.log("SUCCESS: " + request.url);

            response.writeHead(200, contentObj);
            response.end(content, 'utf-8');
          }
        });
      }else{
        console.log("ERROR ERROR ERROR" + request.url);
        response.writeHead(404);


        response.end();
      }
    });

}

if( request.url === '/classes/messages') {

    var headers = defaultCorsHeaders;
    headers['Content-Type'] = "application/json";
    var statusCode;

    if(request.method === 'OPTIONS') {
      statusCode = 200;
      response.writeHead(statusCode, headers);

      response.end('yay');
    }

  // if (request.url !== '/classes/messages'){

  //   statusCode = 404;
  //   response.writeHead(statusCode, headers);
  //   response.end();

  // }

  if (request.method === 'GET'){
        console.log('GET!!!');


    // The outgoing status.
    statusCode = 200;
    response.writeHead(statusCode, headers);


    response.end(JSON.stringify(storage));
  //end if GET
  }




  if (request.method === 'POST' ){
    console.log('POST!!!');
    statusCode = 201;

    response.writeHead(statusCode, headers);
    var str = '';
    request.on('data', function(chunk) {
      str += chunk;
    });

    request.on('end', function(){
      var obj = JSON.parse(str);
      obj.objectId = objectId++;
      storage['results'].push(obj);
      console.log(storage);
    });

    response.end(JSON.stringify(storage));
  }



}

};


// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};


