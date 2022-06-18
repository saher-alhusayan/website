
import { initializeApp } from "./node_modules/firebase/app";
import { getDatabase, ref, onValue, set, child, get } from "./node_modules/firebase/database";

// for now this is ok, in future this should be moved somewhere hidden
const firebaseConfig = {
    apiKey: "AIzaSyBkTMMxaCzC3FWGkmmDjXawStoYHFP1ENg",
    authDomain: "my-website-872e4.firebaseapp.com",
    databaseURL: "https://my-website-872e4-default-rtdb.firebaseio.com",
    projectId: "my-website-872e4",
    storageBucket: "my-website-872e4.appspot.com",
    messagingSenderId: "211720057725",
    appId: "1:211720057725:web:b052b9e9cad2dfb51dd214",
    measurementId: "G-HJWZJQ8HJS"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function addComment(blogTitle, name, comment) {
    let dayjs = require('dayjs'),
        utc = require('dayjs/plugin/utc');
    dayjs.extend(utc);
    dayjs.utc();
    const now = dayjs()
    set(ref(database, 'comments/' + `${hashCode(blogTitle)}}/` + now), {
        blog: blogTitle,
        name: name,
        comment: comment,
        createdAt: now.format('MMMM D, YYYY h:mm:ss A')
    });
}


//comments
function hashCode(string) {
    var hash = 0,
        i,
        chr;
    if (string.length === 0) return hash;
    for (i = 0; i < string.length; i++) {
        chr = string.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}


let commentsForm = document.querySelector('.commentsForm');
if (commentsForm) {
    commentsForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = commentsForm.name.value;
        const comment = commentsForm.comment.value;
        if (name == null || name == "" || name.trim().length === 0 || comment == null || comment == "" || comment.trim().length === 0) {
            alert("Please Fill All Required Field");
        };
        const blogTitle = document.getElementsByTagName("title")[0].innerHTML
        addComment(blogTitle, name, comment);
        commentsForm.reset();

        const dbRef = ref(getDatabase(app));
        get(child(dbRef, `comments/${hashCode(blogTitle)}}`)).then((snapshot) => {
            if (snapshot.exists()) {
                let commentsSection = document.querySelector('.commentsSection');
                let divs = [];
                for (const [key, comment] of Object.entries(snapshot.val())) {
                    divs.push(`<div class="single-comment">
                <header>
                                                    <h2 class="single-comment-header1">${comment.name}</h2>
                                                    <h3 class="single-comment-header2">Published on ${comment.createdAt} </h3>
                                                    <hr class="separator"/>
                                                </header><br>
            
                <p class="single-comment-text">${comment.comment}</p>
            </div><br>`);
                };
                commentsSection.innerHTML = divs.join("");
                let comments = document.querySelector('.comments-section');
                comments.scrollIntoView({ behavior: "smooth" });
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });


    });
};


window.onload = function () {

    const blogTitle = document.getElementsByTagName("title")[0].innerHTML
    const dbRef = ref(getDatabase(app));
    get(child(dbRef, `comments/${hashCode(blogTitle)}}`)).then((snapshot) => {
        if (snapshot.exists()) {
            let commentsSection = document.querySelector('.commentsSection');
            let divs = [];
            for (const [key, comment] of Object.entries(snapshot.val())) {
                divs.push(`<div class="single-comment">
            <header>
                                                <h2 class="single-comment-header1">${comment.name}</h2>
                                                <h3 class="single-comment-header2">Published on ${comment.createdAt} </h3>
                                                <hr class="separator"/>
                                            </header><br>
        
            <p class="single-comment-text">${comment.comment}</p>
        </div><br>`);
            };
            commentsSection.innerHTML = divs.join("");
        };
    });
}


// get in touch

function addContactRequest(name, email, message) {
    let dayjs = require('dayjs'),
        utc = require('dayjs/plugin/utc');
    dayjs.extend(utc);
    dayjs.utc();
    const now = dayjs()
    set(ref(database, 'contact/' + now), {
        name: name,
        email: email,
        message: message,
        createdAt: now.format('MMMM D, YYYY h:mm:ss A')
    });
}

let contactForm = document.querySelector('.contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', event => {
        let dayjs = require('dayjs'),
            utc = require('dayjs/plugin/utc');
        dayjs.extend(utc);
        dayjs.utc();
        const now = dayjs().format('MMMM D, YYYY h:mm:ss A');
        event.preventDefault();
        const name = contactForm.name.value;
        const email = contactForm.email.value;
        const message = contactForm.message.value;
        if (name == null || name == "" || name.trim().length === 0 || email == null || email == "" || email.trim().length === 0 || message == null || message == "" || message.trim().length === 0) {
            alert("Please Fill All Required Field");
        } else {
            addContactRequest(name, email, message);
            contactForm.reset();
            alert("Thanks for your message!");
        };
    });
};
