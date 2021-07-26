import "firebase/analytics";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/performance";
import "firebase/storage";

const clientCredentials = {
	apiKey: "AIzaSyDdW6ZbUJrt1SIb-Bdbm0OGc3v_jvZeqnA",
	authDomain: "civy-hawt.firebaseapp.com",
	projectId: "civy-hawt",
	storageBucket: "civy-hawt.appspot.com",
	messagingSenderId: "615698550228",
	appId: "1:615698550228:web:2c3fdf3a3554a88deada41",
};

if (!firebase.apps.length) {
	firebase.initializeApp(clientCredentials);
	// Check that `window` is in scope for the analytics module!
	if (typeof window !== "undefined") {
		// Enable analytics. https://firebase.google.com/docs/analytics/get-started
		if ("measurementId" in clientCredentials) {
			firebase.analytics();
			firebase.performance();
		}
	}
}

export default firebase;
