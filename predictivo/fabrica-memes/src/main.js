import Vue from 'vue'
import App from './App.vue'
import {firestorePlugin} from 'vuefire'  
import *as firebase from 'firebase/app';
import 'firebase/firestore'
import 'firebase/storage'

//import VueFire from 'vuefire'
import router from './router/index'
import vuetify from './plugins/vuetify';


Vue.config.productionTip = false

var firebaseConfig = {
  apiKey: process.env.APIKEY,
  authDomain: process.env.AUTHDOMAIN,
  databaseURL: process.env.DATABASEURL,
  projectId: process.env.PROJECTID,
  storageBucket: process.env.STORAGEBUCKET,
  messagingSenderId: process.env.MESSAGINGSENDERID,
  appId: process.env.APPID
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const firestore = firebaseApp.firestore()
export const storage = firebase.storage().ref('/images')

Vue.use(firestorePlugin)

new Vue({
  vuetify,
  render: h => h(App),
  router,
  components: { App }
}).$mount('#app')
