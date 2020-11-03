const {machineIdSync} = require('node-machine-id');
const apiUrl = "https://astute-cpb-api.000webhostapp.com/log.php";
function logSessionId(page){
    const machineId = machineIdSync();
    let data = new Object();
    let locTime = Date().toLocaleString();
    data.id = machineId;
    data.time = locTime;
    data.page = page;
    let params = new Object();
    params.mId = `{"data":[${JSON.stringify(data)}]}`;
    const parsedUrl = parsePostParamsToUrl(apiUrl,params);
    makeRequest('GET', parsedUrl,).then(response=>{
        try{
        const jsonObj = JSON.parse(response);
        console.log(jsonObj.status);
        }catch(error){
            console.log(error);
        }
        
    }).catch(error =>{
        console.log(error);
    });
}