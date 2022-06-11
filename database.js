// initialising databases
let Datastore = require('nedb')
    , contact_db = new Datastore({ filename: 'contactDB.db' });

let comments_db = new Datastore({ filename: 'commentsDB.db' });


contact_db.loadDatabase(function (error) {
    if (error) {
        console.log('Could not load contact database. Error: ' + error);
        throw error;
    }
    console.log('Contact database loaded successfully.');
});

comments_db.loadDatabase(function (error) {
    if (error) {
        console.log('Could not load comments database. Error: ' + error);
        throw error;
    }
    console.log('Comments database loaded successfully.');
});

function insertToDatabase(database, _data) {
    return database.insert(_data, function (error, newDoc) {
        if (error) {
            console.log('Error saving document: ' + JSON.stringify(newDoc) + '. Error: ' + error);
            throw error;
        }
        console.log('Successfully saved document: ' + JSON.stringify(newDoc));
    });
}

// comments


let commentsForm = document.querySelector('.commentsForm');
if (commentsForm) {
    commentsForm.addEventListener('submit', event => {
        let dayjs = require('dayjs'),
            utc = require('dayjs/plugin/utc');
        dayjs.extend(utc);
        dayjs.utc();
        const now = dayjs().format('MMMM D, YYYY h:mm:ss A');
        event.preventDefault();
        const name = commentsForm.name.value;
        const comment = commentsForm.comment.value;
        if (name == null || name == "" || name.trim().length === 0 || comment == null || comment == "" || comment.trim().length === 0) {
            alert("Please Fill All Required Field");
        };
        const blogTitle = document.getElementsByTagName("title")[0].innerHTML
        insertToDatabase(comments_db, {
            blog: blogTitle,
            createdAt: now,
            name: name,
            comment: comment,
        });
        commentsForm.reset();
        comments_db.find({ blog: blogTitle }).sort({ createdAt: -1 }).exec(function (error, docs) {
            if (error) {
                console.log('Error finding document' + '. Error: ' + error);
                throw error;
            }
            let commentsSection = document.querySelector('.commentsSection');
            let divs = docs.map(doc =>
                `<div class="single-comment">
        <header>
											<h2 class="single-comment-header1">${doc.name}</h2>
											<h3 class="single-comment-header2">Published on ${doc.createdAt} </h3>
                                            <hr class="separator"/>
										</header><br>
    
        <p class="single-comment-text">${doc.comment}</p>
    </div><br>`);
            commentsSection.innerHTML = divs.join("");
        });
        let comments = document.querySelector('.comments-section');
        comments.scrollIntoView({ behavior: "smooth" });
    });
};

window.onload = function () {

    const blogTitle = document.getElementsByTagName("title")[0].innerHTML
    comments_db.find({ blog: blogTitle }).sort({ createdAt: -1 }).exec(function (error, docs) {
        if (error) {
            console.log('Error finding document' + '. Error: ' + error);
            throw error;
        }
        let commentsSection = document.querySelector('.commentsSection');
        if (commentsSection) {
            let divs = docs.map(doc =>
                `<div class="single-comment">
        <header>
											<h2 class="single-comment-header1">${doc.name}</h2>
											<h3 class="single-comment-header2">Published on ${doc.createdAt}</h3>
                                            <hr class="separator"/>
										</header><br>
    
        <p class="single-comment-text">${doc.comment}</p>
    </div><br>`);
            commentsSection.innerHTML = divs.join("");
        };
    });
}

// get in touch
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
            insertToDatabase(contact_db, {
                createdAt: now,
                name: name,
                email: email,
                message: message,
            });
            contactForm.reset();
            alert("Thanks for your message!");
        };
    });
};
