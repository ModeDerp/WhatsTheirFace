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

let remainingGuesses = [], guess = {}, scoreCount = 0, firstGuess = true, groups = [], selectedGroupRef, firstTry = 0, incorrectGuesses = 0, loading = false
qS("#corGuess").innerHTML = `<span>First Try: ${firstTry}</span>`
qS("#incorGuess").innerHTML = `<span>Incorrect Guesses: ${incorrectGuesses}</span>`
qS("#score").innerHTML = `<span>Score: ${scoreCount}</span>`
startWithAllStudents()

function startWithAllStudents(){
    remainingGuesses = []
    //Gather all students from firebase
    database.collection('students').get().then((snap) => {
        snap.forEach((snap) => {
            remainingGuesses.push(snap.data());
        })
    }).then( () => {
        newGuess();
    })
}

function startWithGroup() {
    remainingGuesses = []
    //Gather all students from firebase
    database.collection('students').where("group", "==", selectedGroupRef).get().then((snap) => {
        snap.forEach((snap) => {
            remainingGuesses.push(snap.data());
        })
    }).then( () => {
        newGuess();
    })
}

function changeGroup() {
    let chosenGroup = qS('#groupselector').value
    if(chosenGroup == '*'){
        startWithAllStudents()
        scoreCount = 0
        firstTry = 0
        incorrectGuesses = 0
        qS("#corGuess").innerHTML = `<span>First Try: ${firstTry}</span>`
        qS("#incorGuess").innerHTML = `<span>Incorrect Guesses: ${incorrectGuesses}</span>`
        qS("#score").innerHTML = `<span>Score: ${scoreCount}</span>`
    } else {
        selectedGroupRef = database.collection('groups').doc(chosenGroup)
        scoreCount = 0
        firstTry = 0
        incorrectGuesses = 0
        qS("#corGuess").innerHTML = `<span>First Try: ${firstTry}</span>`
        qS("#incorGuess").innerHTML = `<span>Incorrect Guesses: ${incorrectGuesses}</span>`
        qS("#score").innerHTML = `<span>Score: ${scoreCount}</span>`
        startWithGroup()
    }
}
    
//Gather groups from firebase
database.collection("groups").orderBy("group", "asc").get().then((snap) => {
    snap.forEach((snap) => {
        let temp = snap.data()
        temp.id = snap.id
        groups.push(temp)
    })
}).then(() => {
    groups.forEach((group) => {
        qS('#groupselector').insertAdjacentHTML('beforeend', 
        `<option value="${group.id}">${group.group}</option>`)
    })
})

function newGuess(){
    //Randomize next guess
    let guessIndex = Math.floor(Math.random() * remainingGuesses.length);
    guess = remainingGuesses[guessIndex];
    guess.guessed = false
    console.log(guess);
    remainingGuesses.splice(guessIndex, 1);

    //Update shown info
    qS('#hobby').innerHTML = '<p>' + guess.hobby + '</p>'
    let guessRef = storage.ref('img/' + guess.img + '.jpg');
    guessRef.getDownloadURL().then( (url) => {
        qS('section#image > img').src = url;
    }).then(() => {
        //Randomize available answers
        let answers = [];
        let availableGuesses = [];
        Object.assign(availableGuesses, remainingGuesses);
        i = 0
        while(i < 6 && i < remainingGuesses.length){
            guessIndex = Math.floor(Math.random()*availableGuesses.length);
            answers.push(availableGuesses[guessIndex]);
            answers[answers.length-1].guessed = false
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
        loading = false
        addAnswerListeners(answers);
    })
}

function addAnswerListeners(answers){
    answerNodes = qSA('#answers > div');
    answerNodes.forEach((node) => {
        node.addEventListener('click', () => {
            let found = answers.find((element) => {
                return element.node == event.target;
            })
            if(found.guessed == true || loading == true){
                return
            }
            found.guessed = true
            if(found.name == guess.name){
                loading = true
                if (firstGuess == true){
                    scoreCount += 1
                    firstTry++
                    qS("#corGuess").innerHTML = `<span>First Try: ${firstTry}</span>`
                    qS("#score").innerHTML = `<span>Score: ${scoreCount}</span>`
                }
                firstGuess = true;
                guess.node.classList.add('correct')
                if(remainingGuesses.length > 0){ 
                    setTimeout(() => {newGuess()}, 1000)
                } else {
                    scoreCount = 0
                    firstTry = 0
                    incorrectGuesses = 0
                    qS("#corGuess").innerHTML = `<span>First Try: ${firstTry}</span>`
                    qS("#incorGuess").innerHTML = `<span>Incorrect Guesses: ${incorrectGuesses}</span>`
                    qS("#score").innerHTML = `<span>Score: ${scoreCount}</span>`
                    setTimeout(() => {startWithGroup()}, 2000)
                }
            } else { 
                found.node.classList.add('incorrect')
                scoreCount -= 5
                firstGuess = false
                incorrectGuesses++
                qS("#score").innerHTML = `<span>Score: ${scoreCount}</span>`
                qS("#incorGuess").innerHTML = `<span>Incorrect Guesses: ${incorrectGuesses}</span>`

            }
        })
    })
}