// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to Fetch Member Details
async function fetchDetails(accountNumber) {
  try {
    console.log(`🔍 Fetching details for Account Number: ${accountNumber}`);

    const docRef = doc(db, "members", accountNumber);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("✅ Data found:", docSnap.data());

      // Populate HTML fields
      document.getElementById("savings").innerText = docSnap.data().Savings || "--";
      document.getElementById("loanInterest").innerText = docSnap.data().LoanInterest || "--";
      document.getElementById("loanPaid").innerText = docSnap.data().LoanPaid || "--";
      document.getElementById("penalty").innerText = docSnap.data().Penalty || "--";
      document.getElementById("loanTaken").innerText = docSnap.data().LoanTaken || "--";

    } else {
      console.log("❌ No member found!");
      alert("No member found with this account number.");
    }
  } catch (error) {
    console.error("🔥 Firestore Error:", error);
    alert("Error fetching data. Check console for details.");
  }
}

// Event Listener for Fetch Button
document.getElementById("fetchBtn").addEventListener("click", () => {
  const accountNumber = document.getElementById("accountNumber").value.trim();
  if (accountNumber) {
    fetchDetails(accountNumber);
  } else {
    alert("⚠️ Please enter a valid account number.");
  }
});
