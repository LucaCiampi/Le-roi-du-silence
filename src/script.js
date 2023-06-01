import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove, onValue, push, set, update, get } from "firebase/database";
import QRCode from 'qrcode';

import texts from "./texts.json" assert { type: "json" };

const domUserNumber = document.getElementById('userNumber')
const startButton = document.getElementById('startButton')
let users = {}
let interlocutors = ["prof", "bff"/*, "mom", "rand"*/]
startButton.onclick = () => startGame()

const firebaseConfig = {
  databaseURL: "https://webgl-ed2ec-default-rtdb.europe-west1.firebasedatabase.app/",
};

const isMobile = window.location.search.length != 0
let currentSession = null
let mobile = null
let userNumber = 0
let baseUrl = "192.168.130.19:5173"
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
    if (item.alive < Date.now() - 15000 || !item.alive) {
      remove(ref(database, 'sessions/' + key))
    }
  })
  
  //display msgs on mobile
  if (isMobile) {
    mobile?.displayList(data)
  }
  
  //display connected users number
  if (!isMobile) {
    if (data[currentSession].users != null) {
      let currentNumber = Object.keys(data[currentSession].users).length
      if (currentNumber != userNumber) {
        userNumber = currentNumber
        Object.values(data[currentSession].users).forEach(element => {
          console.log(element.userName);
        });
        domUserNumber.textContent = `Nombre d'utilisateurs : ${userNumber}`
      }
    }
  }
});

function createSession() {
  currentSession = push(ref(database, 'sessions/'), {
    alive: Date.now()
  }).key;
  interlocutors.forEach(interlocutor => {
    push(ref(database, `sessions/${currentSession}/messages/`), {
      msg: texts[0][interlocutor].trigger,
      foreign: true,
      interlocutor: interlocutor,
      time: Date.now()
    })
    let options = texts[0][interlocutor].answers.map((answer) => {
      return answer.preview
    })
    push(ref(database, `sessions/${currentSession}/responses/`), {
      options: options,
      interlocutor: interlocutor,
      parent: texts[0][interlocutor].trigger
    })
  });
  
  //DEBUG display session
  let p = document.createElement('p')
  p.textContent = currentSession.slice(17)
  document.getElementById('container').appendChild(p)
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
      console.log('users', users)
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
    let answers = texts["prof"].find(({ trigger }) => trigger === event.parent).answers
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
      msg: texts[roomId]["prof"].trigger,
      foreign: true,
      time: Date.now()
    })
    let options = texts[roomId]["prof"].answers.map((answer) => {
      return answer.preview
    })
    set(ref(database, `sessions/${currentSession}/responses/`), {
      options: options,
      parent: texts[roomId]["prof"].trigger
    })
  }
}

if (isMobile) {
  import('./mobile').then(script => {mobile = script
    mobile?.createMobileInterface(window.location.search, handleDesktopEvent, createMobileSession)
  })
  document.querySelector('canvas.webgl').remove()
} else {
  import('./Experience/Experience').then(desktop => desktop.createExperience(document.querySelector('canvas.webgl'), handleDesktopEvent))
  createSession()
}