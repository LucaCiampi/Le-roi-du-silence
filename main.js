import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove, onValue, push, update, child } from "firebase/database";

import QRCode from 'qrcode';

import * as desktop from './desktop'
import * as mobile from './mobile'

const firebaseConfig = {
  databaseURL: "https://webgl-ed2ec-default-rtdb.europe-west1.firebasedatabase.app/",
};

let currentSession = null

//firebase config
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const sessions = ref(database, 'sessions/');

//envent on sessions modified
onValue(sessions, (snapshot) => {
  const data = snapshot.val();
  
  //delete old sessions
  Object.keys(data).map((key) => {
    let item = data[key]
    if (item.creationDate < Date.now() - 30000){
      remove(ref(database, 'sessions/' + key))
    }
  })

  //display msgs on mobile
  mobile.displayList(data)
});

function createSession(){
  currentSession = push(ref(database, 'sessions/'), {
    creationDate: Date.now()
  }).key;
  push(ref(database, `sessions/${currentSession}/messages/`), {
    msg : "bonjour"
  })

  //DEBUG display session
  let p = document.createElement('p')
  p.textContent = currentSession.slice(17)
  document.getElementById('container').appendChild(p)
  displayQrCode(currentSession)
}

function displayQrCode(key){
  var canvas = document.getElementById('qrcode')
  QRCode.toCanvas(canvas, `http://192.168.130.19:5173/?${key}`, function (error){
    if (error) console.error(error)
  })
}

//callback on desktop to transmit events to backend
function handleDesktopEvent(event){
  console.log('event', event)
  if (event === "green zone"){
    push(ref(database, `sessions/${currentSession}/messages/`), {
      msg : "green zone message"
    })
  }
}

// function getData(id){
//   return new Promise(resolve => {
//     get(ref(database, `sessions/${id}/messages/`)).then((snapshot) => {
//       if (snapshot.exists()){
//         setTimeout(() => {
          
//           resolve(snapshot.val());
//         }, 1000);
//       }
//     }).catch((error) => {
//       resolve(error)
//     });
//   })
// }

if (/Android|iPhone/i.test(navigator.userAgent)){  //client is mobile
  document.getElementById('container').remove()
  mobile.createMobileInterface(window.location.search)
}else{                                              //client is desktop
  document.getElementById('mobile').remove()
  desktop.createWebGl(handleDesktopEvent)
  createSession()
}


