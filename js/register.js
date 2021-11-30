// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//Firebase createuser
const createUser = async (email, password, userFields) => {
    try{
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        const userId = user.uid;

        await setDoc(doc(db, "users", userId), userFields);

        alert("Enhorabuena te registraste "+ email);

        window.location ="./home.html";

    }catch{
        alert("correo ya existe");
    }
}

const registerBtn = document.getElementById("register");

registerBtn.addEventListener("submit", e => {
    e.preventDefault();
    const name = registerBtn.name.value;
    const email = registerBtn.email.value;
    const password = registerBtn.password.value;


    if(email && password){
        createUser(email,password, {
            name,
            email,
            password,
            isAdmin: false,
        });
    } else {
        alert("completa todos los campos");
    }
    
}
);