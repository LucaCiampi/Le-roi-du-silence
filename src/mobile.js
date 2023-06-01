let domMsgs = document.getElementById("msgs");
let domTopBar = document.getElementById("title");
let domResponses = document.getElementById("responses");

let sessionId = null;
let backendEvent = null
let formerList = ""
let formerResponses = ""
let sendCooldown = Date.now() - 2000
let interlocutor = null

export function createMobileInterface(id, handleBackendEvent) {
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

export function startGame(inter) {
    interlocutor = inter
}

export function displayList(list) {
    //check if data is the same as last time
    if (JSON.stringify(list[sessionId]?.messages) == formerList 
    && JSON.stringify(list[sessionId]?.responses) == formerResponses) {
        console.log("Same data, not refreshing");
        return
    }else{
        formerList = JSON.stringify(list[sessionId]?.messages)
        formerResponses = JSON.stringify(list[sessionId]?.responses)
    }
    
    //clear childs
    while (domMsgs.firstChild) {
        domMsgs.removeChild(domMsgs.firstChild);
    }

    //create messages and responses
    let msg = document.createElement("div");
    msg.classList.add("msg", "info");
    msg.textContent = "Début de la conversation avec Léo";
    domMsgs.appendChild(msg);
    if (list[sessionId]) {
        let messages = Object.values(list[sessionId]?.messages);
        messages.map((item, i) => {
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

        let responses = list[sessionId]?.responses?.options;
        let parent = list[sessionId]?.responses?.parent;
        if (!responses) responses = []
        if (responses) {
            while (domResponses.firstChild) {
                domResponses.removeChild(domResponses.firstChild);
            }
            responses.map((response) => {
                if (response.interlocutor) return
                let msg = document.createElement("div");
                msg.classList.add("response");
                msg.onclick = () => sendEventToBack("response", response, responses, parent)
                msg.textContent = response;
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
    if (sendCooldown < Date.now() - 3000){
        console.log("Sending...")
        sendCooldown = Date.now()
        backendEvent({ title: title, id: sessionId, content, responsesArray, parent })
    }else{
        console.warn("Send cooldown")
    }
}