
const remote = require('electron').remote;
let userId;
userId = returnStorageObjData('studentId');
//setUserProfile();
// let userId = "33410";
// userId=63193;
// userId=22963;
const {ipcRenderer} = require('electron');
const { readyException } = require('jquery');
let loading = true;

function closeWindow(){
    let window = remote.getCurrentWindow();
    window.close();
}

function loadingLoop(){
    setTimeout(function(){
        let letter = getRandomLetterFromAlphabet();
        setInnerTxtById("loadingAlphabet",letter);
        if(loading){
            loadingLoop();
        }else{
            toggleElement(".loading-div");
        }
    },125)
};

loadingLoop();
makeRequest("GET",`https://api-aulas.educacaoadventista.org.br/api/v1/app/student/${userId}/pending?school_id=406`).then(response=>{
    loading = false;
    const value = jsonToString(response);
    const jsonObj = JSON.parse(response);
    const jsonArray = jsonObj.data;
    addElementToStorage("itensJson",value);
    jsonArray.forEach(element => {
        const today = new Date();
        const due = new Date(element.date_delivery);
        const timeDifference = due-today;
        const remainingDays =   Math.round(timeDifference/(1000 * 3600 * 24));
        let circleType = null;
        if(remainingDays<=2){
            circleType = 1;
        }else{
            circleType = 0
            console.log(remainingDays);
        }
        addItem(element.title,element.discipline,element.id,circleType);
    });
}).catch(error =>{
    $("#offlineIcon").show()
    alertDialog('Error',String(error));
    const offlineData = returnStorageObjData('itensJson');
    if(offlineData !== null){

    }else{
        logOut();
    }
    console.log(error);
    console.log("ABCDE");
    loading = false;
});
function addItem(itemTitle,itemType,itemId,circleType){
    let childElement = null;
    if(circleType === 1){
        childElement = ` <item class="item-container"  id="${itemId}">
        <div class="small-circle item-orange-circle"></div>
        <div class="item-span-container">
            <span class="item_title item_span">${itemTitle}</span>
            <span class="item_type item_span">${itemType}</span>
        </div>
        </item>`;
    }else{
        childElement = ` <item class="item-container"  id="${itemId}">
        <div class="small-circle item-green-circle"></div>
        <div class="item-span-container">
            <span class="item_title item_span">${itemTitle}</span>
            <span class="item_type item_span">${itemType}</span>
        </div>
        </item>`;
    }
    addChildElement("contentItens",childElement);
}

function createBrowserWindow() {
    console.log(ipcRenderer.sendSync('viewInfo','ping'));
  }

function openLoginWindow(){
    return(ipcRenderer.sendSync('logOut','ping'));
};
function setUserProfile(){
    let baseUrl = "https://s.educacaoadventista.org.br/escola/fotos/";
    let studentInfoObj = returnStorageObjData('studentObj');
    console.log(studentInfoObj);
    let jsonObj = JSON.parse(studentInfoObj);
    let jsonObjData =jsonObj.data;
    let photo_sse = jsonObjData.photo_sse;
    let url = baseUrl + photo_sse;
    console.log(url);
    $("#profileImg").attr('src',url);
}


function logOut(){
    localStorage.clear();
    const response = openLoginWindow();
    console.log(response);
    if(response === "success"){
        closeWindow();
    }else{
        console.log(`logout failed. Response: ${response}`);
    }
}


$("#contentItens").on('click','item', function(event){
    const elementId = $(this).attr("id");
    if(elementId !== null){
        addElementToStorage("openedItemId",elementId);
        createBrowserWindow();
    }else{
        
    };
});

$("#closeBtn").on("click",()=>{
    closeWindow();
})

$("#logOutIcon").on('click',()=>{
    logOut();
});

$("#reloadIcon").on('click',()=>{
    location.reload();
});