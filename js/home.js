import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { getFirestore, doc, addDoc, collection, getDoc, getDocs, setDoc } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

//Datos de usuario
let userLogged = {}
let mov = [];

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

//LOS MOVIMIENTOS 
const movimientoSection = document.getElementById("movimientos");
const ventaMovimientosSection = document.getElementById("movimientosGanar");

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

const spinner = document.getElementById("spinner");

//Lectura de firebase sobre los CARDS que estan y sus respectivos precios
const getAllCards = async () => {
    const collectionRef = collection(db, "cards");
    const { docs } = await getDocs(collectionRef);

    //productsSection.classList.add("loaded");
    spinner.classList.add("loaded");

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

    // Lógica de nuestro tag, botón de Recomendado o Más vendido
    let tagHtml;
    if (item.isUp) {
        tagHtml = `<img class="cards__tag cards__tag--up" src="./img/up.png"/>`;
    } else {
        tagHtml = `<img class="cards__tag cards__tag--down" src="./img/down.png"/>`;
    }
    let coinValue = [0, 0, 0, 0, 0];
    let coinValueHtml;
    //Valido qué moneda esta hablando el card para no complicarse la vida que tiene muchas monedas.
    switch (parseInt(item.id)) {
        case 0:
            coinValue[0] = coinValue[0] + userLogged.dash;
            coinValueHtml = `<p id="coinQuantity">Tienes ${coinValue[0]}</p>`
            break;
        case 1:
            coinValue[1] = coinValue[1] + userLogged.sol;
            coinValueHtml = `<p id="coinQuantity">Tienes ${coinValue[1]}</p>`
            break;
        case 2:
            coinValue[2] = coinValue[2] + userLogged.dcr;
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
                    ${tagHtml}
                    ${coinValueHtml}
                    <p id="coinValue" class="cards__coin--value">Valor individual de la moneda: ${formatCurrency(item.coinValue)}</p>
                    <!--Los botones me toco validarlo de esta manera para que sea más "profesional"-->
                    <div class="cards__buttons">
                        <div class="cards__button cards__buy">
                            <!--button-->
                            <button class="buyButton">Comprar</button>
                            <!--drop-->
                            <div class="buyDrop cards__drop">
                            <div class="flexDrop">
                                <p>¿Cuantas deseas comprar?</p>
                                <div class="cards__drop--item">
                                    <button class="buyMinus">-</button>
                                    <p class="buyQuantity">0</p>
                                    <button class="buyPlus">+</button>
                                </div>
                                <button class="buyCoins">Listo</button>
                            </div>
                            </div>
                        </div>
                        <!---->
                        <div class="cards__button cards__sell">
                            <!--button-->
                            <button class="sellButton">Vender</button>
                            <!--drop-->
                            <div class="sellDrop cards__drop">
                            <div class="flexDrop">
                                <p>¿Cuantas deseas vender?</p>
                                <div class="cards__drop--item">
                                    <button class="sellMinus">-</button>
                                    <p class="sellQuantity">0</p>
                                    <button class="sellPlus">+</button>
                                </div>
                                <button class="sellCoins">Listo</button>
                            </div>
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
        let totalMonedaComprada = parseInt(item.coinValue) * comprarCantidad[parseInt(item.id)];
        switch (parseInt(item.id)) {
            //DASH CRIPTOMONEDA
            case 0:
                if (totalMonedaComprada < parseInt(userLogged.dollar)) {
                    let total = parseInt(userLogged.dollar) - totalMonedaComprada;
                    let plus = parseInt(userLogged.dash) + comprarCantidad[0];
                    await setDoc(doc(db, "users", userLogged.uid), {
                        dcr: userLogged.dcr,
                        dash: plus,
                        dollar: total,
                        email: userLogged.email,
                        isAdmin: userLogged.isAdmin,
                        ltc: userLogged.ltc,
                        name: userLogged.name,
                        sol: userLogged.sol,
                        password: userLogged.password,
                        xmr: userLogged.xmr
                    });
                    createMov(totalMonedaComprada, item.name, plus, userLogged.sol, userLogged.dcr, userLogged.ltc, userLogged.xmr, comprarCantidad[0], parseInt(item.coinValue));
                    alert("Compraste " + comprarCantidad[0] + " de " + item.name + " por " + totalMonedaComprada + " y tienes: " + total);
                    window.location.reload();
                } else {
                    alert("No tienes el dinero suficiente para comprar más monedas, reduzca la cantidad");
                }
                break;
            case 1:
                if (totalMonedaComprada < parseInt(userLogged.dollar)) {
                    //let totalMonedaComprada = parseInt(item.coinValue) * comprarCantidad[1];
                    let total = parseInt(userLogged.dollar) - totalMonedaComprada;
                    let plus = parseInt(userLogged.sol) + comprarCantidad[1];
                    await setDoc(doc(db, "users", userLogged.uid), {
                        dcr: userLogged.dcr,
                        dash: userLogged.dash,
                        dollar: total,
                        email: userLogged.email,
                        isAdmin: userLogged.isAdmin,
                        ltc: userLogged.ltc,
                        name: userLogged.name,
                        sol: plus,
                        password: userLogged.password,
                        xmr: userLogged.xmr
                    });
                    createMov(totalMonedaComprada, item.name, userLogged.dash, plus, userLogged.dcr, userLogged.ltc, userLogged.xmr, comprarCantidad[1], parseInt(item.coinValue));
                    alert("Compraste " + comprarCantidad[1] + " de " + item.name + " por " + totalMonedaComprada + " y tienes: " + total);
                    window.location.reload();
                } else {
                    alert("No tienes el dinero suficiente para comprar más monedas, reduzca la cantidad");
                }
                break;
            case 2:
                if (totalMonedaComprada < parseInt(userLogged.dollar)) {
                    //let totalMonedaComprada = parseInt(item.coinValue) * comprarCantidad[2];
                    let total = parseInt(userLogged.dollar) - totalMonedaComprada;
                    let plus = parseInt(userLogged.dcr) + comprarCantidad[2];
                    await setDoc(doc(db, "users", userLogged.uid), {
                        dcr: plus,
                        dash: userLogged.dash,
                        dollar: total,
                        email: userLogged.email,
                        isAdmin: userLogged.isAdmin,
                        ltc: userLogged.ltc,
                        name: userLogged.name,
                        sol: userLogged.sol,
                        password: userLogged.password,
                        xmr: userLogged.xmr
                    });
                    createMov(totalMonedaComprada, item.name, userLogged.dash, userLogged.sol, plus, userLogged.ltc, userLogged.xmr, comprarCantidad[2], parseInt(item.coinValue));
                    alert("Compraste " + comprarCantidad[2] + " de " + item.name + " por " + totalMonedaComprada + " y tienes: " + total);
                    window.location.reload();
                } else {
                    alert("No tienes el dinero suficiente para comprar más monedas, reduzca la cantidad");
                }
                break;
            case 3:
                if (totalMonedaComprada < parseInt(userLogged.dollar)) {
                    let total = parseInt(userLogged.dollar) - totalMonedaComprada;
                    let plus = parseInt(userLogged.ltc) + comprarCantidad[3];
                    await setDoc(doc(db, "users", userLogged.uid), {
                        dcr: userLogged.dcr,
                        dash: userLogged.dash,
                        dollar: total,
                        email: userLogged.email,
                        isAdmin: userLogged.isAdmin,
                        ltc: plus,
                        name: userLogged.name,
                        sol: userLogged.sol,
                        password: userLogged.password,
                        xmr: userLogged.xmr
                    });
                    createMov(totalMonedaComprada, item.name, userLogged.dash, userLogged.sol, userLogged.dcr, plus, userLogged.xmr, comprarCantidad[3], parseInt(item.coinValue));
                    alert("Compraste " + comprarCantidad[3] + " de " + item.name + " por " + totalMonedaComprada + " y tienes: " + total);
                    window.location.reload();
                } else {
                    alert("No tienes el dinero suficiente para comprar más monedas, reduzca la cantidad");
                }
                break;
            case 4:
                if (totalMonedaComprada < parseInt(userLogged.dollar)) {
                    //let totalMonedaComprada = parseInt(item.coinValue) * comprarCantidad[4];
                    let total = parseInt(userLogged.dollar) - totalMonedaComprada;
                    let plus = parseInt(userLogged.xmr) + comprarCantidad[4];
                    await setDoc(doc(db, "users", userLogged.uid), {
                        dcr: userLogged.dcr,
                        dash: userLogged.dash,
                        dollar: total,
                        email: userLogged.email,
                        isAdmin: userLogged.isAdmin,
                        ltc: userLogged.ltc,
                        name: userLogged.name,
                        sol: userLogged.sol,
                        password: userLogged.password,
                        xmr: plus
                    });
                    createMov(totalMonedaComprada, item.name, userLogged.dash, userLogged.sol, userLogged.dcr, userLogged.ltc, plus, comprarCantidad[4], parseInt(item.coinValue));
                    alert("Compraste " + comprarCantidad[4] + " de " + item.name + " por " + totalMonedaComprada + " y tienes: " + total);
                    window.location.reload();
                } else {
                    alert("No tienes el dinero suficiente para comprar más monedas, reduzca la cantidad");
                }
                break;
        }
    });

    //los ID para comprar monedas
    const sellCoins = card.querySelector(".sellCoins"); //<button>

    //VENDER monedas
    sellCoins.addEventListener("click", async e => {
        const date = new Date();
        switch (parseInt(item.id)) {
            case 0:
                if (userLogged.dash >= 1 && venderCantidad[0] <= userLogged.dash) {
                    let dashCoinTotal = parseInt(venderCantidad[0]) * parseInt(item.coinValue);
                    let resta = parseInt(userLogged.dash) - parseInt(venderCantidad[0]);
                    let total = parseInt(userLogged.dollar) + dashCoinTotal;
                    console.log(total);
                    await setDoc(doc(db, "users", userLogged.uid), {
                        dcr: userLogged.dcr,
                        dash: resta,
                        dollar: total,
                        email: userLogged.email,
                        isAdmin: userLogged.isAdmin,
                        ltc: userLogged.ltc,
                        name: userLogged.name,
                        sol: userLogged.sol,
                        password: userLogged.password,
                        xmr: userLogged.xmr
                    });
                    createMovGanar(dashCoinTotal, item.name, resta, userLogged.sol, userLogged.dcr, userLogged.ltc, userLogged.xmr, venderCantidad[0], parseInt(item.coinValue));
                    alert("Vendiste " + venderCantidad[0] + " de " + item.name + " por " + dashCoinTotal + " y tienes: " + total);
                    window.location.reload();
                } else {
                    alert("Puedes que tengas menos monedas de la cantidad que quieres vender");
                }
                break;
            case 1:
                if (userLogged.sol >= 1 && venderCantidad[1] <= userLogged.sol) {
                    //let resta = parseInt(userLogged) - parseInt();
                    let solCoinTotal = parseInt(venderCantidad[1]) * parseInt(item.coinValue);
                    let resta = parseInt(userLogged.sol) - parseInt(venderCantidad[1]);
                    let total = parseInt(userLogged.dollar) + solCoinTotal;
                    console.log(total);
                    await setDoc(doc(db, "users", userLogged.uid), {
                        dcr: userLogged.dcr,
                        dash: userLogged.dash,
                        dollar: total,
                        email: userLogged.email,
                        isAdmin: userLogged.isAdmin,
                        ltc: userLogged.ltc,
                        name: userLogged.name,
                        sol: resta,
                        password: userLogged.password,
                        xmr: userLogged.xmr
                    });
                    createMovGanar(solCoinTotal, item.name, userLogged.dash, resta, userLogged.dcr, userLogged.ltc, userLogged.xmr, venderCantidad[1], parseInt(item.coinValue));
                    alert("Vendiste " + venderCantidad[1] + " de " + item.name + " por " + solCoinTotal + " y tienes: " + total);
                    window.location.reload();
                } else {
                    alert("Puedes que tengas menos monedas de la cantidad que quieres vender");
                }
                break;
            case 2:
                if (userLogged.dcr >= 1 && venderCantidad[2] <= userLogged.dcr) {
                    let dcrCoinTotal = parseInt(venderCantidad[2]) * parseInt(item.coinValue);
                    let resta = parseInt(userLogged.dcr) - parseInt(venderCantidad[2]);
                    let total = parseInt(userLogged.dollar) + dcrCoinTotal;
                    console.log(total);
                    await setDoc(doc(db, "users", userLogged.uid), {
                        dcr: resta,
                        dash: userLogged.dash,
                        dollar: total,
                        email: userLogged.email,
                        isAdmin: userLogged.isAdmin,
                        ltc: userLogged.ltc,
                        name: userLogged.name,
                        sol: userLogged.sol,
                        password: userLogged.password,
                        xmr: userLogged.xmr
                    });
                    createMovGanar(dcrCoinTotal, item.name, userLogged.dash, userLogged.sol, resta, userLogged.ltc, userLogged.xmr, venderCantidad[2], parseInt(item.coinValue));
                    alert("Vendiste " + venderCantidad[2] + " de " + item.name + " por " + dcrCoinTotal + " y tienes: " + total);
                    window.location.reload();
                } else {
                    alert("Puedes que tengas menos monedas de la cantidad que quieres vender");
                }
                break;
            case 3:
                if (userLogged.ltc >= 1 && venderCantidad[3] <= userLogged.ltc) {
                    //let resta = parseInt(userLogged) - parseInt();
                    let ltcCoinTotal = parseInt(venderCantidad[3]) * parseInt(item.coinValue);
                    let resta = parseInt(userLogged.ltc) - parseInt(venderCantidad[3]);
                    let total = parseInt(userLogged.dollar) + ltcCoinTotal;
                    console.log(total);
                    await setDoc(doc(db, "users", userLogged.uid), {
                        dcr: userLogged.dcr,
                        dash: userLogged.dash,
                        dollar: total,
                        email: userLogged.email,
                        isAdmin: userLogged.isAdmin,
                        ltc: resta,
                        name: userLogged.name,
                        sol: userLogged.sol,
                        password: userLogged.password,
                        xmr: userLogged.xmr
                    });
                    createMovGanar(ltcCoinTotal, item.name, userLogged.dash, userLogged.sol, userLogged.dcr, resta, userLogged.xmr, venderCantidad[3], parseInt(item.coinValue));
                    alert("Vendiste " + venderCantidad[3] + " de " + item.name + " por " + ltcCoinTotal + " y tienes: " + total);
                    window.location.reload();
                } else {
                    alert("Puedes que tengas menos monedas de la cantidad que quieres vender");
                }
                break;
            case 4:
                if (userLogged.xmr >= 1 && venderCantidad[4] <= userLogged.xmr) {
                    let xmrCoinTotal = parseInt(venderCantidad[4]) * parseInt(item.coinValue);
                    let resta = parseInt(userLogged.xmr) - parseInt(venderCantidad[4]);
                    let total = parseInt(userLogged.dollar) + xmrCoinTotal;
                    console.log(total);
                    await setDoc(doc(db, "users", userLogged.uid), {
                        dcr: userLogged.dcr,
                        dash: userLogged.dash,
                        dollar: total,
                        email: userLogged.email,
                        isAdmin: userLogged.isAdmin,
                        ltc: userLogged.ltc,
                        name: userLogged.name,
                        sol: userLogged.sol,
                        password: userLogged.password,
                        xmr: resta
                    });
                    createMovGanar(xmrCoinTotal, item.name, userLogged.dash, userLogged.sol, userLogged.dcr, userLogged.ltc, resta, venderCantidad[4], parseInt(item.coinValue));
                    alert("Vendiste " + venderCantidad[4] + " de " + item.name + " por " + xmrCoinTotal + " y tienes: " + total);
                    window.location.reload();
                } else {
                    alert("Puedes que tengas menos monedas de la cantidad que quieres vender");
                }
                break;
        }
    });

};

