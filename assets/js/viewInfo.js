const remote = require('electron').remote;
const { shell } = require('electron')

function addIcon(iconType,iconId,mainElementId){
    let iconFile = null;
    switch (iconType){
        case "document":
            iconFile = "./assets/images/icons/document64px.png";
            break;
        case "cute-document":
            iconFile = "./assets/images/icons/documentWinki64px.png"
            break;
        case "cpbprova":
            iconFile = "./assets/images/icons/grade64px.png";
            break;
    }
    console.log(iconId);
    let iconElement = `<span class="footer-icon-container" id="${iconId}"><img class="footer-icon-img" id="${iconId}" src="${iconFile}"></span>`;
    addChildElement(mainElementId,iconElement);
    changeImgSrc(iconId,iconFile);
    return true;
}


function loadData(){
    const extraHtml = `<div class="embed-footer"><span class="footer-icon-container concluded-icon" id="documentIcon"><img class="footer-icon-img" src="./assets/images/icons/checked96px.png"></span></div>`;
    const homeworkId = returnStorageObjData("openedItemId");
    const homeworkStorageData = returnStorageObjData("itensJson");
    const replacedLineBreaks = homeworkStorageData.replace(`\n`,`</br>`);
    const jsonObj = JSON.parse(JSON.parse(replacedLineBreaks));
    const jsonArray = jsonObj.data;

    jsonArray.forEach(element => {
        if(element.id === homeworkId){
            setInnerTxtById("headerTarefaTitle",`Titulo: ${element.title}`);
            setInnerTxtById("headerMateria",`Matéria: ${element.discipline}`);
            setInnerHtmlById("contentInfo",element.content);// + extraHtml);
            let attachmentsArray = element.attachments;
            let cpbProvaUrl = element.cpb_prova;
            if(cpbProvaUrl !== ""){
                addIcon("cpbprova","cpbprovaUrl","contentFooter");
                addSessionElementToStorage("cpbprovaUrl",cpbProvaUrl);
            }
            iterateJsonArray(attachmentsArray,addAttachmentIcon);
        };
    });

};

// function createVideoObj(url,width="100%",heigth="349px"){
//     let youtubeObj = `<object
//     style="width: ${width}; height: ${heigth}; margin: 2px auto;"
//     data="${url}">
//   </object>`;
//     return youtubeObj;
// }

function iterateJsonArray(jsonArray,appliedFunction){
    jsonArray.forEach(element =>{
        console.log(element);
        appliedFunction(element);
    });
}

function addAttachmentIcon(attachmentObj,hasCpbprova=false,mainElementId="contentFooter"){
    const attId = attachmentObj.id;
    const attTitle = attachmentObj.title;
    const attFile = attachmentObj.file;
    const attUrl =  `https://s.educacaoadventista.org.br/e_class/anexos/${attFile}`;
    let iconType = "cute-document";//"document";
    addIcon(iconType,attId,mainElementId);
    addSessionElementToStorage(attId,attUrl);
}

function openExternalUrl(url){
    shell.openExternal(url);
}

function closeWindow(){
    let window = remote.getCurrentWindow();
    window.close();
}
loadData();

$("#closeBtn").on("click",()=>{
    closeWindow();
})
//addIcon("cpbprova","atividade1dox","contentFooter");
/*
<object
  style="width: 820px; height: 461.25px; float: none; clear: both; margin: 2px auto;"
  data="http://www.youtube.com/embed/J---aiyznGQ?autoplay=1">
</object>
*/

$("#contentFooter").on('click','span', function(event){
    const elementId = $(this).attr("id");
    console.log(elementId);
    if(elementId !== null){
        let url = null;
        if(elementId === "cpbprovaUrl"){
            const cpbprovaUrl = returnSessionStorageObjData(elementId);
            url = cpbprovaUrl;
        }else{
            const attachmentUrl = returnSessionStorageObjData(elementId);
            url = attachmentUrl;
        }
        console.log(elementId,url);
        openExternalUrl(url);
    }else{
        
    };
});