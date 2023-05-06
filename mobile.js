let container = document.getElementById('mobile')
let ul = document.createElement('ul')
container.appendChild(ul)

let sessionId = null

export function createMobileInterface(id, data){
    console.log('data', data)
    let h2 = document.createElement('h2')
    if (id.charAt(0) !== "?"){
        h2.textContent = "Erreur 404"
    }else {
        console.log(id);
        sessionId = id.slice(1)

        h2.textContent = sessionId.slice(17)
    }
    container.appendChild(h2)
}

export function displayList(list){
    while (ul.firstChild){
        ul.removeChild(ul.firstChild);
    }
    if (list[sessionId]){
        let data = Object.values(list[sessionId]?.messages)
        data.map((item, i) => {
            let msg = document.createElement('li')
            msg.classList.add("msg")
            if (i == data.length-1){
                msg.classList.add("last")
            }
            msg.textContent = item.msg
            ul.appendChild(msg)
        })
    }else{
        let msg = document.createElement('li')
            msg.classList.add("msg")
            msg.textContent = "404"
            ul.appendChild(msg)
    }
}