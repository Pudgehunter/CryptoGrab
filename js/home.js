import { initializeApp } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-auth.js";
import { getFirestore, doc, collection, getDoc, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/9.3.0/firebase-firestore.js";

//Constante para luego volverlo firebase.
let dolar = 0;
let monedaBitCoin = 0;
let totalMonedaComprada = 0;
let cantidadMonedaBitCoin = 0;

//Datos de usuario
let userLogged = {}


//ATRIBUTOS DE HOME.JS
let comprarCantidad = [0, 0, 0, 0, 0]; //Esta es el variable que ayuda a contar las monedas de "comprar" (PREDETERMINADAS AL INICIO);
let venderCantidad = [0, 0, 0, 0, 0]; //Esta es el variable que ayuda a contar las monedas de "vender" (PREDETERMINADAS AL INICIO);

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
const getAllCards = async () => {
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

    let coinValue = [0,0,0,0,0];
    let coinValueHtml;
    //Valido qué moneda esta hablando el card para no complicarse la vida que tiene muchas monedas.
    switch (parseInt(item.id)) {
        case 0:
            coinValue[0] = coinValue[0] + userLogged.btc;
            coinValueHtml = `<p id="coinQuantity">Tienes ${coinValue[0]}</p>`
            break;
        case 1:
            coinValue[1] = coinValue[1] + userLogged.neo;
            coinValueHtml = `<p id="coinQuantity">Tienes ${coinValue[1]}</p>`
            break;
        case 2:
            coinValue[2] = coinValue[2] + userLogged.bnb;
            coinValueHtml = `<p id="coinQuantity">Tienes ${coinValue[2]}</p>`
            break;
        case 3:
            coinValue[3] = coinValue[3] + userLogged.ltc;
            coinValueHtml = `<p id="coinQuantity">Tienes ${coinValue[3]}</p>`
            break;
        case 4:
            coinValue[4] = coinValue[4] + userLogged.xmr;
            coinValueHtml = `<p id="coinQuantity">Tienes ${coinValue[4]}</p>`
            break;
    }

    // Añadir el HTML a nuestro elemento product.
    card.innerHTML = `
    <div class="cards__item">
                <!--Imagen principal de la carta-->
                <figure><img class="cards__image" src="${item.image}"/></figure>
                <!--Descripciónes sobre lo que tiene la carta-->
                <div class="cards__description">
                    <h2 class="cards__name">${item.name}</h2>
                    <!--<p id="coinQuantity">Tienes ${item.coinQuantity}</p>-->
                    ${coinValueHtml}
                    <p id="coinValue" class="cards__coin--value"> $ ${item.coinValue}</p>
                    <!--Los botones me toco validarlo de esta manera para que sea más "profesional"-->
                    <div class="cards__buttons">
                        <div class="cards__button cards__buy">
                            <!--button-->
                            <button class="buyButton">Comprar</button>
                            <!--drop-->
                            <div class="buyDrop cards__drop">
                                <p>¿Cuantas deseas comprar?</p>
                                <div class="cards__drop--item">
                                    <button class="buyMinus">-</button>
                                    <p class="buyQuantity">0</p>
                                    <button class="buyPlus">+</button>
                                </div>
                                <button class="buyCoins">Listo</button>
                            </div>
                        </div>
                        <!---->
                        <div class="cards__button cards__sell">
                            <!--button-->
                            <button class="sellButton">Vender</button>
                            <!--drop-->
                            <div class="sellDrop cards__drop">
                                <p>¿Cuantas deseas vender?</p>
                                <div class="cards__drop--item">
                                    <button class="sellMinus">-</button>
                                    <p class="sellQuantity">0</p>
                                    <button class="sellPlus">+</button>
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

    //LOS IDS DEL BUTTON Y TODAS LAS ID QUE HAY EN ESA VAINA
    //Creando los Clases porque ID solo funcionan con los primeros y no juzguen porqué.
    const buyButton = card.querySelector(".buyButton");
    const buyDrop = card.querySelector(".buyDrop");
    const sellButton = card.querySelector(".sellButton");
    const sellDrop = card.querySelector(".sellDrop");

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

    //No supe validar para cada uno y que salga re fácil y sencillo entonces hare para cada uno
    const buyPlus = card.querySelector(".buyPlus");
    const buyMinus = card.querySelector(".buyMinus"); //<button>
    const buyQuantity = card.querySelector(".buyQuantity"); //<p>

    //Acá valido la parte de suma y resta en la parte de COMPRAR.
    buyPlus.addEventListener("click", e => {
        comprarCantidad[parseInt(item.id)] += 1;
        buyQuantity.innerHTML = comprarCantidad[parseInt(item.id)];
    });

    buyMinus.addEventListener("click", e => {
        if (comprarCantidad[parseInt(item.id)] > 0) {
            comprarCantidad[parseInt(item.id)] -= 1;
        }
        buyQuantity.innerHTML = comprarCantidad[parseInt(item.id)];
    });

    //los ID para que funcionen la parte de cantidad (VENDER)
    const sellPlus = card.querySelector(".sellPlus"); //<button>
    const sellMinus = card.querySelector(".sellMinus"); //<button>
    const sellQuantity = card.querySelector(".sellQuantity"); //<p>

    //Acá valido la parte de suma y resta en la parte de VENDER.
    sellPlus.addEventListener("click", e => {
        console.log(item.id);
        venderCantidad[parseInt(item.id)] += 1;
        sellQuantity.innerHTML = venderCantidad[parseInt(item.id)];
    });

    sellMinus.addEventListener("click", e => {
        if (venderCantidad[parseInt(item.id)] > 0) {
            venderCantidad[parseInt(item.id)] -= 1;
        }
        sellQuantity.innerHTML = venderCantidad[parseInt(item.id)];
    });

    //los ID para comprar monedas
    const buyCoins = card.querySelector(".buyCoins"); //<button>

    //COMPRAR monedas
    buyCoins.addEventListener("click", async e => {
        //e.preventDefault();
        totalMonedaComprada = parseInt(item.coinValue) * comprarCantidad[parseInt(item.id)];
        console.log("esto es: valor de moneda: " + item.coinValue + "* cantidad: " + comprarCantidad[parseInt(item.id)] + " = " + totalMonedaComprada);

        if (totalMonedaComprada < parseInt(userLogged.dollar)) {
            console.log("funciona");
            let total = parseInt(userLogged.dollar) - totalMonedaComprada;
            let btcCoins = userLogged.btc + comprarCantidad[0];
            let neoCoins = userLogged.neo + comprarCantidad[1];
            let bnbCoins = userLogged.bnb + comprarCantidad[2];
            let ltcCoins = userLogged.ltc + comprarCantidad[3];
            let xmrCoins = userLogged.xmr + comprarCantidad[4];

            await setDoc(doc(db, "users", userLogged.uid), {
                bnb: bnbCoins,
                btc: btcCoins,
                dollar: total,
                email: userLogged.email,
                isAdmin: userLogged.isAdmin,
                ltc: ltcCoins,
                name: userLogged.name,
                neo: neoCoins,
                password: userLogged.password,
                xmr: xmrCoins
            });

            //Feedbacks al usuario.
            switch (parseInt(item.id)) {
                case 0:
                    alert("Compraste " + comprarCantidad[0] + " de bitcoins por " + totalMonedaComprada + " y tienes: " + total);
                    break;
                case 1:
                    alert("Compraste " + comprarCantidad[1] + " de NEO por " + totalMonedaComprada + " y tienes: " + total);
                    break;
                case 2:
                    alert("Compraste " + comprarCantidad[2] + " de Binance Coin por " + totalMonedaComprada + " y tienes: " + total);
                    break;
                case 3:
                    alert("Compraste " + comprarCantidad[3] + " de Litecoin por " + totalMonedaComprada + " y tienes: " + total);
                    break;
                case 4:
                    alert("Compraste " + comprarCantidad[4] + " de Monero por " + totalMonedaComprada + " y tienes: " + total);
                    break;
            }
        } else {
            alert("No tienes el dinero suficiente para comprar más monedas, reduzca la cantidad");
        }
    });

    const sellCoins = document.getElementById("sellCoins"); //<button>

};


//Reconocer el estado del usuario.
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userInfo = await getUserInfo(user.uid);
        console.log(userInfo);
        username.innerHTML = "Bienvenido " + userInfo.name;
        plata.innerHTML = "Tu plata es: $" + userInfo.dollar;

        //Para poder usar los datos del usuario en otro lados.
        userLogged = {
            ...user,
            ...userInfo
        };

    } else {
        username.innerHTML = ""
    }
    getAllCards();
});
