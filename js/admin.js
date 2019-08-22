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

function updateImg(){
    var output = document.getElementById('previewImg');
    output.src = URL.createObjectURL(qS('#imgUpload').files[0]);
}

function uploadFile() {
    //Get unique timeId
    let time = getDate();

    //Get all input values
    let name = qS('input#studentname').value
    let group = qS('input#studentgroup').value
    let hobby = qS('textarea#studenthobby').value
    let fileName = group.toUpperCase() + name.toLowerCase() + time
    let groupPath

    //Find documents containing input group
    database.collection('groups').where('group', '==', `${group.toUpperCase()}`).get().then((snap) => {
        snap.forEach((snapshot) => {
            //Get id from found document
            groupPath = snapshot.id
        });
    }).then(() => {
        //Create references to group document and image in storage
        groupRef = database.collection('groups').doc(groupPath)
        var ref = storage.ref('img/' + fileName + '.jpg');
        var file = qS('#imgUpload').files[0];
        //Upload img to storage
        ref.put(file).then(() => {
            alert('Student succesfully added')
            database.collection('students').doc(name + time).set({
                name: name,
                img: fileName,
                group: groupRef,
                hobby: hobby
            })
        });
    })
};

function getDate(){
    let time = new Date();
    let date = "";
    date += time.getFullYear();
    date += time.getDate();
    date += time.getMonth();
    date += time.getHours();
    date += time.getMinutes();
    date += time.getSeconds();
    date += time.getMilliseconds();
    return date
}


