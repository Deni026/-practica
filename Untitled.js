// Untitled.js

// DOM Elements
const addCardButton = document.getElementById('addCardButton');
const cardForm = document.getElementById('cardForm');
const cardList = document.getElementById('cardList');
const transactionPanel = document.getElementById('transactionPanel');
const cardNameInput = document.getElementById('cardName');
const cardNumberInput = document.getElementById('cardNumber');
const cardBalanceInput = document.getElementById('cardBalance');
const cardImageSelect = document.getElementById('cardImage');

// Load cards from localStorage
let cards = JSON.parse(localStorage.getItem('cards')) || [];
let activeCardIndex = null;

// Initialize the application
function init() {
    renderCards();
    if (cards.length > 0) {
        selectCard(0);
    }
}

// Add a new card
addCardButton.addEventListener('click', () => {
    const cardName = cardNameInput.value.trim();
    const cardNumber = cardNumberInput.value.trim();
    const cardBalance = parseFloat(cardBalanceInput.value.trim());
    const cardImage = cardImageSelect.value;

    if (!validateCard(cardName, cardNumber, cardBalance)) {
        alert('Invalid card details. Please check your input.');
        return;
    }

    const newCard = {
        name: cardName,
        number: cardNumber,
        balance: cardBalance,
        image: cardImage,
        transactions: [],
    };

    cards.push(newCard);
    saveCards();
    renderCards();
    cardForm.reset();
});

// Validate card details
function validateCard(name, number, balance) {
    const cardNumberRegex = /^\d{16}$/;
    return (
        name.length > 0 &&
        cardNumberRegex.test(number) &&
        !isNaN(balance) &&
        balance >= 0
    );
}

// Render cards in the list
function renderCards() {
    cardList.innerHTML = '';
    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.className = `card ${index === activeCardIndex ? 'active' : ''}`;
        cardElement.innerHTML = `
            <img src="${card.image}" alt="Card Image">
            <div class="card-details">
                <h3>${card.name}</h3>
                <p>**** **** **** ${card.number.slice(-4)}</p>
                <p>Balance: $${card.balance.toFixed(2)}</p>
            </div>
        `;
        cardElement.addEventListener('click', () => selectCard(index));
        cardList.appendChild(cardElement);
    });
}

// Select a card
function selectCard(index) {
    activeCardIndex = index;
    renderCards();
    renderTransactions();
}

// Render transactions for the active card
function renderTransactions() {
    if (activeCardIndex === null) return;
    const activeCard = cards[activeCardIndex];
    transactionPanel.innerHTML = `
        <h2>Transactions for ${activeCard.name}</h2>
        <ul>
            ${activeCard.transactions
                .map(
                    (transaction) =>
                        `<li>${transaction.date}: ${transaction.amount > 0 ? '+' : ''}$${transaction.amount.toFixed(
                            2
                        )}</li>`
                )
                .join('')}
        </ul>
    `;
}

// Save cards to localStorage
function saveCards() {
    localStorage.setItem('cards', JSON.stringify(cards));
}

// Initialize the app on page load
document.addEventListener('DOMContentLoaded', init);