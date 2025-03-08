// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase configuration (Replace with your actual Firebase config)
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

// Function to fetch member details
async function fetchDetails() {
    let accountNumber = document.getElementById("accountInput").value.trim();

    if (!accountNumber) {
        alert("Please enter an Account Number!");
        return;
    }

    console.log("Fetching details for Account Number:", accountNumber); // Debug log

    try {
        const membersRef = collection(db, "members");
        const q = query(membersRef, where("AccountNumber", "==", accountNumber));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log("No member found!");
            alert("No member found with this Account Number!");
            resetMemberDetails();
            return;
        }

        querySnapshot.forEach((doc) => {
            let data = doc.data();
            console.log("Member Data:", data); // Debug log

            // Update HTML with fetched data
            document.getElementById("name").innerText = data.Name || "--";
            document.getElementById("savings").innerText = data.Savings || "--";
            document.getElementById("loanInterest").innerText = data.LoanInterest || "--";
            document.getElementById("loanPaid").innerText = data.LoanPaid || "--";
            document.getElementById("penalty").innerText = data.Penalty || "--";
            document.getElementById("loanTaken").innerText = data.LoanTaken || "--";
        });

        // Fetch Transactions
        fetchTransactions(accountNumber);

    } catch (error) {
        console.error("Error fetching member data:", error);
        alert("Error fetching data. Check console for details.");
    }
}

// Function to reset member details if no data is found
function resetMemberDetails() {
    document.getElementById("name").innerText = "--";
    document.getElementById("savings").innerText = "--";
    document.getElementById("loanInterest").innerText = "--";
    document.getElementById("loanPaid").innerText = "--";
    document.getElementById("penalty").innerText = "--";
    document.getElementById("loanTaken").innerText = "--";
}

// Function to fetch transaction details
async function fetchTransactions(accountNumber) {
    console.log("Fetching transactions for Account Number:", accountNumber); // Debug log

    try {
        const transactionsRef = collection(db, "transactions");
        const q = query(transactionsRef, where("AccountNumber", "==", accountNumber));
        const querySnapshot = await getDocs(q);

        let transactionTable = document.getElementById("transactionTable");
        transactionTable.innerHTML = ""; // Clear previous data

        if (querySnapshot.empty) {
            console.log("No transactions found!");
            transactionTable.innerHTML = "<tr><td colspan='4'>No transactions found</td></tr>";
            return;
        }

        querySnapshot.forEach((doc) => {
            let data = doc.data();
            console.log("Transaction Data:", data); // Debug log

            let row = `<tr>
                <td>${data.Date || "--"}</td>
                <td>${data.Description || "--"}</td>
                <td>${data.Amount || "--"}</td>
                <td>${data.Type || "--"}</td>
            </tr>`;
            transactionTable.innerHTML += row;
        });

    } catch (error) {
        console.error("Error fetching transactions:", error);
        alert("Error fetching transactions. Check console for details.");
    }
}

// Attach event listener to button
document.getElementById("fetchBtn").addEventListener("click", fetchDetails);
