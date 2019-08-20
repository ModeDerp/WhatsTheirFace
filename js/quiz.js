function qS(selector){
    return document.querySelector(selector)
}

function qSA(selector){
    return document.querySelectorAll(selector)
}

console.log(qS('#answers'))

firestore = firebase.firestore();

//Set up database/storage reference
const database = firebase.firestore();
const storage = firebase.storage();

firebase.auth().signInAnonymously().catch(error => console.error(error));

let students = [], remainingGuesses = [], guess = {}

//Gather all students from firebase
database.collection('students').get().then((snap) => {
    snap.forEach((snap) => {
        students.push(snap.data());
        remainingGuesses.push(snap.data());
    })
    console.log(students);
    console.log(remainingGuesses);
}).then( () => {
    newGuess();
})

function newGuess(){
    guess = remainingGuesses[Math.floor(Math.random() * remainingGuesses.length)];
    console.log(guess)
    let guessRef = storage.ref('img/' + guess.img + '.jpg');
    console.log(guessRef)
    guessRef.getDownloadURL().then( (url) => {
        console.log(url)
        qS('section#image > img').src = url
    })
}

var storageRef = storage.ref("googleicon.jpg");

storageRef.getDownloadURL().then( (url) => {
    console.log(url);
});