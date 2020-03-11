export const firebase = {
  apiKey: "AIzaSyAapWCygLovdVRCReWo-Yxw-dRVtLiXUAg",
  authDomain: "music-queue-dev.firebaseapp.com",
  databaseURL: "https://music-queue-dev.firebaseio.com",
  projectId: "music-queue-dev",
  storageBucket: "music-queue-dev.appspot.com",
  messagingSenderId: "181598421541",
  appId: "1:181598421541:web:a8237c53ac12b23249b5cc",
  measurementId: "G-CMVH2BVJ4H"
};

export const rrfConfig = {
  userProfile: 'hosts',
  useFirestoreForProfile: true, // Store in Firestore instead of Real Time DB
  enableLogging: false
}

export default { firebase, rrfConfig }