//Tener un arreglo de cards
let movimientosDocs = [];

//Generar los movimientos
const createMov = async (total, name, dash, sol, dcr, ltc, xmr, cantidad, precio) => {
    try {
        const movimiento = await addDoc(collection(db, "movimientos"), {
            name: userLogged.name,
            inversion: total,
            nombreMoneda: name,
            precio: precio,
            cantidad: cantidad,
            dash: dash,
            sol: sol,
            dcr: dcr,
            ltc: ltc,
            xmr: xmr,
            date: Date()
        });
    } catch (e) {
        console.log(e)
    }
};

//Lectura de firebase sobre los CARDS que estan y sus respectivos precios
const getAllMovimientos = async () => {
    const collectionRef = collection(db, "movimientos");
    const { docs } = await getDocs(collectionRef);

    movimientosDocs = docs.map((doc) => {
        return {
            ...doc.data(),
            id: doc.id,
        }
    });
    // Recorro cada uno de los 5 cartas que tengo en mi arreglo
    movimientosDocs.forEach(movimiento => {
        // Llamo la funcion productTemplate para cada product.
        renderMovimiento(movimiento);
    });
    return movimientosDocs;
};

//Render de movimientos
const renderMovimiento = (item) => {
    const card = document.createElement("div");
    //const datees = item.date.toDate().toDateString();
    card.innerHTML = `<p>${item.name} invirtió ${item.cantidad} * ${item.precio} y el total es: ${item.inversion} de ${item.nombreMoneda}. Dash: ${item.dash}, SOL: ${item.sol}, DCR: ${item.dcr}, LTC: ${item.ltc}, XMR: ${item.xmr}. DATE: ${item.date}</p>`;

    // Agregar cada producto a nuestro contenedor
    movimientoSection.appendChild(card);
}



