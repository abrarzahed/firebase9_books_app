<template>
  <div class="firebase-app">
    <h2>Getting started with firebase 9</h2>

    <h3>Firebase firestore</h3>

    <!-- **************************************** 
    COMMENT: Book list   
    ***************************************** -->
    <h4>Book List(collection) ⬇</h4>
    <div class="book-list">
      <div class="book" v-for="book in books" :key="book.id">
        <h4>TITLE: {{ book.title }}</h4>
        <p>AUTHOR: {{ book.author }}</p>
        <small>ID: {{ book.id }}</small>
        <i>{{ new Date(book.createdAt).toLocaleString() }}</i>
      </div>
    </div>

    <!-- **************************************** 
    COMMENT: Single book   
    ***************************************** -->
    <h4>Single book(Single data) ⬇</h4>
    <div class="book-list">
      <div class="book single">
        <h4>TITLE: {{ singleBook.title }}</h4>
        <p>AUTHOR: {{ singleBook.author }}</p>
        <small>ID: {{ singleBook.id }}</small>
        <i>{{ new Date(singleBook.createdAt).toLocaleString() }}</i>
      </div>
    </div>

    <div class="form-wrapper">
      <!-- **************************************** 
      COMMENT:  sign up   
      ***************************************** -->
      <form ref="signForm" class="add" @submit.prevent="signup">
        <h4>Sign up</h4>
        <label for="email">Email:</label>
        <input
          type="email"
          id="email"
          required
          placeholder="Enter email"
          v-model="auth.email"
          autocomplete="off"
        />
        <label for="pass">Password:</label>
        <input
          v-model="auth.pass"
          type="password"
          id="pass"
          required
          placeholder="Enter password"
          autocomplete="off"
        />
        <button type="submit">Signup</button>
        <button type="button" class="logout" @click="logoutUser">Logout</button>
      </form>

      <!-- **************************************** 
      COMMENT:  log in
      ***************************************** -->
      <form ref="signForm" class="add" @submit.prevent="login">
        <h4>Login</h4>
        <label>Email:</label>
        <input
          type="email"
          required
          placeholder="Enter email"
          v-model="log.email"
          autocomplete="off"
        />
        <label>Password:</label>
        <input
          v-model="log.pass"
          type="password"
          required
          placeholder="Enter password"
          autocomplete="off"
        />
        <button type="submit">Login</button>
      </form>

      <!-- **************************************** 
    COMMENT: Add book form   
    ***************************************** -->
      <form ref="addForm" class="add" @submit.prevent="addBook">
        <h4>Add Book</h4>
        <label for="title">Title:</label>
        <input
          type="text"
          id="title"
          required
          placeholder="Enter Book Title"
          v-model="book.title"
        />
        <label for="author">Author</label>
        <input
          v-model="book.author"
          type="text"
          id="author"
          required
          placeholder="Enter Author Name"
        />
        <button>Add Book</button>
      </form>

      <!-- **************************************** 
    COMMENT: Update book form   
    ***************************************** -->
      <form class="update" @submit.prevent="updateBook">
        <h4>Update Book</h4>
        <label for="update">Document ID:</label>
        <input
          v-model="updateBookId"
          type="text"
          id="update"
          placeholder="Book ID"
        />
        <button>Update Book</button>
      </form>

      <!-- **************************************** 
    COMMENT: Delete book form   
    ***************************************** -->
      <form ref="deleteForm" class="delete" @submit.prevent="deleteBook">
        <h4>Delete Book</h4>
        <label for="id">Document ID:</label>
        <input
          type="text"
          required
          v-model="deleteBookId"
          id="id"
          placeholder="Book ID"
        />
        <button>Delete a Book</button>
      </form>
    </div>
  </div>
</template>

