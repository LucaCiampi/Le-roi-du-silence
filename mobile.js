let container = document.getElementById('mobile')
let ul = document.createElement('ul')
container.appendChild(ul)

let sessionId = null

export function init(id) {
    if (id.charAt(0) !== "?"){
        console.log("erreur 404");
    }else {
        console.log(id);
        sessionId = id.slice(1)
    }
}

export function displayList(list){
    while (ul.firstChild) {
        ul.removeChild(ul.firstChild);
    }
    list[sessionId].messages.map((item) => {
        let msg = document.createElement('li')
        msg.classList.add("msg")
        msg.textContent = item
        ul.appendChild(msg)
    })
}
