let container = document.getElementById('mobile')
let ul = document.createElement('ul')
container.appendChild(ul)
let sessionId = null

export async function createMobileInterface(id){
    if (id.charAt(0) !== "?"){
        console.log("erreur 404");
    }else {
        console.log(id);
        sessionId = id.slice(1)

        //DEBUG display session
        let h2 = document.createElement('h2')
        h2.textContent = sessionId.slice(17)
        container.appendChild(h2)
    }
}

export function displayList(list){
    while (ul.firstChild){
        ul.removeChild(ul.firstChild);
    }
    Object.values(list[sessionId]?.messages).map((item) => {
        let msg = document.createElement('li')
        msg.classList.add("msg")
        msg.textContent = item.msg
        ul.appendChild(msg)
    })
}