import { initializeApp, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from 'firebase/app-check'

const firebaseConfig = {
  apiKey: "AIzaSyBuH4mTUbiXKOMpYD_MePdl2geND9rLx7g",
  authDomain: "porfolio-biswas.firebaseapp.com",
  projectId: "porfolio-biswas",
  storageBucket: "porfolio-biswas.firebasestorage.app",
  messagingSenderId: "1064036622187",
  appId: "1:1064036622187:web:129a2b0b078a216602362e"
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
