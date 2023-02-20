import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: process.env.REACT_APP_APIKEY,                              //"AIzaSyDeIKnMlG_GnKHpbBoCifTdMV3wyaSxcS0",
  authDomain: process.env.REACT_APP_AUTHDOMAIN,                      //"sistemachamados-4c824.firebaseapp.com",
  projectId: process.env.REACT_APP_PROJECTID,                        //"sistemachamados-4c824",
  storageBucket: process.env.REACT_APP_STORAGEBUCKET,                //"sistemachamados-4c824.appspot.com",
  messagingSenderId: process.env.REACT_APP_MESSAGINGSENDERID,        //"717337151661",
  appId: process.env.REACT_APP_APPID,                                //"1:717337151661:web:634751df7516cfc99fde24",
  measurementId: process.env.REACT_APP_MEASUREMNETID,                //"G-51BVNY3SMD"
};
  

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }


