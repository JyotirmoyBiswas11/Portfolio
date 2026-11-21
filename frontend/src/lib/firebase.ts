import { initializeApp, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: "AIzaSyAi4ckvYzup_Al_mRQCXb8DX0-bkD5aVd4",
  authDomain: "bigcommerce-widgets.firebaseapp.com",
  databaseURL: "https://bigcommerce-widgets-default-rtdb.firebaseio.com",
  projectId: "bigcommerce-widgets",
  storageBucket: "bigcommerce-widgets.appspot.com",
  messagingSenderId: "451276263994",
  appId: "1:451276263994:web:4d344383ac0f6c537adb03"
}

const app: FirebaseApp = initializeApp(firebaseConfig)

// App Check - ALWAYS enforced, no debug tokens
export const appCheck: AppCheck = initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider('6LeSzZAqAAAAAOaGsXNfNwXvaOv15ZCcwc7jdeET'),
  isTokenAutoRefreshEnabled: true,
})

export const db: Firestore = getFirestore(app, 'pmtool')
export const auth: Auth = getAuth(app)
export const storage: FirebaseStorage = getStorage(app)
export { app }
