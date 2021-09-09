![alt text](https://github.com/kewal123/SheruTezzSubmission/blob/main/20210909_171654.jpg)






1. Create a server which accepts socket connections from clients and which parses the
data.

The Stack used will be Nodejs,MongoDB,Javascript.

The code as mentioned in websocket.js , the function startWebSocketServer() 
will create a socket and will listen to the incoming request .

2. Scrape the data from the given url, check if the data is fresh and different from your
previously recorded data and then emulate an IoT device by establishing a socket
connection with the server and sending it the data packet and then closing the socket
connection. If you find any fresher data on the url, you are required to constantly
send the server the data and repeat this process, thus emulating a real time IoT
device.

There is a  function initInterval() to achieve this objective.
The initInterval() function will check the data periodically i.e for every 1 min and will insert into the database.
Once the data is fetched from the client (iot device),the connection will be closed .


3. Both the server and client processes (emulated IoT device) should be fault tolerant,
save any errors to a log and restart incase of any fault.


4. After parsing the data at the server, save this data along with the time when this data
was received, to a database best suited for storing data of this type (so that you can
also do real time analytics on this gathered data).

To achieve this objectve MongoDb database will be best suited.



5. Create real time alerts for this IoT device and battery in case the battery goes below
20 % or the battery starts discharging (the value of current becomes negative) or the
pack voltage shoots across 100 mV. Then, show these alerts and the data received
from the device in realtime on a webpage.

The data stored in MongoDB will be displayed on the webpage continuosly.
To achieve the time alert objective a function will be invoked periodically say after every 5 mins to check if the battery is low or if the battery starts discharging or if the pack voltage goes beyond 100 mV and then alerts will be invoked.

For demo purpose 
The data at the URL (http://13.233.13.254:2222/xenergyData.json) was fetched using javascripts fetch() function and this data is displayed on index.html .On this page battery % ,Current , pack voltage and created_at is displayed .The data which satisfies the above condition is displayed with red background ,which indicates an alert .




6. Create a webpage from where you can issue commands to the IoT device to turn it
off remotely.

The Client will make post request to the Server .
The Server will issue the turn on /turn off commands to the IOT devices using Node.js






The functions which will be required 


Webpage :
1. TurnOnDevice() and TurnOffDevice() will be needed .
This will post the request to the server .
Server will trigger(Send message to the IOT device via socket).
2. FetchDeviceData()
This function will be invoked continuosly to get the data from the database

The following is the pseudoCode:
//Connect Node.js to Mongo db
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/nodeapp', {useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));
module.exports = conn;


//Create a Model to Fetch Data
var mongoose=require('mongoose');
var db = require('../database');
// create an schema
var userSchema = new mongoose.Schema({
            device_IMEI :String,
            latitude :Double,
            longitude : Double,
            cell_1_voltage : Double ,
 cell_2_voltage : Double ,
cell_3_voltage  : Double ,
 cell_4_voltage :Double ,
cell_5 _oltage  :Double ,
cell_6_voltage  : Double ,
cell_7_voltage  :Double ,
 cell_8_voltage  : Double ,
 cell_9_voltage  : Double, 
cell_10_voltage  :Double ,
 cell_11_voltage  : Double ,
 cell_12_voltage  :Double ,
cell_13_voltage  :Double ,
cell_14_voltage  :Double ,
 avg_cell_voltages  : Double, 
pack_voltage : Double,
 current :Double ,
  battery: Integer ,
   created:Timestamp
           });
userTable=mongoose.model('users',userSchema);
        
module.exports={
     
     fetchData:function(callback){
        var userData=userTable.find({});
        userData.exec(function(err, data){
            if(err) throw err;
            return callback(data);
        })
        
     }
}
This has to be called continuosly .
checkForAlert() This function has to be called after every 5 mins and alerts will be invoked depending on the conditions .


//Create a Controller to Fetch Data
var fetchModel= require('../models/fetch-model');
module.exports={
 
    fetchData:function(req, res){
      
      fetchModel.fetchData(function(data){
          res.render('user-table',{userData:data});
      })
    }
}

//Display Data in HTML Table
<!DOCTYPE html>
<html lang="en">
<head>
  <title></title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
 <style type="text/css">
     table, td, th {  
     border: 1px solid #ddd;
     text-align: left;
   }
   
   table {
     border-collapse: collapse;
     width: 50%;
    
   }
   .table-data{
       position: relative;
     left:50px;
     top:50px;
   }
   th, td {
     padding: 15px;
   }
 </style>
</head>
<body>
<!--====form section start====-->
    <div class="table-data">
    <table border="1" >
        <tr>
           <th>Battery %</th>
          <th>Current</th>
          <th>Pack Voltage</th>
          <th>Created At</th>
        </tr>
        
        <%
        if(userData.length!=0){
        var i=1;
        userData.forEach(function(data){
        %>
        <tr>
            <td><%=i; %></td>
            <td><%=data.battery %></td>
            <td><%=data.current %></td>
            <td><%=data.pack_voltage %></td>
            <td><%=data.country %></td>
        </tr>
        <%  i++; }) %>
        <% } else{ %>
            <tr>
                <td colspan="7">No Data Found</td>
            </tr>
        <% } %>
    </table>
    </div>
</body>
</html>



Server :
1. SocketConnection establishment with IOT device using WebSocket /Socket.io .The psuedo code is mentioned in websocket.js

2. Connection to MongoDB:
The psuedo code is mentioned above .

3. Fetch Data from Db
The psuedo code is mentioned above .

4. PostDatatoDb()
This function will be invoked continuosly to get data from iot device and post it into database 
//the psuedo code is mentioned in websocket.js

5. PostAlert()
This function will be used to send commands to the iot devices via sockets .This will be invoked after the client makes a post request to turn on/off the device .

