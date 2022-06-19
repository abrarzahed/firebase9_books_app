/* 
   import firebase functions
*/
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
} from "firebase/firestore";

/* 
   firebase configuration
*/
const firebaseConfig = {
  apiKey: "AIzaSyBhAeuuII8Ljj7ymimoYvcFbM7_dVwn92A",
  authDomain: "fir-dojo-5cd54.firebaseapp.com",
  projectId: "fir-dojo-5cd54",
  storageBucket: "fir-dojo-5cd54.appspot.com",
  messagingSenderId: "221693972013",
  appId: "1:221693972013:web:a5100d07d115f007ccb2a4",
};

/* 
   init firebase app
*/
initializeApp(firebaseConfig);

/* 
   init firebase service
*/
const db = getFirestore();

/* 
   collection ref : reference of collection of data. In this case it is books.
*/
const colRef = collection(db, "books");

/* 
   BLOCK: Query : to get filtered data. In this case books if author name is abrar
*/
const q = query(colRef, where("author", "==", "abrar"));

/* 
   BLOCK: Books Collections Order Refs : to get assenting or descending ordered data.
*/
const booksCollectionsOrderRefs = query(colRef, orderBy("createdAt", "desc"));

export { colRef, q, booksCollectionsOrderRefs };
