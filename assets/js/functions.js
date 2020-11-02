const { param } = require("jquery");

function makeRequest(reqType="GET",baseUrl,headerObj=null,body='',online=true){
    return new Promise((resolve,reject)=>{
    if(navigator.onLine || online===false){
        let xhr = new XMLHttpRequest();
        xhr.open(reqType,baseUrl);
        if(headerObj !==null){
            xhr.setRequestHeader(headerObj.name,headerObj.value);
        }
        xhr.onload = () =>{
            if(xhr.status == 200){
                resolve(xhr.response);
                //dev opt console.log(xhr.response);
            }else{
                reject(xhr.response);
            }
        }
        xhr.onerror = () => {reject(`Ocorreu um erro ao tentar baixar dados. Verifique sua conexão com a internet. Se o problema persistir... que triste pra tu :(`)};
        xhr.ontimeout = () =>{reject(`Timeout Exception!`); }
        xhr.send(body);
    }else{
        reject("Offline");
    }
    });
};

function yesCancelDialog(title,message,onYes,onCancel){
    const remote = require('electron').remote;
    const dialog = remote.dialog;
    dialog.showMessageBox(null,{
        type: 'none', 
        buttons: ['cancel','ok'], 
        defaultId: 0, 
        cancelId: 0,
        title:title,
        message:message
    }).then(box=>{
        const btnIndex = box.response;
        if(btnIndex === 0){
            onCancel();
        }else if(btnIndex === 1){
            onYes();
        }
    });
}

function jsonToString(jsonObj){
    return JSON.stringify(jsonObj);
};

function setInnerTxtById(elementId,text){
    let element = document.getElementById(elementId);
    element.innerText = text;
    return true
};

function setInnerHtmlById(elementId,innerHtml){
    let element = document.getElementById(elementId);
    element.innerHTML = innerHtml;
    return true;
}
function addChildElement(elementId,childElement,isFirst=false){
    if(isFirst === false){
        $(`#${elementId}`).append(childElement);
    }else if(isFirst === true){
        $(`#${elementId}`).prepend(childElement);
    }
    return true;
}

function removeElement(element){
    $(`${element}`).remove();
    return true;
}

function addElementToStorage(elementKey,elementData){
    localStorage.setItem(elementKey,elementData);
    return true;
}

function addSessionElementToStorage(elementKey,elementData){
    sessionStorage.setItem(elementKey,elementData);
    return true;
}


function removeElementFromStorage(elementKey){
    localStorage.removeItem(elementKey);
}

function returnStorageObjData(elementKey){
    let elementData = localStorage.getItem(elementKey);
    return elementData;
}


function returnSessionStorageObjData(elementKey){
    let elementData = sessionStorage.getItem(elementKey);
    return elementData;
}

function addProp(propKey,propValue,elementId){
    $(`#${elementId}`).prop(propKey,propValue);
}

function changeImgSrc(imgElementId,newSrc){
    $(`#${imgElementId}`).attr('src',newSrc);
    return true;
}

function getAttrValue(element,attrName){
    const attrValue = $(`${element}`).attr(attrName);
    return attrValue;
}

function toggleElement(element){
    $(element).toggle();
}

function parsePostParamsToUrl(url,params){
    let parsedUrl, paramList=[],param;
    let baseUrl = `${url}?`;
    for(param in params){
        paramList.push(`${encodeURIComponent(param)}=${encodeURIComponent(params[param])}`);
    }
    let paramCount = paramList.length;
    let i;
    for(i = 0; i<paramCount; i++){
        if(i === 0){
            baseUrl += paramList[i] + "&";
        }else if(i === (paramCount - 1)){
            baseUrl += paramList[i];            
        }else{
            baseUrl += paramList[i] + "&";
        }
    }
    return baseUrl;
}

function alertDialog(title,message){
    const remote = require('electron').remote;
    const dialog = remote.dialog;
    dialog.showMessageBox(null,{
        title:title,
        message:message
    });
}
