// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB-A6EXIcqOTff2dpUntRIwu0Ih2zNcu2o",
  authDomain: "criptograb-15c71.firebaseapp.com",
  projectId: "criptograb-15c71",
  storageBucket: "criptograb-15c71.appspot.com",
  messagingSenderId: "781843419244",
  appId: "1:781843419244:web:3875e984b8024c72e4c849"
};

const formatCurrency = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(price);
};