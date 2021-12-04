// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

//Firebase Ingresar
const logIn = async (email, password) => {
    try {
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        //const userInfo = await getUserInfo(user.uid);

        alert("Gracias por Ingresar de nuevo!");

        //window.location = "./onboarding.html";
        window.location = "./home.html";
    } catch (e) {
        console.log(e);
        if (e.code === "auth/wrong-password") {
            alert("La contraseña no coinciden");
        } else if (e.code === "auth/user-not-found") {
            alert("El usuario no existe");
        }
    }
}

const ingresarBtn = document.getElementById("logIn");

ingresarBtn.addEventListener("submit", e => {
    e.preventDefault();
    //console.log("Funciono");
    const email = ingresarBtn.email.value;
    const password = ingresarBtn.password.value;
    //

    if (email && password) {
        logIn(email, password);
    } else {
        alert("completa todos los campos");
    }
}
);