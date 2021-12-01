import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, collection, getDoc, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

//Constante para luego volverlo firebase.
let dolar = 300000;
let monedaBitCoin = 57000;
let totalMonedaComprada = 0;
let cantidadMonedaBitCoin = 0;


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
const coinValue = document.getElementById("coinValue");
const coinQuantity = document.getElementById("coinQuantity");

//LOS MOVIMIENTOS 
const movimientos = document.getElementById("movimientos");

//Creando los ID de los buy, para que funcionen cuando lo toque y salga su drop.
const buyButton = document.getElementById("buyButton");
const buyDrop = document.getElementById("buyDrop");
const sellButton = document.getElementById("sellButton");
const sellDrop = document.getElementById("sellDrop");

//los ID para que funcionen la parte de cantidad (COMPRAR)
const buyPlus = document.getElementById("buyPlus"); //<button>
const buyMinus = document.getElementById("buyMinus"); //<button>
const buyQuantity = document.getElementById("buyQuantity"); //<p>

//los ID para que funcionen la parte de cantidad (VENDER)
const sellPlus = document.getElementById("sellPlus"); //<button>
const sellMinus = document.getElementById("sellMinus"); //<button>
const sellQuantity = document.getElementById("sellQuantity"); //<p>

//los ID para comprar monedas
const buyCoins = document.getElementById("buyCoins"); //<button>
const sellCoins = document.getElementById("sellCoins"); //<button>

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

//Acá valido la parte de suma y resta en la parte de COMPRAR.
buyPlus.addEventListener("click", e => {
    comprarCantidad += 1;
    buyQuantity.innerHTML = comprarCantidad;
});

buyMinus.addEventListener("click", e => {
    if(comprarCantidad > 1){
        comprarCantidad -= 1;
    }
    buyQuantity.innerHTML = comprarCantidad;
});

//Acá valido la parte de suma y resta en la parte de VENDER.
sellPlus.addEventListener("click", e => {
    venderCantidad += 1;
    sellQuantity.innerHTML = venderCantidad;
});

sellMinus.addEventListener("click", e => {
    if(venderCantidad > 1){
        venderCantidad -= 1;
    }
    sellQuantity.innerHTML = venderCantidad;
});

coinValue.innerHTML = "Valor de la moneda: " + monedaBitCoin;

//VENDER monedas
sellCoins.addEventListener("click", e => {
    console.log("Vendiste una moneda");

    if(cantidadMonedaBitCoin >= 1 && venderCantidad <= cantidadMonedaBitCoin){
        dolar = dolar + monedaBitCoin*venderCantidad;
        cantidadMonedaBitCoin = cantidadMonedaBitCoin - venderCantidad;
        plata.innerHTML = dolar;
        coinQuantity.innerHTML = "Tienes: " + cantidadMonedaBitCoin;
        alert("Al convertir la moneda de Bitcoins tienes: " + dolar);
    } else {
        alert("Tienes más valor de la moneda");
    }
});

//COMPRAR monedas
buyCoins.addEventListener("click", e => {
    console.log("Compraste una moneda");
    totalMonedaComprada = monedaBitCoin*comprarCantidad;
    if(totalMonedaComprada < dolar){
        dolar = dolar - totalMonedaComprada;
        cantidadMonedaBitCoin = cantidadMonedaBitCoin + comprarCantidad;
        plata.innerHTML = dolar;
        coinQuantity.innerHTML = "Tienes: " + cantidadMonedaBitCoin;
        movimientos.innerHTML = "Invertiste a bitCoins con un valor de: " + monedaBitCoin;
        alert("Compraste " + comprarCantidad + " de bitCoins y tienes en total de dinero: " + dolar);
    } else {
        alert("No tienes el dinero suficiente para comprar más monedas, reduzca la cantidad");
    }
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
