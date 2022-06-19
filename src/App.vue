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

    <!-- **************************************** 
    COMMENT: Add book form   
    ***************************************** -->
    <form ref="addForm" class="add" @submit.prevent="addBook">
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
    COMMENT: Delete book form   
    ***************************************** -->
    <form ref="deleteForm" class="delete" @submit.prevent="deleteBook">
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
} from "firebase/firestore";

/* **************************************** 
COMMENT: References   
***************************************** */
const books = ref([]);

const book = ref({
  title: "",
  author: "",
});

const singleBook = ref({});

const deleteBookId = ref("");

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
  getDoc(singleDocRef).then((doc) => {
    singleBook.value = doc.data();
    singleBook.value.id = doc.id;
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
</script>

<style>
* {
  box-sizing: border-box;
  font-family: sans-serif;
  color: #444;
  letter-spacing: 0.02em;
}
.firebase-app {
  max-width: 600px;
  background: #efefef;
  padding: 2em;
  margin: 50px auto;
}
form {
  background: #fff;
  padding: 1em;
  width: 100%;
  margin: 2rem auto;
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
