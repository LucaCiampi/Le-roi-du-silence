import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove, onValue, push, set, update, get } from "firebase/database";
import QRCode from 'qrcode';

import texts from "./texts.json" assert { type: "json" };

const domUserNumber = document.getElementById('userNumber')
const domUserList = document.getElementById('userList')
const startButton = document.getElementById('startButton')
startButton.onclick = () => startGame()
let users = {}
let interlocutors = ["prof", "bff", "mom", "rand"]
let score = 0

const firebaseConfig = {
  databaseURL: "https://webgl-ed2ec-default-rtdb.europe-west1.firebasedatabase.app/",
};

const isMobile = window.location.search.length != 0
let currentSession = null
let mobile = null
let desktop = null
let userNumber = 0
let baseUrl = "172.28.59.104:5173"
// let baseUrl = "brume.surge.sh"

//firebase config
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

//event on sessions modified
onValue(ref(database, 'sessions/'), (snapshot) => {
  const data = snapshot.val();
  if (!data) return

  //delete old sessions
  Object.keys(data).map((key) => {
    let item = data[key]
    if (item.alive < Date.now() - 15000 || !item.alive) {
      remove(ref(database, 'sessions/' + key))
    }
  })

  //display msgs on mobile
  if (isMobile) {
    mobile?.getData(data)
  }

  //display connected users number
  if (!isMobile) {
    if (data[currentSession].users != null) {
      let currentNumber = Object.keys(data[currentSession].users).length
      if (currentNumber != userNumber) {
        userNumber = currentNumber
        while (domUserList.firstChild) {
          domUserList.removeChild(domUserList.firstChild);
        }
        Object.values(data[currentSession].users).forEach(element => {
          let li = document.createElement('li')
          li.textContent = element.userName
          domUserList.appendChild(li)
        });
        domUserNumber.textContent = `Utilisateurs connectés : ${userNumber}/4`
      }
    }
  }

  //display connected users number
  if (!isMobile) {
    if (data[currentSession].users != null) {
      let currentNumber = Object.keys(data[currentSession].users).length
      if (currentNumber != userNumber) {
        userNumber = currentNumber
        domUserNumber.textContent = `Nombre d'utilisateurs : ${userNumber}`
      }
    }
  }

  //update score
  if (!mobile && data[currentSession].score) {
    let newScore = Object.keys(data[currentSession].score)?.length
    if (newScore != score) {
      score = newScore
      desktop.increaseScore()
    }
  }
});

function createSession() {
  currentSession = push(ref(database, 'sessions/'), {
    alive: Date.now()
  }).key;
  interlocutors.forEach(interlocutor => {
    push(ref(database, `sessions/${currentSession}/messages/`), {
      msg: texts[interlocutor][0].trigger,
      foreign: true,
      interlocutor: interlocutor,
      time: Date.now()
    })
    let options = texts[interlocutor][0].answers.map((answer) => {
      return answer.preview
    })
    push(ref(database, `sessions/${currentSession}/responses/`), {
      parent: texts[interlocutor][0].trigger,
      options: options,
      interlocutor: interlocutor
    })
  });

  //DEBUG display session
  let p = document.createElement('a')
  p.textContent = currentSession
  p.href = "http://localhost:5173/?" + currentSession
  p.target = "_blank"
  p.style.position = "absolute"
  p.style.right = 0
  p.style.top = 0
  document.getElementById('introMenu').appendChild(p)
  displayQrCode(currentSession)

  //set ping
  setInterval(() => {
    update(ref(database, `sessions/${currentSession}/`), {
      alive: Date.now()
    })
  }, 5000);
}

function startGame() {
  get(ref(database)).then((snapshot) => {
    if (snapshot.exists()) {
      users = snapshot.val().sessions[currentSession].users;
      if (!users) return
      for (let i = 0; i < Object.keys(users).length; i++) {
        const userId = Object.keys(users)[i];
        update(ref(database, `sessions/${currentSession}/users/${userId}`), {
          assignedInterlocutor: interlocutors[i]
        })
      }
    } else {
      console.log("No data available");
    }
  }).catch((error) => {
    console.error(error);
  });
}

function createMobileSession(name, callback) {
  callback(push(ref(database, `sessions/${window.location.search.slice(1)}/users/`), {
    userName: name,
    assignedInterlocutor: null,
    time: Date.now()
  }).key)
}

function displayQrCode(key) {
  var canvas = document.getElementById('qrcode')
  QRCode.toCanvas(canvas, `http://${baseUrl}/?${key}`, function (error) {
    if (error) console.error(error)
  })
}

//callback on desktop to transmit events to backend
function handleDesktopEvent(event) {
  console.log('event : ', event)
  if (event?.title === "response") {
    let JSONcontent = texts[event.interlocutor]?.find(({ trigger }) => trigger === event.parent).answers.find(({ preview }) => preview === event.content)

    if (JSONcontent.score == 1) {
      push(ref(database, `sessions/${event.id}/score`), {
        score: 1
      })
    }

    let content = JSONcontent.content
    push(ref(database, `sessions/${event.id}/messages/`), {
      msg: content,
      foreign: false,
      time: Date.now(),
      interlocutor: event.interlocutor
    })

    //remove the response from the choices
    event.responsesArray.splice(event.responsesArray.indexOf(event.content), 1)
    console.log('event.responsesArray', event.responsesArray)
    set(ref(database, `sessions/${event.id}/responses/${event.responseId}`), {
      options: event.responsesArray,
      parent: event.parent,
      interlocutor: event.interlocutor
    })

    //push the answers
    let answers = JSONcontent.answers
    let delay = 1000
    answers.forEach((answer) => {
      delay += answer.length * 50
      setTimeout(() => {
        push(ref(database, `sessions/${event.id}/messages/`), {
          msg: answer,
          foreign: true,
          time: Date.now(),
          interlocutor: event.interlocutor
        })
      }, delay);
    });
  }

  // if (event?.title.includes("room")) {
  //   let roomId = event.slice(4, 5)
  //   remove(ref(database, `sessions/${currentSession}/responses/`))
  //   interlocutors.forEach(inter => {
  //     push(ref(database, `sessions/${currentSession}/messages/`), {
  //       msg: texts[inter][roomId].trigger,
  //       foreign: true,
  //       time: Date.now(),
  //       interlocutor: inter
  //     })
  //     let options = texts[inter][roomId].answers.map((answer) => {
  //       return answer.preview
  //     })
  //     push(ref(database, `sessions/${currentSession}/responses/`), {
  //       options: options,
  //       parent: texts[inter][roomId].trigger,
  //       interlocutor: inter
  //     })
  //   });
  // }
  if (event?.title == "zone") {
    if (event.id == 0) {
      interlocutors.forEach(inter => {
        push(ref(database, `sessions/${currentSession}/messages/`), {
          msg: "J'ai trouvé ça :",
          foreign: false,
          time: Date.now(),
          interlocutor: inter
        })
      });
    } else {
      interlocutors.forEach(inter => {
        if (texts[inter][event.id]?.trigger) {
          remove(ref(database, `sessions/${currentSession}/responses/`))
          push(ref(database, `sessions/${currentSession}/messages/`), {
            msg: texts[inter][event.id].trigger,
            foreign: true,
            time: Date.now(),
            interlocutor: inter
          })
          let options = texts[inter][event.id].answers.map((answer) => {
            return answer.preview
          })
          push(ref(database, `sessions/${currentSession}/responses/`), {
            options: options,
            parent: texts[inter][event.id].trigger,
            interlocutor: inter
          })
        }
      })
    }
  }
}

if (isMobile) {
  import('./mobile').then(script => {
    mobile = script
    mobile?.createMobileInterface(window.location.search, handleDesktopEvent, createMobileSession)
  })
  document.getElementById('container').remove()
  var link = document.querySelector("link[rel~='icon']");
  link.href = "data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📱</text></svg>"
} else {
  import('./Experience/Experience').then(script => {
    desktop = script
    desktop.createExperience(document.querySelector('canvas.webgl'), handleDesktopEvent)
  })
  createSession()
}
