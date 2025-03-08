// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// ✅ Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ✅ Fetch Member Details
async function fetchDetails() {
    let accountNumber = document.getElementById("accountInput").value.trim();
    if (accountNumber === "") {
        alert("Please enter an Account Number!");
        return;
    }

    try {
        let memberRef = db.collection("members").where("AccountNumber", "==", accountNumber);
        let snapshot = await memberRef.get();

        if (snapshot.empty) {
            alert("No member found with this Account Number!");
            return;
        }

        snapshot.forEach(doc => {
            let data = doc.data();
            document.getElementById("memberName").innerText = data.Name || "-";
            document.getElementById("savings").innerText = data.Savings || "0";
            document.getElementById("loanInterest").innerText = data.LoanInterest || "0";
            document.getElementById("loanPaid").innerText = data.LoanPaid || "0";
            document.getElementById("penalty").innerText = data.Penalty || "0";
            document.getElementById("loanTaken").innerText = data.LoanTaken || "0";

            fetchTransactions(accountNumber);
        });
    } catch (error) {
        console.error("Error fetching details: ", error);
        alert("Error fetching details. Please try again.");
    }
}

// ✅ Fetch Transactions
async function fetchTransactions(accountNumber) {
    let table = document.getElementById("transactionTable");
    table.innerHTML = `<tr><th>Date</th><th>Description</th><th>Amount</th><th>Type</th></tr>`; // Reset table

    try {
        let transactionRef = db.collection("transactions").where("AccountNumber", "==", accountNumber);
        let snapshot = await transactionRef.orderBy("Date", "desc").get();

        if (snapshot.empty) {
            let row = table.insertRow();
            row.insertCell(0).innerText = "-";
            row.insertCell(1).innerText = "No transactions found";
            row.insertCell(2).innerText = "-";
            row.insertCell(3).innerText = "-";
            return;
        }

        snapshot.forEach(doc => {
            let data = doc.data();
            let row = table.insertRow();
            row.insertCell(0).innerText = new Date(data.Date.toDate()).toLocaleDateString();
            row.insertCell(1).innerText = data.Description || "-";
            row.insertCell(2).innerText = data.Amount || "0";
            row.insertCell(3).innerText = data.Type || "-";
        });
    } catch (error) {
        console.error("Error fetching transactions: ", error);
        alert("Error fetching transactions. Please try again.");
    }
}

// ✅ Print Passbook
function printPassbook() {
    window.print();
}