//Generar los movimientos
const createMovGanar = async (total, name, dash, sol, dcr, ltc, xmr, cantidad, precio) => {
    try {
        const movimiento = await addDoc(collection(db, "movimientosGanar"), {
            name: userLogged.name,
            ganancias: total,
            nombreMoneda: name,
            cantidad: cantidad,
            precio: precio,
            dash: dash,
            sol: sol,
            dcr: dcr,
            ltc: ltc,
            xmr: xmr,
            date: Date()
        });
    } catch (e) {
        console.log(e)
    }
};

//Tener un arreglo de cards
let movimientosGanar = [];

//Lectura de firebase sobre los CARDS que estan y sus respectivos precios
const getAllMovimientosGanar = async () => {
    const collectionRef = collection(db, "movimientosGanar");
    const { docs } = await getDocs(collectionRef);

    movimientosGanar = docs.map((doc) => {
        return {
            ...doc.data(),
            id: doc.id,
        }
    });
    // Recorro cada uno de los 5 cartas que tengo en mi arreglo
    movimientosGanar.forEach(movimiento => {
        // Llamo la funcion productTemplate para cada product.
        renderMovimientoGanar(movimiento);
    });
    return movimientosGanar;
};

//Render de movimientos
const renderMovimientoGanar = (item) => {
    const card = document.createElement("div");
    card.innerHTML = `<p>${item.name} obtuvo de ${item.cantidad} * ${item.precio} y el total de ${item.ganancias} de ${item.nombreMoneda}. Dash: ${item.dash}, SOL: ${item.sol}, DCR: ${item.dcr}, LTC: ${item.ltc}, XMR: ${item.xmr}. DATE: ${item.date}</p>`;

    // Agregar cada producto a nuestro contenedor
    ventaMovimientosSection.appendChild(card);
}


const admin = document.getElementById("admin");

//Reconocer el estado del usuario.
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userInfo = await getUserInfo(user.uid);
        console.log(userInfo);
        username.innerHTML = "Bienvenido " + userInfo.name;
        plata.innerHTML = "Tu plata es: " + formatCurrency(userInfo.dollar);

        if (userInfo.isAdmin == true) {
            admin.classList.add("visible");
            admin.classList.remove("hidden");
        } else if (userInfo.isAdmin == false) {
            admin.classList.remove("visible");
        }

        loginButton.classList.add("hidden");
        logoutButton.classList.remove("hidden");
        logoutButton.classList.add("visible");

        //Para poder usar los datos del usuario en otro lados.
        userLogged = {
            ...user,
            ...userInfo
        };
    } else {
    }
    getAllCards();
    getAllMovimientos();
    getAllMovimientosGanar();
});
