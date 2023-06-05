let domMsgs = document.getElementById("msgs");
let domTopBar = document.getElementById("title");
let domResponses = document.getElementById("responses");
let domName = document.getElementById("nameField");
let domSubmitName = document.getElementById("submitNameButton");

let sessionId = null;
let backendEvent = null
let formerList = ""
let formerResponses = ""
let currentMessages = null
let sendCooldown = Date.now() - 2000
let interlocutor = null
let formerInterlocutor = null
let createUser = null
let userId = null
let userName = null

domSubmitName.onclick = () => {
    console.log(domName.value)
    if (domName.value != "") {
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
    //get interlocutor
    userId && (interlocutor = data[sessionId]?.users[userId]?.assignedInterlocutor)
    if (formerInterlocutor !== interlocutor) {
        displayConv()
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
    currentMessages = data
    displayConv()
}

function displayList() {
    let container = document.getElementById('convsContainer')
    //clear childs
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    let conv = document.createElement('div')
    conv.textContent = interlocutor
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
    msg.textContent = "Début de la conversation avec Léo";
    domMsgs.appendChild(msg);
    if (currentMessages[sessionId]) {
        let messages = Object.values(currentMessages[sessionId]?.messages);
        messages.map((item, i) => {
            if (item.interlocutor !== interlocutor) return
            let msg = document.createElement("div");
            msg.classList.add("msg");
            if (item.foreign) {
                msg.classList.add("foreign");
            }
            if (i == messages.length - 1) {
                msg.classList.add("last");
            }
            msg.textContent = item.msg;
            domMsgs.appendChild(msg);
        });

        let responses = Object.values(currentMessages[sessionId]?.responses)
        console.log(responses)
        let response = []
        let parent;
        responses.forEach((item) => {
            response = item.options
            parent = item.parent
        })
        if (response) {
            while (domResponses.firstChild) {
                domResponses.removeChild(domResponses.firstChild);
            }
            response.map((item) => {
                if (item.interlocutor) return
                let msg = document.createElement("div");
                msg.classList.add("response");
                msg.onclick = () => sendEventToBack("response", item, response, parent)
                msg.textContent = item;
                domResponses.appendChild(msg);
            })
        }
    } else {
        let msg = document.createElement("div");
        msg.classList.add("msg", "info");
        msg.textContent = "Impossible de récupérer les messages :/";
        domMsgs.appendChild(msg);
    }
    document.getElementById('msgsContainer').scrollTop = 9999
}
function sendEventToBack(title, content, responsesArray, parent) {
    if (sendCooldown < Date.now() - 3000) {
        console.log("Sending...")
        sendCooldown = Date.now()
        backendEvent({ title: title, id: sessionId, content, responsesArray, parent, interlocutor })
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