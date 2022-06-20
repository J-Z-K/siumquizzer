// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword,
} from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyClnd2O7lkacB8GErLSBnL6IR2i4tYzWDs',
  authDomain: 'siumquizerv2.firebaseapp.com',
  projectId: 'siumquizerv2',
  databaseURL: 'https://siumquizerv2-default-rtdb.europe-west1.firebasedatabase.app',
  storageBucket: 'siumquizerv2.appspot.com',
  messagingSenderId: '1017529052206',
  appId: '1:1017529052206:web:bb68a2153cc839355903bf',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);

// export const register = (email, password) => {
//   createUserWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const { user } = userCredential;
//       return user;
//     })
//     .catch((error) => {
//       const errorMessage = error.message;
//     });
// };
// export const login = (email, password) => {
//   signInWithEmailAndPassword(auth, email, password)
//     .then((userCredential) => {
//       const { user } = userCredential;
//       return user;
//     })
//     .catch((error) => {
//       const errorMessage = error.message;
//       console.log(errorMessage);
//     });
// };

// onAuthStateChanged(auth, (user) => {
//   if (user) {
//     // User is signed in, see docs for a list of available properties
//     // https://firebase.google.com/docs/reference/js/firebase.User
//     // const { uid } = user;
//     console.log(user);
//     // ...
//   } else {
//     // User is signed out
//     // ...
//   }
// });
