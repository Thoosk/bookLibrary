function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = "";
  this.sayInfo = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.read ? "read" : "not read yet"
    }`;
  };
}

let myLibrary = [];

function addBookToLibrary(book) {
  myLibrary.push(book);
  populateStorage();
}

// let newBook = new Book("test", "author", 100, true);
// myLibrary.push(newBook);

let bookButton = document.querySelector("#adding-button");
let popUp = document.querySelector("#popup");

bookButton.addEventListener("click", () => {
  popUp.style.display = "block";
});
let bookSubmit = document.querySelector("#add-book");
bookSubmit.addEventListener("click", () => {
  popUp.style.display = "none";
  let title = document.querySelector("#title").value;
  let author = document.querySelector("#author").value;
  let pages = document.querySelector("#pages").value;
  let read = document.querySelector("#read").checked;

  if (myLibrary.some((elem) => elem.title == title)) {
    alert("Book is already in library");
    return;
  } else {
    let newBook = new Book(title, author, pages, read);
    addBookToLibrary(newBook);
    return;
  }
});

let bookList = document.querySelector("#book-list");

let bookInList = document.querySelector("#listing-button");
let alreadyDisplayed = [];
bookInList.addEventListener("click", () => {
  myLibrary.forEach((book) => {
    if (!alreadyDisplayed.some((element) => element.title == book.title)) {
      bookGenerator(book);
      alreadyDisplayed.push(book);
    }
    // if (!alreadyDisplayed.includes(book)) {
    //   bookGenerator(book);
    //   alreadyDisplayed.push(book);
    // }
  });

  removeButtons = Array.from(document.querySelectorAll(".remove"));
});

function bookGenerator(book) {
  let newListing = document.createElement("div");
  let h1Element = document.createElement("h1");
  h1Element.innerText = `${book.title}\n`;
  let h2Element = document.createElement("h2");
  h2Element.innerText = `${book.author}`;
  let pElement = document.createElement("p");
  pElement.innerText = `${book.pages} pages`;
  let buttonElement = document.createElement("button");
  buttonElement.innerText = "remove";
  buttonElement.type = "button";
  buttonElement.classList.add("remove");
  newListing.classList.add("book");
  let toggleElement = document.createElement("button");
  toggleElement.type = "button";
  toggleElement.setAttribute("id", "toggle");

  //adding a attribute to the book so we can identify it and delete it from the library
  let att = document.createAttribute("bookID");
  att.value = `${book.title.slice(-2)}${book.author.slice(-3)}${book.pages}`;
  buttonElement.setAttributeNode(att);
  book.id = att.value;
  newListing.setAttribute("id", `${att.value}`);

  //create a random number between 1 and 4 and take one of the 4 book designs
  let imgElement = document.createElement("img");
  let rndNumber = Math.floor(Math.random() * 4 + 1);
  switch (rndNumber) {
    case 1:
      imgElement.src = "images/book1.png";
      newListing.classList.add("book1");
      break;
    case 2:
      imgElement.src = "images/book2.png";
      newListing.classList.add("book2");
      break;
    case 3:
      imgElement.src = "images/book3.png";
      newListing.classList.add("book3");
      break;
    case 4:
      imgElement.src = "images/book4.png";
      newListing.classList.add("book4");
      break;
  }

  if (book.read) {
    toggleElement.classList.add("on");
  } else {
    toggleElement.classList.add("off");
  }

  buttonElement.addEventListener("click", (element) => {
    removeBookFromLibrary(element.target.attributes.bookid.nodeValue);
    removeBookFromList(
      element.target.parentElement,
      element.target.attributes.bookid.nodeValue
    );
  });

  toggleElement.addEventListener("click", (element) => {
    toggleReadStatus(
      element.target,
      element.target.previousElementSibling.attributes.bookid.value
    );
  });

  newListing.appendChild(h1Element);
  newListing.appendChild(h2Element);
  newListing.appendChild(pElement);
  newListing.appendChild(buttonElement);
  newListing.appendChild(toggleElement);
  newListing.appendChild(imgElement);
  bookList.appendChild(newListing);
}

function removeBookFromLibrary(buttonBookID) {
  const foundIndex = myLibrary.findIndex((book) => book.id === buttonBookID);
  const modifiedArray = myLibrary.splice(foundIndex, 1);
  populateStorage();
}

function removeBookFromList(buttonParent, buttonBookID) {
  const arrayBookList = Array.from(buttonParent.parentNode.children);
  const foundIndex = arrayBookList.findIndex(
    (entry) => entry.id == buttonBookID
  );
  bookList.removeChild(bookList.children[foundIndex]);
}

function toggleReadStatus(element, buttonBookID) {
  //toggle classes and the read status of the object
  const foundIndex = myLibrary.findIndex((book) => book.id === buttonBookID);
  if (element.classList[0] === "off") {
    element.classList.remove("off");
    element.classList.add("on");
    myLibrary[foundIndex].read = true;
  } else {
    element.classList.remove("on");
    element.classList.add("off");
    myLibrary[foundIndex].read = false;
  }
  populateStorage();
}

/// Storage

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    let x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      // everything except Firefox
      (e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        // everything except Firefox
        e.name === "QuotaExceededError" ||
        // Firefox
        e.name === "NS_ERROR_DOM_QUOTA_REACHED") &&
      // acknowledge QuotaExceededError only if there's something already stored
      storage &&
      storage.length !== 0
    );
  }
}

if (storageAvailable("localStorage")) {
  console.log("Local storage available");
  if (!localStorage.getItem("library")) {
    populateStorage();
    console.log("No Library here");
  } else {
    setLibrary();
    console.log("Library here");
  }
} else {
  console.log("No Local storage");
}

function populateStorage() {
  localStorage.setItem("library", JSON.stringify(myLibrary));
  setLibrary();
}

function setLibrary() {
  let savedLibrary = localStorage.getItem("library");
  myLibrary = JSON.parse(savedLibrary);
}

// localStorage.clear();
