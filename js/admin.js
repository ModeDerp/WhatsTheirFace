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

function uploadFile(event) {
    var output = document.getElementById('previewImg');
    output.src = URL.createObjectURL(qS('#imgUpload').files[0]);

    //Get unique timeId
    let time = getDate();

    let name = qS('input#studentname').value
    let group = qS('input#studentgroup').value
    let hobby = qS('input#studenthobby').value
    let fileName = group.toUpperCase() + name.toLowerCase() + time

    var ref = storage.ref('img/' + fileName + '.jpg');
    var file = event.target.files[0];
    ref.put(file).then(() => {
        console.log('Uploaded image!');
        database.collection('students').doc().set({
            name: name,
            img: fileName,
            group: group.toUpperCase(),
            hobby: hobby
        })
    });
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


