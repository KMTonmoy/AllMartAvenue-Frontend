import { initializeApp, FirebaseApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCOd5En0j13sEZyOz2wZJpHpdwiXr_qkFU",
  authDomain: "allmart-641c8.firebaseapp.com",
  projectId: "allmart-641c8",
  storageBucket: "allmart-641c8.appspot.com",
  messagingSenderId: "1021147851413",
  appId: "1:1021147851413:web:2cc34477d5850fd2a5899c"
};

export const app: FirebaseApp = initializeApp(firebaseConfig);