import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCNRxRZFuPvDmor3PWhAm0SUC50WqNarHU",
  authDomain: "clinic-681cb.firebaseapp.com",
  projectId: "clinic-681cb",
  storageBucket: "clinic-681cb.appspot.com",
  messagingSenderId: "1017431600169",
  appId: "1:1017431600169:web:8f9f0404de6f889234c038",
  measurementId: "G-4MSZ14S4B2",
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
