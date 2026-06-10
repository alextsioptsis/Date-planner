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

// 1. Λογική για το κουμπί "Όχι" που δραπετεύει (Υποστήριξη για PC & Κινητά)
noBtn.addEventListener('mouseover', moveNoButton);
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Εμποδίζει το κινητό από το να κάνει το κλασικό click
    moveNoButton();
});
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    moveNoButton();
});

function moveNoButton() {
    // Υπολογισμός ορίων της οθόνης με ένα μικρό padding για να μην κολλάει στις άκρες
    const padding = 30;
    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;

    // Παραγωγή τυχαίων συντεταγμένων (ελάχιστο το padding)
    const randomX = Math.max(padding, Math.floor(Math.random() * maxX));
    const randomY = Math.max(padding, Math.floor(Math.random() * maxY));

    // Εφαρμογή της νέας θέσης στην οθόνη
    noBtn.style.position = 'fixed';
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
        
        const formattedDate = new Date(dateDetails.date).toLocaleDateString('el-GR');

        summaryText.innerHTML = `Να είσαι έτοιμη στις <b>${dateDetails.time}</b> στις <b>${formattedDate}</b>.<br><br>Ετοιμάσου για <b>${dateDetails.food}</b>!`;

        step3.classList.add('hidden');
        step4.classList.remove('hidden');

        // --- ΕΔΩ ΜΠΑΙΝΕΙ ΤΟ DISCORD WEBHOOK ---
        const discordWebhookUrl = "https://discord.com/api/webhooks/1514354633861238824/RK9gVPLjmS4y7-L-VPxkmaumoKJOUcEwTWcv5yoZyg2rDatH8uam33RT-Kwpigtm2VYH";

        const messageData = {
            content: "🚨 **ΝΕΟ ΡΑΝΤΕΒΟΥ ΚΛΕΙΣΤΗΚΕ!** 🚨",
            embeds: [{
                title: "🌹 Date Details",
                color: 15418777,
                fields: [
                    { name: "Ημερομηνία 📅", value: formattedDate, inline: true },
                    { name: "Ώρα ⏰", value: dateDetails.time, inline: true },
                    { name: "Φαγητό 🍕", value: dateDetails.food, inline: true }
                ],
                footer: { text: "Απάντηση από το Date Planner App σου!" }
            }]
        };

        fetch(discordWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(messageData)
        })
        .then(response => console.log('Το Discord ενημερώθηκε επιτυχώς!'))
        .catch(error => console.error('Σφάλμα κατά την αποστολή στο Discord:', error));
    });
});
