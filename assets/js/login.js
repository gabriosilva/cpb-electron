const { event } = require('jquery');
const {ipcRenderer} = require('electron');
const remote = require('electron').remote;
function closeWindow(){
    let window = remote.getCurrentWindow();
    window.close();
}

function restartApp(){
    ipcRenderer.send('restart_app');
};

window.addEventListener('load', (event)=>{
    let token = returnStorageObjData("token");
    let studentId = returnStorageObjData("studentId");
    if(token !== null && studentId !== null){
        console.log(ipcRenderer.sendSync('viewActivities','ping'));
        closeWindow();
    }
    console.log(token);
})

ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    const message = 'A new update is available. Downloading now...';
    const title = 'New update available!';
    alertDialog(title,message);
  });
  ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    const message = 'Update Downloaded. It will be installed on restart. Restart now?';
    const title = 'Doenload Concluded!';
    yesCancelDialog(title,message,restartApp,null);
});



function getLoginParams(){
    let params = new Object();
    let email = $("#inputMail").val();
    let pass = $("#inputPassword").val();
    if(email !== "" && pass !== ""){
        params.email = email;
        params.password = pass;
    }
    return params;
};


function logIn(){
        let loginUrl = "https://login.educacaoadventista.org.br/api/v1/login";
        let params = new Object();
        params = getLoginParams();
        params.mobile=true;
        let parsedUrl = parsePostParamsToUrl(loginUrl,params);
        console.log(parsedUrl);
        makeRequest('POST',parsedUrl).then(response=>{
        // loading = false;
        const value = jsonToString(response);
        console.log(value);
        const jsonObj = JSON.parse(response);

        addElementToStorage("token",jsonObj.token);
        
    }).catch(error =>{
        console.log(error);
        try {
            const errorObj = JSON.parse(error);
            const errorDt = errorObj.error;
            alertDialog('Error',String(errorDt));
            console.log(errorDt)
        } catch (error) {
            alertDialog('Error',String(error));
            console.log(error);
        }
        console.log("ABCDE");
        // loading = false;
    }).then(()=>{
        let token = returnStorageObjData('token');
        if(token !== null){
            const url = "https://api-usuario.educacaoadventista.org.br/api/v2/app/user/login";
            let header = new Object();
            header.name = "Authorization";
            header.value = `Bearer ${token}`;
            console.log(header);
            makeRequest('GET',url,header).then(response=>{
                // loading = false;
                const value = jsonToString(response);
                console.log(value);
                const jsonObj = JSON.parse(response);
                const objData = jsonObj.data;
                const studentInfo = objData.student_info;
                const studentId = studentInfo.id_student;
                addElementToStorage("studentId",studentId);
                addElementToStorage('studentObj',response);
                console.log(ipcRenderer.sendSync('viewActivities','ping'));
                closeWindow();
            }).catch(error =>{
                console.log(error);
                console.log("ABCDE");
                removeElementFromStorage('token');
                removeElementFromStorage('studentId');
                // loading = false;
            })
        }
    });
}

$("#closeBtn").on("click",()=>{
    closeWindow();
})

$("#loginBtn").on("click",()=>{
   logIn();
});