<script setup>
/* 
   BLOCK: import
*/
import { onMounted, ref } from "vue";
import { colRef, q, booksCollectionsOrderRefs } from "@/firebase";
import {
  onSnapshot,
  addDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";

/* **************************************** 
COMMENT: References   
***************************************** */
const books = ref([]);

const book = ref({
  title: "",
  author: "",
});

const auth = ref({
  email: "",
  pass: "",
});
const log = ref({
  email: "",
  pass: "",
});

const singleBook = ref({});

const deleteBookId = ref("");

const updateBookId = ref("");

let addForm = ref(null);
let deleteForm = ref(null);

/* **************************************** 
COMMENT: life cycle hooks   
***************************************** */

onMounted(() => {
  /* 
    get collection data
  */

  /*
  getDocs(colRef)
    .then((snaps) => {
      snaps.docs.forEach((doc) => {
        books.value.push({ ...doc.data(), id: doc.id });
      });
      console.log(books.value);
    })
    .catch((err) => console.log("error message", err.message));
    */

  /* 
    real time collection data
  */

  onSnapshot(booksCollectionsOrderRefs, (snapshot) => {
    let tempBooks = [];
    snapshot.docs.forEach((doc) => {
      tempBooks.push({ ...doc.data(), id: doc.id });
    });
    books.value = tempBooks;
  });

  /* 
    get single book
  */
  const singleDocRef = doc(colRef, "NOwZDU8Iw2k1RtB8wYo8");
  /*
  getDoc(singleDocRef).then((doc) => {
    singleBook.value = doc.data();
    singleBook.value.id = doc.id;
  });
  */

  /* 
    Get real time single document
  */
  onSnapshot(singleDocRef, (doc) => {
    // console.log(doc.data(), doc.id);
    singleBook.value = doc.data();
    singleBook.value.id = doc.id;
  });

  /* 
    Authentication real time subscriptions
  */
  onAuthStateChanged(authUser, (user) => {
    console.log("user status changed", user);
  });
});

/* **************************************** 
COMMENT: Methods   
***************************************** */

/* 
  add a book
*/
const addBook = function () {
  addDoc(colRef, {
    title: book.value.title,
    author: book.value.author,
    // createdAt: serverTimestamp(), firebase own time stamp
    createdAt: Date.now(),
  }).then(() => {
    console.log("book is added");
    addForm.value.reset();
  });
};

/* 
  delete a book
*/
const deleteBook = function () {
  const deleteDocRef = doc(colRef, deleteBookId.value);
  deleteDoc(deleteDocRef).then(() => {
    deleteForm.value.reset();
    console.log("Item is deleted");
  });
};

/* 
  update a book
*/
const updateBook = function () {
  console.log("update book");
  const updateDocRef = doc(colRef, updateBookId.value);
  updateDoc(updateDocRef, {
    title: "This is book is updated",
  }).then(() => {
    console.log("Book is updated");
    updateBookId.value = "";
  });
};

/* 
  sign up
*/
const authUser = getAuth();
const signup = function () {
  console.log(auth);
  createUserWithEmailAndPassword(authUser, auth.value.email, auth.value.pass)
    .then((userObj) => {
      console.log("user created", userObj);
    })
    .catch((err) => {
      console.log("error auth", err.message);
    });
};

/* 
  Sign out
*/
const logoutUser = function () {
  signOut(authUser)
    .then(() => {
      // console.log("The user is sign out");
    })
    .catch((err) => console.log(err.message));
};

/* 
  Login
*/
const login = function () {
  signInWithEmailAndPassword(authUser, log.value.email, log.value.pass)
    .then((userObj) => {
      // console.log("user logged in", userObj);
    })
    .catch((err) => console.log(err.message));
};
</script>

<style>
* {
  box-sizing: border-box;
  font-family: sans-serif;
  color: #444;
  letter-spacing: 0.02em;
}
.firebase-app {
  max-width: 800px;
  background: #efefef;
  padding: 2em;
  margin: 50px auto;
}
.form-wrapper {
  margin-top: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
form {
  background: #fff;
  padding: 1em;
  width: 100%;
  flex-basis: 48%;
  justify-content: space-between;
}
label,
input {
  display: block;
  width: 100%;
}
input {
  padding: 0.6rem;
  margin: 0.7rem 0;
}
button {
  padding: 0.8rem 1.5rem;
  background: rgb(72, 85, 196);
  border: none;
  color: #fff;
  cursor: pointer;
  margin-top: 0.6rem;
}
.logout {
  display: inline-block;
  margin-left: 1rem;
}
button:active {
  opacity: 0.8;
}
.book-list,
.book-list * {
  margin: 0;
}
.book {
  margin: 0.5rem 0;
  background: rgba(97, 248, 97, 0.205);
  padding: 1rem;
  display: grid;
  gap: 8px;
}
.book.single {
  background: rgba(253, 81, 201, 0.144);
}
</style>
