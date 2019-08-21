function qS(selector){
    return document.querySelector(selector)
}

function qSA(selector){
    return document.querySelectorAll(selector)
}

firestore = firebase.firestore();

//Set up database/storage reference
const database = firebase.firestore();
const storage = firebase.storage();

firebase.auth().signInAnonymously().catch(error => console.error(error));