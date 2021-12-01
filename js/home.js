import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, collection, getDoc, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

//ATRIBUTOS DE HOME.JS
let comprarCantidad = 1; //Esta es el variable que ayuda a contar las monedas de "comprar" (PREDETERMINADAS AL INICIO);
let venderCantidad = 1; //Esta es el variable que ayuda a contar las monedas de "vender" (PREDETERMINADAS AL INICIO);

//Atributos de firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//Atributos de JS buscando sus respectivos ids para que funcionen en los metodos correctamente.
const loginButton = document.getElementById("loginButton");
const logoutButton = document.getElementById("logoutButton");
const username = document.getElementById("username");
const plata = document.getElementById("plata");

//Creando los ID de los buy, para que funcionen cuando lo toque y salga su drop.
const buyButton = document.getElementById("buyButton");
const buyDrop = document.getElementById("buyDrop");
const sellButton = document.getElementById("sellButton");
const sellDrop = document.getElementById("sellDrop");

//los ID para que funcionen la parte de cantidad (COMPRAR)
const buyPlus = document.getElementById("buyPlus");
const buyMinus = document.getElementById("buyMinus");

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

//El addEventListener que sirve para mandarlo a loggearse, pero casi no sirve porque siempre se va a enviar el index.html
loginButton.addEventListener("click", e => {
    window.location = "./index.html";
});

//Aca valido para que salgan los de DROPDROPDROPDROPDROP de comprar
buyButton.addEventListener("click", e => {
    buyDrop.classList.add("drop");
    sellDrop.classList.remove("drop");
});

//Aca valido para que salgan los de DROPDROPDROPDROPDROP de vender
sellButton.addEventListener("click", e => {
    buyDrop.classList.remove("drop");
    sellDrop.classList.add("drop");
});



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
