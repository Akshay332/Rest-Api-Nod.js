const firebase = require('firebase/app')
require('firebase/analytics')
require('firebase/storage')
var firebaseConfig = {
    apiKey: "AIzaSyC-vMVF7fO7hxbnT_iMMsQKGBcJCCtpkjI",
    authDomain: "rest-api-nodejs-710a6.firebaseapp.com",
    projectId: "rest-api-nodejs-710a6",
    storageBucket: "rest-api-nodejs-710a6.appspot.com",
    messagingSenderId: "16225912428",
    appId: "1:16225912428:web:5d15b828043a1f4ba9ba49",
    measurementId: "G-PKHF5C7B7W"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics.Analytics;