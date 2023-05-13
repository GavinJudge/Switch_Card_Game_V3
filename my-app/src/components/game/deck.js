// Define an array of the four suits in a standard deck of cards.
// Define an array of the thirteen values in a standard deck of cards.
const SUITS = ["♠", "♣", "♥", "♦"]
const VALUES = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K"
]

// Deck class for the cards
class Deck {
  constructor(cards = freshDeck()) {
    this.cards = cards
  }

  // returns the number of cards in a deck
  get numberOfCards() {
    return this.cards.length
  }

  // removes top card from the deck 
  pop() {
    return this.cards.shift()
  }

  // Adds a card to the bottom of the deck.
  push(card) {
    this.cards.push(card)
  }

  // shuffle the decks 
  shuffle() {
    for (let i = this.numberOfCards - 1; i > 0; i--) {
      const newIndex = Math.floor(Math.random() * (i + 1))
      const oldValue = this.cards[newIndex]
      this.cards[newIndex] = this.cards[i]
      this.cards[i] = oldValue
    }
  }

   // Returns an array of all cards in the deck
   getCards() {
    return this.cards;
  }
}

// Card class for a single card
class Card {
  constructor(suit, value) {
    this.suit = suit
    this.value = value
  }

  // returns the colour of the card 
  get color() {
    return this.suit === "♣" || this.suit === "♠" ? "black" : "red"
  }

  // returns the html elelent of the card 
  getHTML() {
    const cardDiv = document.createElement("div")
    cardDiv.innerText = this.suit
    cardDiv.classList.add("card", this.color)
    cardDiv.dataset.value = `${this.value} ${this.suit}`
    return cardDiv
  }
}

// this function returns a fresh deck of cards 
function freshDeck() {
  return SUITS.flatMap(suit => {
    return VALUES.map(value => {
      return new Card(suit, value)
    })
  })
}

module.exports = {
  Deck,
  Card
};