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

let students = [], remainingGuesses = [], guess = {}, scoreCount = 0, firstGuess = true

qS("#score").innerHTML = `<span>Score: ${scoreCount}</span>`

//Gather all students from firebase
database.collection('students').get().then((snap) => {
    snap.forEach((snap) => {
        students.push(snap.data());
        remainingGuesses.push(snap.data());
    })
}).then( () => {
    newGuess();
})

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
    let availableGuesses = [];
    Object.assign(availableGuesses, remainingGuesses);
    i = 0
    while(i < 6 && i < remainingGuesses.length){
        guessIndex = Math.floor(Math.random()*availableGuesses.length);
        answers.push(availableGuesses[guessIndex]);
        availableGuesses.splice(guessIndex, 1);
        i++
    }
    answers.push(guess);
    answers = shuffle(answers);

    //Update visual answers
    qS('#answers').innerHTML = '';
    answers.forEach( (answer,index) => {
        qS('#answers').insertAdjacentHTML('beforeend',
        `<div>${answer.name}</div>`);
        answers[index].node = qS('#answers > div:last-child');
    })
    addAnswerListeners(answers);
}

function addAnswerListeners(answers){
    answerNodes = qSA('#answers > div');
    answerNodes.forEach((node) => {
        node.addEventListener('click', () => {
            let found = answers.find((element) => {
                return element.node == event.target;
            })

            if(found.name == guess.name){
                if (firstGuess == true){
                    scoreCount += 1
                    qS("#score").innerHTML = `<span>Score: ${scoreCount}</span>`
                }
                firstGuess = true;
                if(remainingGuesses.length > 0){
                    guess.node.classList.add('correct')
                    setTimeout(() => {newGuess()}, 1000)
                } else {
                    location.reload();
                }
            } else { 
                found.node.classList.add('incorrect')
                scoreCount -= 5
                firstGuess = false
                qS("#score").innerHTML = `<span>Score: ${scoreCount}</span>`
            }
            console.log(scoreCount);
        })
    })
}

var storageRef = storage.ref("googleicon.jpg");

storageRef.getDownloadURL().then( (url) => {
    console.log(url);
});