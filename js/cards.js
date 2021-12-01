import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cards = [
        {
            id: 1,
            name: "Bitcoin (BTC)",
            coinValue: "57297",
            coinQuantity: "0",
            isUp: true,
            isDown: false,
            image: "https://http2.mlstatic.com/D_NQ_NP_682739-MLA47727283112_102021-W.webp",
        },
        {
            id: 2,
            name: "NEO (NEO)",
            coinValue: "38",
            coinQuantity: "0",
            isUp: true,
            isDown: false,
            image: "https://http2.mlstatic.com/D_NQ_NP_682739-MLA47727283112_102021-W.webp",
        },
        {
            id: 3,
            name: "Binance Coin (BNB)",
            coinValue: "631",
            coinQuantity: "0",
            isUp: true,
            isDown: false,
            image: "https://http2.mlstatic.com/D_NQ_NP_682739-MLA47727283112_102021-W.webp",
        },
        {
            id: 4,
            name: "Litecoin (LTC)",
            coinValue: "211",
            coinQuantity: "0",
            isUp: true,
            isDown: false,
            image: ["https://http2.mlstatic.com/D_NQ_NP_682739-MLA47727283112_102021-W.webp"]
        },
        {
            id: 5,
            name: "Monero (XMR)",
            coinValue: "242",
            coinQuantity: "0",
            isUp: true,
            isDown: false,
            image: ["https://http2.mlstatic.com/D_NQ_NP_682739-MLA47727283112_102021-W.webp"]
        }
    ];

    cards.forEach(async (card) => {
        await setDoc(doc(db, "cards", `M434234DUS23422S${card.id}`), card);
    });