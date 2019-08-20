firestore = firebase.firestore();

//Set up database/storage reference
const database = firebase.firestore();
const storage = firebase.storage();

firebase.auth().signInAnonymously().catch(error => console.error(error))

database.collection('students').get().then((snap) => {
    snap.forEach((snap) => {
        console.log(snap.data())
    })
});

var storageRef = storage.ref("googleicon.jpg");

storageRef.getDownloadURL().then( function(url) {
    console.log(url);
});

storageRef.getDownloadURL().then( (url) => {
    console.log(url);
});