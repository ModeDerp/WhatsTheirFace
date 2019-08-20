function qS(selector){
    return document.querySelector(selector)
}

function qSA(selector){
    return document.querySelectorAll(selector)
}

function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

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
}).then( () => {
    newGuess();
})

//
function newGuess(){
    //Randomize next guess
    let guessIndex = Math.floor(Math.random() * remainingGuesses.length);
    guess = remainingGuesses[guessIndex];
    console.log(guess);
    remainingGuesses.splice(guessIndex, 1);

    //Update shown image
    let guessRef = storage.ref('img/' + guess.img + '.jpg');
    guessRef.getDownloadURL().then( (url) => {
        qS('section#image > img').src = url;
    })

    //Randomize available answers
    let answers = [];
    let availableGuesses = remainingGuesses;
    for(i=0;i<6;i++){
        guessIndex = Math.floor(Math.random()*availableGuesses.length);
        answers.push(availableGuesses[guessIndex]);
        availableGuesses.splice(guessIndex, 1);
    }
    answers.push(guess);
    answers = shuffle(answers)

    answers.forEach( (answer) => {
        qS('#answers').insertAdjacentHTML('beforeend',
        `<div>
            <p>${answer.name}</p>
        </div>`)
    })
    console.log(answers);
}

var storageRef = storage.ref("googleicon.jpg");

storageRef.getDownloadURL().then( (url) => {
    console.log(url);
});