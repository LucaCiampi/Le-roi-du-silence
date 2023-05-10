let container = document.getElementById("mobile");
let msgs = document.getElementById("msgs");
let topBar = document.getElementById("title");

let sessionId = null;

export function createMobileInterface(id) {
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
        let data = Object.values(list[sessionId]?.messages);
        data.map((item, i) => {
            let msg = document.createElement("div");
            msg.classList.add("msg");
            if (item.foreign) {
                msg.classList.add("foreign");
            }
            if (i == data.length - 1) {
                msg.classList.add("last");
            }
            msg.textContent = item.msg;
            msgs.appendChild(msg);
        });
    } else {
        let msg = document.createElement("div");
        msg.classList.add("msg", "info");
        msg.textContent = "Impossible de récupérer les messages :/";
        msgs.appendChild(msg);
    }
    document.getElementById('msgsContainer').scrollTop = 999
}
