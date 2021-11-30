import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, collection, getDoc, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

//Atributos de firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//Atributos de JS buscando sus respectivos ids para que funcionen en los metodos correctamente.
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const username = document.getElementById("username");
const plata = document.getElementById("plata");

//Recibir datos del firebase del usuario que esta loggeado
const getUserInfo = async (userId) => {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        return docSnap.data();
    } catch (e) {
        console.log(e);
    }
}

//Función para que el usuario pueda desloggear
const logOut = async () => {
    try {
        await signOut(auth);
        window.location = "./index.html";
    } catch (e) {
        console.log(e);
    }
}

//El addEventListener que sirve cuando uno clickea el botón y funcione, bueno eso pero el usuario se deslogea.
logoutButton.addEventListener("click", e => {
    logOut();
});

loginButton.addEventListener("click", e => {
    window.location = "./index.html";
})


//Reconocer el estado del usuario.
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userInfo = await getUserInfo(user.uid);
        console.log(userInfo);
        username.innerHTML = "Bienvenido " + userInfo.name;
        plata.innerHTML = "Tu plata es: $" + userInfo.dollar;
    } else {
        username.innerHTML = ""
    }
});
