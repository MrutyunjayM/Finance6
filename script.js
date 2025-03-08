document.addEventListener("DOMContentLoaded", function () {
    // Initialize Firebase
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    // Fetch Member Details
    function fetchDetails() {
        const accountNumberInput = document.getElementById("accountNumber");
        
        // Check if element exists
        if (!accountNumberInput) {
            console.error("Error: Account Number input field not found!");
            return;
        }

        const accountNumber = accountNumberInput.value.trim();
        if (accountNumber === "") {
            alert("Please enter an account number!");
            return;
        }

        console.log("Fetching details for Account Number:", accountNumber);

        db.collection("members")
            .where("AccountNumber", "==", accountNumber)
            .get()
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("No member found!");
                    alert("No member found with this account number.");
                    return;
                }

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    document.getElementById("savings").innerText = data.Savings || "--";
                    document.getElementById("loanInterest").innerText = data.LoanInterest || "--";
                    document.getElementById("loanPaid").innerText = data.LoanPaid || "--";
                    document.getElementById("penalty").innerText = data.Penalty || "--";
                    document.getElementById("loanTaken").innerText = data.LoanTaken || "--";
                });
            })
            .catch((error) => {
                console.error("Error fetching details:", error);
                alert("Failed to fetch member details. Check console for errors.");
            });
    }

    // Assign function to global scope so it works in HTML onclick
    window.fetchDetails = fetchDetails;
});
