// 🔥 Initialize Firebase
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// 🔄 Ensure Firebase is initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// ⚡ Get Firestore instance
const db = firebase.firestore();

// 🔍 Fetch Member Details & Transactions
function fetchDetails() {
    let accountNumber = document.getElementById("accountInput").value.trim();

    if (!accountNumber) {
        alert("Please enter a valid Account Number!");
        return;
    }

    // 🔄 Get member data from Firestore
    db.collection("members").where("AccountNumber", "==", accountNumber).get()
        .then(snapshot => {
            if (snapshot.empty) {
                alert("Member not found!");
                return;
            }

            snapshot.forEach(doc => {
                let data = doc.data();
                document.getElementById("memberName").innerText = data.Name || "N/A";
                document.getElementById("savings").innerText = data.Savings || 0;
                document.getElementById("loanInterest").innerText = data.LoanInterest || 0;
                document.getElementById("loanPaid").innerText = data.LoanPaid || 0;
                document.getElementById("penalty").innerText = data.Penalty || 0;
                document.getElementById("loanTaken").innerText = data.LoanTaken || 0;

                // ✅ Now fetch transactions
                fetchTransactions(accountNumber);
            });
        })
        .catch(error => console.error("Error fetching member data:", error));
}

// 📑 Fetch Transactions
function fetchTransactions(accountNumber) {
    let transactionTable = document.getElementById("transactionTable");
    transactionTable.innerHTML = "<tr><td colspan='4'>Loading...</td></tr>";

    db.collection("transactions").where("AccountNumber", "==", accountNumber)
        .orderBy("Date", "desc")
        .get()
        .then(snapshot => {
            transactionTable.innerHTML = "";
            if (snapshot.empty) {
                transactionTable.innerHTML = "<tr><td colspan='4'>No transactions found.</td></tr>";
                return;
            }

            snapshot.forEach(doc => {
                let transaction = doc.data();
                let row = `<tr>
                    <td>${transaction.Date || '--'}</td>
                    <td>${transaction.Description || '--'}</td>
                    <td>${transaction.Amount || '--'}</td>
                    <td>${transaction.Type || '--'}</td>
                </tr>`;
                transactionTable.innerHTML += row;
            });
        })
        .catch(error => console.error("Error fetching transactions:", error));
}

// 🖨️ Print Passbook
function printPassbook() {
    window.print();
}

// 🚀 Debugging Log
console.log("Finance portal script loaded successfully.");
