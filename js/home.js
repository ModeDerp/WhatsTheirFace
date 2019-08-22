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

let students = [], groups = [];

getAllStudents()
function getAllStudents(){
    students = []
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
}

function getGroup(selectedGroupRef){
    students = []
    database.collection('students').where('group', '==', selectedGroupRef).get().then((snap) => {
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

function appendCards(student){
    qS('#cards').innerHTML = ""
    var storageRef = storage.ref('img/' + student.img + '.jpg');
    storageRef.getDownloadURL().then( (url) => {
        qS('#cards').insertAdjacentHTML('beforeend',
        `<div>
            <img src="${url}">
            <p>${student.name + " " + student.group}</p>
            <div>${student.hobby}</div>
        </div>`);
    });
}

function changeGroup() {
    let chosenGroup = qS('#groupselector').value
    if(chosenGroup == '*'){
        getAllStudents()
    } else {
        let selectedGroupRef = database.collection('groups').doc(chosenGroup)
        getGroup(selectedGroupRef)
    }
}
