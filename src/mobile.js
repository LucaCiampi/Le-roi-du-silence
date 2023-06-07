let domMsgs = document.getElementById("msgs");
let domTopBar = document.getElementById("title");
let domResponses = document.getElementById("responses");
let domName = document.getElementById("nameField");
let domSubmitName = document.getElementById("submitNameButton");
let domImageFullscreen = document.getElementById("imageFullscreen");
let domImageFullscreen2 = document.getElementById("imageFullscreen2");

domImageFullscreen.onclick = () => domImageFullscreen.classList.remove('show')
domImageFullscreen2.onclick = () => domImageFullscreen2.classList.remove('show')

let sessionId = null;
let backendEvent = null
let formerList = ""
let formerResponses = ""
let currentData = null
let sendCooldown = Date.now() - 2000
let interlocutor = null
let formerInterlocutor = null
let createUser = null
let userId = null
let isReadyToSubmit = false

domSubmitName.onclick = () => {
    if (domName.value != "" && isReadyToSubmit) {
        createUser(domName.value, (id) => {
            userId = id
            console.log(id)
            navigateTo("list")
        })
    }
}

export function createMobileInterface(id, handleBackendEvent, createMobileSession) {
    createUser = createMobileSession
    document.getElementById('backButton').onclick = () => navigateTo("list")
    backendEvent = handleBackendEvent
    if (id.charAt(0) !== "?") {
        domTopBar.textContent = "Erreur 404";
    } else {
        sessionId = id.slice(1);
        domTopBar.textContent = sessionId.slice(17);
    }
    let msg = document.createElement("div");
    msg.classList.add("msg", "info");
    msg.textContent = "Chargement...";
    domMsgs.appendChild(msg);
}

export function getData(data) {
    domSubmitName.classList.remove('notReady')
    isReadyToSubmit = true
    domSubmitName.disabled = false
    //get interlocutor
    userId && (interlocutor = data[sessionId]?.users[userId]?.assignedInterlocutor)
    if (formerInterlocutor !== interlocutor) {
        displayConv()
        domTopBar.textContent = interlocutor
        formerInterlocutor = interlocutor
    }
    //display convs list
    displayList()
    
    //check if data is the same as last time
    if (JSON.stringify(data[sessionId]?.messages) == formerList
    && JSON.stringify(data[sessionId]?.responses) == formerResponses) {
        console.log("Same data, not refreshing");
        return
    } else {
        formerList = JSON.stringify(data[sessionId]?.messages)
        formerResponses = JSON.stringify(data[sessionId]?.responses)
    }
    currentData = data
    displayConv()
}

function displayList() {
    //clear childs
    let container = document.getElementById('convsContainer')
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    let conv = document.createElement('div')
    let name = document.createElement('p')
    name.textContent = interlocutor ? interlocutor : "Rien a afficher"
    if (interlocutor) {
        conv.classList.add('contact')
        let pp = document.createElement('img')
        pp.src = `./Interface/pp.png`
        let time = document.createElement('span')
        time.textContent = "Aujourd'hui"
        conv.appendChild(time)
        conv.appendChild(pp)
    }
    conv.appendChild(name)
    conv.onclick = () => navigateTo("messages")
    container.appendChild(conv)
}

function displayConv() {
    //clear childs
    while (domMsgs.firstChild) {
        domMsgs.removeChild(domMsgs.firstChild);
    }
    
    //create messages and responses
    let msg = document.createElement("div");
    msg.classList.add("msg", "info");
    msg.textContent = "Début de la conversation";
    domMsgs.appendChild(msg);
    if (currentData[sessionId]) {
        let messages = Object.values(currentData[sessionId]?.messages);
        messages.map((item, i) => {
            if (item.interlocutor !== interlocutor) return
            let msg = document.createElement("div");
            msg.classList.add("msg");
            if (item.foreign) {
                msg.classList.add("foreign");
            }
            if (i == messages.length-1 && item.foreign){
                var audio = new Audio('/Sounds/notifApple.mp3');
                audio.play();

            }
            if (i == messages.length - 1) {
                msg.classList.add("last");
            }
            if (item.msg == "J'ai trouvé ça :") {
                msg.classList.add("haveImg");
                msg.onclick = () => domImageFullscreen.classList.add('show')
            }
            if (item.msg == "end") {
                domImageFullscreen2.classList.add('show')
                msg.style.display = "none"
            }
            msg.textContent = item.msg;
            domMsgs.appendChild(msg);
        });

        let responses = Object.values(currentData[sessionId]?.responses)
        let responseId = Object.keys(currentData[sessionId]?.responses)
        let interlocutorResponses = []
        let parent;
        responses.forEach((item, i) => {
            if (item.interlocutor == interlocutor) {
                interlocutorResponses = item.options
                parent = item.parent
                if (interlocutorResponses) {
                    while (domResponses.firstChild) {
                        domResponses.removeChild(domResponses.firstChild);
                    }
                    interlocutorResponses.map((item) => {
                        if (item.interlocutor) return
                        let msg = document.createElement("div");
                        msg.classList.add("response");
                        msg.onclick = () => sendEventToBack("response", item, interlocutorResponses, parent, responseId[i])
                        msg.textContent = item;
                        domResponses.appendChild(msg);
                    })
                } else {
                    while (domResponses.firstChild) {
                        domResponses.removeChild(domResponses.firstChild);
                    }
                }
            }
        })
    } else {
        let msg = document.createElement("div");
        msg.classList.add("msg", "info");
        msg.textContent = "Impossible de récupérer les messages :/";
        domMsgs.appendChild(msg);
    }
    document.getElementById('msgsContainer').scrollTop = 9999
}
function sendEventToBack(title, content, responsesArray, parent, responseId) {
    if (sendCooldown < Date.now() - 3000) {
        console.log("Sending...")
        sendCooldown = Date.now()
        backendEvent({ title: title, id: sessionId, content, responsesArray, parent, interlocutor, responseId })
    } else {
        console.warn("Send cooldown")
    }
}

function navigateTo(page) {
    switch (page) {
        case "messages":
            document.getElementById("mobileMessages").classList.remove("rightHided")
            document.getElementById("mobileList").classList.remove("rightHided")
            break;
        case "list":
            document.getElementById("mobileList").classList.remove("rightHided")
            document.getElementById("mobileMessages").classList.add("rightHided")
            break;
        default://"home"
            document.getElementById("mobileList").classList.add("rightHided")
            document.getElementById("mobileMessages").classList.add("rightHided")
            break;
    }
}