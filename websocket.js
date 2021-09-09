var http = require('http');
var MongoClient = require('mongodb').MongoClient;
var server = require('websocket').server;

startMongoDBConnection();

function startMongoDBConnection(){
  MongoClient.connect('mongodb://localhost:27017/sparta', function(err, db) {
    startWebSocketServer(db);
  });
}

function startWebSocketServer(db){
  var connections = new Set(); // Storage of connections
  var lastModification = 0; // Greater modified

  var socket = new server({
    httpServer: http.createServer().listen(8008)
  });

  console.log("WebScoket running on ws://localhost:8008");
  
  setLastModified();
  initInterval();

  socket.on('request', function(request) {
    var connection = request.accept(null, request.origin);
    
    connections.add(connection);

   /* db
      .collection('iot_data')
      .find({country: countries}, {country: 1, count: 1, hour: 1, _id: 0})
      .toArray(function(err, docs){
        connection.send(JSON.stringify(docs));
      });*/
      db.collection.update(  
        { _id:key },
        { $push: { events: { event: { value:payload, when:new Date() } } } },
        { upsert:true },
        function(err,docs) {
          if(err) { console.log("Insert fail"); } // Improve error handling
        }
        )
    connection.on('close', function() {
      connections.delete(connection);
    });
  });

  function initInterval(){
    setInterval(function(){
      /*db
        .collection('id_country_hour')
        .find({country: countries, modified: {$gt: lastModification}}, {country: 1, count: 1, hour: 1, _id: 0})
        .toArray(function(err, docs){
          if(docs.length > 0){
            connections.forEach(function(connection){
              connection.send(JSON.stringify(docs));
            });
            setLastModified();
          }
        });*/
        db.collection.update(  
            { _id:key },
            { $push: { events: { event: { value:payload, when:new Date() } } } },
            { upsert:true },
            function(err,docs) {
              if(err) { console.log("Insert fail"); } // Improve error handling
            }
            )   
    }, 1000);
  }

  
}