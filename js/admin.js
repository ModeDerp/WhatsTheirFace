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

function loadFile(event) {
    var output = document.getElementById('previewImg');
    output.src = URL.createObjectURL(event.target.files[0]);

    var ref = storage.ref('img/hej.jpg');

    var file = event.target.files[0];
    ref.put(file).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
    });


};


