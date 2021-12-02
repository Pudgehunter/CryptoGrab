import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getFirestore, setDoc, doc } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cards = [
        {
            id: 0,
            name: "Dash Coin (DASH)",
            coinValue: "183",
            coinQuantity: "0",
            isUp: true,
            isDown: false,
            image: "https://invezz.com/wp-content/uploads/2020/06/liquid-partners-with-dash-1280x720.jpg",
        },
        {
            id: 1,
            name: "Solana (SOL)",
            coinValue: "229",
            coinQuantity: "0",
            isUp: true,
            isDown: false,
            image: "https://cdn.bitpanda.com/media/blog/posts/solana-sol-the-crypto-of-scale-and-speed-in-the-spotlight.jpg",
        },
        {
            id: 2,
            name: "Decred (DCR)",
            coinValue: "107",
            coinQuantity: "0",
            isUp: true,
            isDown: false,
            image: "https://www.tecnologia.press/wp-content/uploads/2019/08/Decred-privacidad-mixnet-transacciones-740x446.jpg",
        },
        {
            id: 3,
            name: "Litecoin (LTC)",
            coinValue: "211",
            coinQuantity: "0",
            isUp: true,
            isDown: false,
            image: ["https://assets.cmcmarkets.com/images/1580224251_Litecoin_extra.jpg"]
        },
        {
            id: 4,
            name: "Monero (XMR)",
            coinValue: "242",
            coinQuantity: "0",
            isUp: true,
            isDown: false,
            image: ["https://bitcoin.es/wp-content/uploads/2018/10/privacy-monero-coins-1.png"]
        }
    ];

    cards.forEach(async (card) => {
        await setDoc(doc(db, "cards", `${card.id}`), card);
    });