import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  projectId: "borrow-system-test",
  appId: "1:186042421844:web:9fdc88a0851933071413c1",
  apiKey: "AIzaSyDbIKwuHWGXFRoBINrnV_upzKtGZJw5Km8",
  authDomain: "borrow-system-test.firebaseapp.com",
  storageBucket: "borrow-system-test.firebasestorage.app",
  messagingSenderId: "186042421844",
  measurementId: "G-3Y4721YGB8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
