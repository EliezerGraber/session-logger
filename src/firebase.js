import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

const firebase_app = firebase.initializeApp({
    apiKey: "AIzaSyDwjP_Mh6zqmdhZw645sBjnqsoDHQYO9F0",
    authDomain: "session-logger-4492b.firebaseapp.com",
    projectId: "session-logger-4492b",
    storageBucket: "session-logger-4492b.appspot.com",
    messagingSenderId: "638044270185",
    appId: "1:638044270185:web:8a9c56022adef139c0fcf8"
});

const db = firebase.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
 export { db, auth, provider };