import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove, onValue, push, set } from "firebase/database";
import QRCode from 'qrcode';

import texts from "./texts.json" assert { type: "json" };

const firebaseConfig = {
  databaseURL: "https://webgl-ed0ec-default-rtdb.europe-west1.firebasedatabase.app/",
};

const isMobile = /Android|iPhone/i.test(navigator.userAgent)
let currentSession = null
let baseUrl = "172.28.59.104:5173"
// let baseUrl = "brume.surge.sh"

//firebase config
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const sessions = ref(database, 'sessions/');

//event on sessions modified
onValue(sessions, (snapshot) => {
  const data = snapshot.val();

  //delete old sessions
  Object.keys(data).map((key) => {
    let item = data[key]
    if (item.creationDate < Date.now() - 90000 || !item.creationDate) {
      remove(ref(database, 'sessions/' + key))
    }
  })

  //display msgs on mobile
  if (isMobile) {
    import('./mobile').then(mobile => mobile.displayList(data))
  }
});

function createSession() {
  currentSession = push(ref(database, 'sessions/'), {
    creationDate: Date.now()
  }).key;
  push(ref(database, `sessions/${currentSession}/messages/`), {
    msg: texts[0].trigger,
    foreign: true,
    time: Date.now()
  })
  let options = texts[0].answers.map((answer) => {
    return answer.preview
  })
  set(ref(database, `sessions/${currentSession}/responses/`), {
    options: options,
    parent: texts[0].trigger
  })

  //DEBUG display session
  let p = document.createElement('p')
  p.textContent = currentSession.slice(17)
  document.getElementById('container').appendChild(p)
  displayQrCode(currentSession)
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
    push(ref(database, `sessions/${event.id}/messages/`), {
      msg: event?.content,
      foreign: false,
      time: Date.now()
    })

    //remove the response from the choices
    let responsesArray = event.responsesArray.splice(event.responsesArray.indexOf(event.content), 1)
    set(ref(database, `sessions/${event.id}/responses/`), {
      options: event.responsesArray,
      parent: event.parent
    })

    //push the answers
    let answers = texts.find(
      ({ trigger }) => trigger === event.parent
    ).answers.find(
      ({ preview }) => preview === event.content
    ).answers

    answers.forEach((answer, i) => {
      setTimeout(() => {
        push(ref(database, `sessions/${event.id}/messages/`), {
          msg: answer,
          foreign: true,
          time: Date.now()
        })
      }, i * 1500 + Math.random() * 1000);
    });
  }

  if (event?.includes("room")) {
    let roomId = event.slice(4, 5)
    push(ref(database, `sessions/${currentSession}/messages/`), {
      msg: texts[roomId].trigger,
      foreign: true,
      time: Date.now()
    })
    let options = texts[roomId].answers.map((answer) => {
      return answer.preview
    })
    set(ref(database, `sessions/${currentSession}/responses/`), {
      options: options,
      parent: texts[roomId].trigger
    })
  }
}

if (isMobile) {
  import('./mobile').then(mobile => mobile.createMobileInterface(window.location.search, handleDesktopEvent))
} else {
  import('./Experience/Experience').then(desktop => desktop.createExperience(document.querySelector('canvas.webgl'), handleDesktopEvent))
  createSession()
}


