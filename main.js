import { initializeApp } from 'firebase/app';
import { getDatabase, ref, remove, onValue, push, set } from "firebase/database";

import * as desktop from './desktop'
import * as mobile from './mobile'

mobile.init(window.location.search)

const firebaseConfig = {
  databaseURL: "https://webgl-ed2ec-default-rtdb.europe-west1.firebasedatabase.app/",
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const sessions = ref(database, 'sessions/');
onValue(sessions, (snapshot) => {
  const data = snapshot.val();
  
  //delete old sessions
  Object.keys(data).map((key) => {
    let item = data[key]
    if (item.creationDate < Date.now() - 30000) {
      remove(ref(database, 'sessions/' + key))
    }
  })

  //display msgs on mobile
  mobile.displayList(data)
});

function createSession(messages, creationDate) {
  push(ref(database, 'sessions/'), {
    messages,
    creationDate
  });
}

createSession(["coucou", "je"], Date.now())


if (/Android|iPhone/i.test(navigator.userAgent)) {
  document.getElementById('container').remove()
}else{
  document.getElementById('mobile').remove()
}


