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

//div del complemento
const cardSection = document.getElementById("cards");

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

//Tener un arreglo de cards
let cards = [];



//Lectura de firebase sobre los CARDS que estan y sus respectivos precios
const getAllProducts = async () => {
    const collectionRef = collection(db, "cards");
    const { docs } = await getDocs(collectionRef);

    //productsSection.classList.add("loaded");
    //spinner.classList.add("loaded");

    cards = docs.map((doc) => {
        return {
            ...doc.data(),
            id: doc.id,
        }
    });
    // Recorro cada uno de los 5 cartas que tengo en mi arreglo
    cards.forEach(card => {
        // Llamo la funcion productTemplate para cada product.
        productTemplate(card);
    });
    return cards;
};

// item = product
const productTemplate = (item) => {

    // Creamos un elemento a, le agregamos la clase "card"
    const card = document.createElement("div");
    card.className = "cards__item"; //La clase css .cards

    // Seteamos el atributo href con una url dinámica, donde le pasamos el id del producto
    card.setAttribute("href", `./product.html?id=${item.id}`);

    // Lógica de nuestro tag, botón de Recomendado o Más vendido
    let tagHtml;
    if (item.isUp) {
        tagHtml = `<img class="card__tag card__tag--up" src="./img/up.png"/>`;
    } else {
        tagHtml = `<img class="product__tag card__tag--down" src="./img/up.png"/>`;
    }

    // Añadir el HTML a nuestro elemento product.
    card.innerHTML = `
    <div class="cards__item">
                <!--Imagen principal de la carta-->
                <figure><img class="cards__image" src="${item.image}"/></figure>
                <!--Descripciónes sobre lo que tiene la carta-->
                <div class="cards__description">
                    <h2 class="cards__name">${item.name}</h2>
                    <p id="coinQuantity">Tienes ${item.coinQuantity}</p>
                    <p id="coinValue" class="cards__coin--value"> $ ${item.coinValue}</p>
                    <!--Los botones me toco validarlo de esta manera para que sea más "profesional"-->
                    <div class="cards__buttons">
                        <div class="cards__button cards__buy">
                            <!--button-->
                            <button id="buyButton">Comprar</button>
                            <!--drop-->
                            <div id="buyDrop" class="cards__drop">
                                <p>¿Cuantas deseas comprar?</p>
                                <div class="cards__drop--item">
                                    <button id="buyMinus">-</button>
                                    <p id="buyQuantity">1</p>
                                    <button id="buyPlus">+</button>
                                </div>
                                <button id="buyCoins">Listo</button>
                            </div>
                        </div>
                        <!---->
                        <div class="cards__button cards__sell">
                            <!--button-->
                            <button id="sellButton">Vender</button>
                            <!--drop-->
                            <div id="sellDrop" class="cards__drop">
                                <p>¿Cuantas deseas vender?</p>
                                <div class="cards__drop--item">
                                    <button id="sellMinus">-</button>
                                    <p id="sellQuantity">1</p>
                                    <button id="sellPlus">+</button>
                                </div>
                                <button id="sellCoins">Listo</button>
                            </div>
                        </div>
                         <!---->
                    </div>
                </div>
                <!--Acá termina todo de los card__description-->
            </div>
    `;

    // Agregar cada producto a nuestro contenedor
    cardSection.appendChild(card);


    // Busco el botón del carrito en el producto (.product__cart)
    //const productCartButton = product.querySelector(".product__cart");

    // Cuando haga click en el botón del carrito:
    // productCartButton.addEventListener("click", e => {

    //     // Evita un comportamiento por defecto
    //     // Dirigirme a otra página (enlace - a) && Refrescar la página (form)
    //     e.preventDefault();

    //     const productAdded = {
    //         id: item.id,
    //         name: item.name,
    //         image: item.image,
    //         price: item.price
    //     };

    //     cart.push(productAdded);

    //     if (userLogged) {
    //         addProductsCart(cart);
    //     }

    //     localStorage.setItem("cart", JSON.stringify(cart));

    //     // Deshabilito el botón
    //     productCartButton.innerHTML = "Producto añadido";
    //     productCartButton.setAttribute("disabled", true);
    // });

};


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
    getAllProducts();
});
