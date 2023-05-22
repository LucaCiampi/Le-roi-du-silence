let msgs = document.getElementById("msgs");
let topBar = document.getElementById("title");
let responsesContainer = document.getElementById("responses");

let sessionId = null;
let backendEvent = null

export function createMobileInterface(id, handleBackendEvent) {
    backendEvent = handleBackendEvent
    if (id.charAt(0) !== "?") {
        topBar.textContent = "Erreur 404";
    } else {
        sessionId = id.slice(1);
        topBar.textContent = sessionId.slice(17);
    }
    let msg = document.createElement("div");
    msg.classList.add("msg", "info");
    msg.textContent = "Chargement...";
    msgs.appendChild(msg);
    // document.getElementById('send').onclick = () => sendAnything()
}

export function displayList(list) {
    while (msgs.firstChild) {
        msgs.removeChild(msgs.firstChild);
    }
    let msg = document.createElement("div");
    msg.classList.add("msg", "info");
    msg.textContent = "Début de la conversation avec Léa";
    msgs.appendChild(msg);
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
            msgs.appendChild(msg);
        });

        let responses = list[sessionId]?.responses?.options;
        if (!responses) responses = []
        if (responses) {
            while (responsesContainer.firstChild) {
                responsesContainer.removeChild(responsesContainer.firstChild);
            }
            console.log(responses);
            responses.map((response) => {
                let msg = document.createElement("div");
                msg.classList.add("response");
                msg.onclick = () => sendAnything("response", response, responses)
                msg.textContent = response;
                responsesContainer.appendChild(msg);
            })
        }
    } else {
        let msg = document.createElement("div");
        msg.classList.add("msg", "info");
        msg.textContent = "Impossible de récupérer les messages :/";
        msgs.appendChild(msg);
    }
    document.getElementById('msgsContainer').scrollTop = 9999
}

function sendAnything(title, content, responsesArray) {
    responsesArray.splice(responsesArray.indexOf(content), 1)
    backendEvent({ title: title, id: sessionId, content, responsesArray })
}