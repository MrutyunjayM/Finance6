import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Config
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch Member Details
async function fetchDetails() {
    const accountNumber = document.getElementById("accountInput").value.trim();

    if (!accountNumber) {
        alert("Please enter an account number.");
        return;
    }

    console.log("Fetching details for Account Number: ", accountNumber);

    try {
        const membersRef = collection(db, "members");
        const q = query(membersRef, where("AccountNumber", "==", accountNumber));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                console.log("Member Data:", data);

                document.getElementById("name").textContent = data.Name || "--";
                document.getElementById("savings").textContent = data.Savings || "--";
                document.getElementById("loanInterest").textContent = data.LoanInterest || "--";
                document.getElementById("loanPaid").textContent = data.LoanPaid || "--";
                document.getElementById("penalty").textContent = data.Penalty || "--";
                document.getElementById("loanTaken").textContent = data.LoanTaken || "--";
            });
        } else {
            console.log("No member found!");
            alert("No member found for this account number.");
        }
    } catch (error) {
        console.error("Error fetching details:", error);
        alert("Error fetching details. Check console for more info.");
    }
}

// Event Listener
document.getElementById("fetchBtn").addEventListener("click", fetchDetails);
