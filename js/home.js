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

let students = [];

//Gather all students from firebase
database.collection('students').get().then((snap) => {
    snap.forEach((snap) => {
        database.collection('groups').doc(`${snap.data().group.id}`).get().then((snapshot) =>{
          let temp = {}
          temp = snap.data()
          temp['group'] = snapshot.data().group
          students.push(temp)  
          appendCards(temp);
        })
    });
    console.log(students)
})

function appendCards(student){
    qS('#cards').innerHTML = ""
    // students.forEach( (student) => {
        var storageRef = storage.ref('img/' + student.img + '.jpg');
        storageRef.getDownloadURL().then( (url) => {
            qS('#cards').insertAdjacentHTML('beforeend',
            `<div>
                <img src="${url}">
                <p>${student.name + " " + student.group}</p>
                <div>${student.hobby}</div>
            </div>`);
        });
    // });
}

