firestore = firebase.firestore();
const settings = {timestampsInSnapshots: true};
firestore.settings(settings);

//Set up database reference
const database = firebase.firestore();
firebase.auth().signInAnonymously().catch(error => console.error(error))