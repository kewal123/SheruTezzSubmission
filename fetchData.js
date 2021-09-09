const api_url = "http://13.233.13.254:2222/xenergyData.json";
  
// Defining async function
async function getapi(url) {
    
    // Storing response
    const response = await fetch(url);
    
    // Storing data in form of JSON
    var data = await response.json();
    console.log(data);
    if (response) {
        hideloader();
    }
    show(data);
}
// Calling that async function
getapi(api_url);
  
// Function to hide the loader
function hideloader() {
    document.getElementById('loading').style.display = 'none';
}
// Function to define innerHTML for HTML table
function show(data) {
    let tab = 
        `<tr>
          <th>Battery %</th>
          <th>Current</th>
          <th>Pack Voltage</th>
          <th>Created At</th>
         </tr>`;
    
    // Loop to access all rows 
    for (let r of data.records) {
         var values=[];
      if(r.tdata)
      {
     values = r.tdata.split(',');
      }
    
   /* if(values[20]==20 || values[20]==15 || values[20]==5 || values[20]==0)
     {
         alert("Battery low :"+values[20]);
     }*/





       
if(values[20] <20 || values[19]<0 || values[18]>100)
{
    tab += `<tr bgcolor="red"> 
    <td class="ta">${values[20] }</td>
    <td class="ta">${values[19]}</td>
    <td class="ta">${values[18]}</td> 
    <td class="ta">${r.created} </td>        
</tr>`;   
}
else{
    tab += `<tr> 
    <td class="ta">${values[20] }</td>
    <td class="ta">${values[19]}</td>
    <td class="ta">${values[18]}</td>
    <td class="ta">${r.created} </td>           
</tr>`; 
}
 }
    // Setting innerHTML as tab variable
    document.getElementById("employees").innerHTML = tab;
}