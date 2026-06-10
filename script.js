// Elements
const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const step3 = document.getElementById('step-3');
const step4 = document.getElementById('step-4');

const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const nextToFoodBtn = document.getElementById('next-to-food');
const foodCards = document.querySelectorAll('.food-card');
const summaryText = document.getElementById('summary-text');

// Object για να αποθηκεύσουμε τις επιλογές
let dateDetails = {
    date: '',
    time: '',
    food: ''
};

// 1. Λογική για το κουμπί "Όχι" που δραπετεύει
noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('click', moveNoButton); // Για mobile συσκευές που δεν έχουν hover

function moveNoButton() {
    // Υπολογισμός ορίων ώστε το κουμπί να μην βγαίνει εντελώς εκτός οθόνης
    const padding = 20;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;

    // Παραγωγή τυχαίων συντεταγμένων
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);

    // Εφαρμογή των νέων θέσεων
    noBtn.style.position = 'fixed'; // Αλλάζουμε σε fixed για να κινείται σε όλη την οθόνη
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
}

// 2. Μετάβαση από Step 1 σε Step 2 (Όταν πατηθεί το ΝΑΙ)
yesBtn.addEventListener('click', () => {
    step1.classList.add('hidden');
    step2.classList.remove('hidden');
});

// 3. Μετάβαση από Step 2 σε Step 3 (Αποθήκευση Ημερομηνίας/Ώρας)
nextToFoodBtn.addEventListener('click', () => {
    const dateVal = document.getElementById('date-input').value;
    const timeVal = document.getElementById('time-input').value;

    if (!dateVal) {
        alert('Διάλεξε μια μέρα πρώτα! 📅');
        return;
    }

    dateDetails.date = dateVal;
    dateDetails.time = timeVal;

    step2.classList.add('hidden');
    step3.classList.remove('hidden');
});

// 4. Επιλογή Φαγητού, Εμφάνιση Τελικής Οθόνης & Αποστολή στο Discord
foodCards.forEach(card => {
    card.addEventListener('click', () => {
        dateDetails.food = card.getAttribute('data-food');
        
        // Μορφοποίηση της ημερομηνίας για να φαίνεται πιο ωραία (DD/MM/YYYY)
        const formattedDate = new Date(dateDetails.date).toLocaleDateString('el-GR');

        // Εμφάνιση του τελικού μηνύματος στην οθόνη
        summaryText.innerHTML = `Να είσαι έτοιμη στις <b>${dateDetails.time}</b> στις <b>${formattedDate}</b>.<br><br>Ετοιμάσου για <b>${dateDetails.food}</b>!`;

        step3.classList.add('hidden');
        step4.classList.remove('hidden');

        // --- ΕΔΩ ΜΠΑΙΝΕΙ ΤΟ DISCORD WEBHOOK ---
        const discordWebhookUrl = "https://discord.com/api/webhooks/1514354633861238824/RK9gVPLjmS4y7-L-VPxkmaumoKJOUcEwTWcv5yoZyg2rDatH8uam33RT-Kwpigtm2VYH";

        const messageData = {
            content: "🚨 **ΝΕΟ ΡΑΝΤΕΒΟΥ ΚΛΕΙΣΤΗΚΕ!** 🚨",
            embeds: [{
                title: "🌹 Date Details",
                color: 15418777, // Ροζ χρώμα για το embed πλαίσιο
                fields: [
                    { name: "Ημερομηνία 📅", value: formattedDate, inline: true },
                    { name: "Ώρα ⏰", value: dateDetails.time, inline: true },
                    { name: "Φαγητό 🍕", value: dateDetails.food, inline: true }
                ],
                footer: { text: "Απάντηση από το Date Planner App σου!" }
            }]
        };

        // Κάνουμε το POST request στο Discord API
        fetch(discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData)
        })
        .then(response => console.log('Το Discord ενημερώθηκε επιτυχώς!'))
        .catch(error => console.error('Σφάλμα κατά την αποστολή στο Discord:', error));
    });
});