import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = process.env.PORT || 8000;

server.set('port', port);
server.use(express.static('public'));
server.use(express.json()); // Middleware to parse JSON request bodies

// Global variable to store decks
const decks = {};

// Helper function to create a new deck
function createDeck() {
    const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace'];
    const deck = [];

    suits.forEach(suit => {
        ranks.forEach(rank => {
            deck.push(`${rank} of ${suit}`);
        });
    });

    return deck;
}

// Helper function to shuffle a deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]]; // Swap elements
    }
}

// POST /temp/deck - Create a new deck
server.post('/temp/deck', (req, res) => {
    const deckId = uuidv4(); // Generate a unique ID for the deck
    const deck = createDeck(); // Create a standard deck of 52 cards
    decks[deckId] = deck; // Store the deck on the server

    res.status(HTTP_CODES.SUCCESS.CREATED).send({ deck_id: deckId }).end();
});

// PATCH /temp/deck/shuffle/:deck_id - Shuffle the specified deck
server.patch('/temp/deck/shuffle/:deck_id', (req, res) => {
    const { deck_id } = req.params;

    if (!decks[deck_id]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
            .send({ error: `Deck with ID ${deck_id} not found.` })
            .end();
    }

    if (decks[deck_id].length === 0) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST)
            .send({ error: `Deck ${deck_id} is empty and cannot be shuffled.` })
            .end();
    }

    shuffleDeck(decks[deck_id]);
    res.status(HTTP_CODES.SUCCESS.OK).send({ message: `Deck ${deck_id} has been shuffled.` }).end();
});


// GET /temp/deck/:deck_id - Return the entire deck (remaining cards)
server.get('/temp/deck/:deck_id', (req, res) => {
    const { deck_id } = req.params;

    if (!decks[deck_id]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({ error: `Deck with ID ${deck_id} not found.` }).end();
    }

    res.status(HTTP_CODES.SUCCESS.OK).send({ deck: decks[deck_id] }).end();
});

// GET /temp/deck/:deck_id/card - Draw and return a random card
server.get('/temp/deck/:deck_id/card', (req, res) => {
    const { deck_id } = req.params;

    if (!decks[deck_id]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({ error: `Deck with ID ${deck_id} not found.` }).end();
    }

    const deck = decks[deck_id];
    if (deck.length === 0) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).send({ error: `Deck ${deck_id} is empty.` }).end();
    }

    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(randomIndex, 1)[0]; // Remove the card from the deck

    res.status(HTTP_CODES.SUCCESS.OK).send({ card }).end();
});

// Endpoints for quotes and other functionalities
const quotes = [
    "I am on a seafood diet. I see food and I eat it.",
    "Age is of no importance unless you're a cheese. — Billie Burke",
    "In three words I can sum up everything I've learned about life: it goes on. — Robert Frost",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "If life were predictable it would cease to be life, and be without flavor. - Eleanor Roosevelt"
];

function getRandomQuote(req, res, next) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    res.status(HTTP_CODES.SUCCESS.OK).send(randomQuote).end();
}

function getRoot(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK).send('Hello World').end();
}

function getPoem(req, res, next) {
    res.status(HTTP_CODES.SUCCESS.OK)
        .send('One, two, I stepped in a poo. Three, four, there is so much more. Five, six, its like a mix.')
        .end();
}

function postSum(req, res, next) {
    const a = parseFloat(req.params.a);
    const b = parseFloat(req.params.b);

    if (isNaN(a) || isNaN(b)) {
        res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST)
            .send('Invalid numbers provided.')
            .end();
    } else {
        const sum = a + b;
        res.status(HTTP_CODES.SUCCESS.OK)
            .send({ result: sum })
            .end();
    }
}

// Register routes
server.get("/", getRoot);
server.get("/tmp/poem", getPoem);
server.get("/tmp/quote", getRandomQuote);
server.post("/tmp/sum/:a/:b", postSum);
server.get("/tmp/sum/:a/:b", postSum);

server.listen(server.get('port'), function () {
    console.log('Server running on port', server.get('port'));
});
