import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import HTTP_CODES from './utils/httpCodes.mjs';
import log from './modules/log.mjs';
import { LOGG_LEVELS, eventLogger } from './modules/log.mjs';

const ENABLE_LOGGING = false;

const server = express();
const port = process.env.PORT || 8000;

const logger = log(LOGG_LEVELS.VERBOSE);

server.set('port', port);
server.use(logger);
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

// Helper function to shuffle deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

//Create a deck
function createDeckSeed(req, res){
    const deckId = uuidv4(); // Generate a unique ID for the deck
    const deck = createDeck(); // Create a standard deck of 52 cards
    decks[deckId] = deck;

    res.status(HTTP_CODES.SUCCESS.CREATED).send({ deck_id: deckId }).end();
}

//Shuffle the deck
function deckShuffle(req, res){
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
}


//Return the deck
function createDeckiD(req, res){
    const { deck_id } = req.params;

    if (!decks[deck_id]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({ error: `Deck with ID ${deck_id} not found.` }).end();
    }

    res.status(HTTP_CODES.SUCCESS.OK).send({ deck: decks[deck_id] }).end();
}

//Draw a random card
function drawCard(req, res){
    const { deck_id } = req.params;

    if (!decks[deck_id]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND).send({ error: `Deck with ID ${deck_id} not found.` }).end();
    }

    const deck = decks[deck_id];
    if (deck.length === 0) {
        return res.status(HTTP_CODES.CLIENT_ERROR.BAD_REQUEST).send({ error: `Deck ${deck_id} is empty.` }).end();
    }

    const randomIndex = Math.floor(Math.random() * deck.length);
    const card = deck.splice(randomIndex, 1)[0];

    res.status(HTTP_CODES.SUCCESS.OK).send({ card }).end();
}

// Endpoints for quotes
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
    eventLogger("Noen spurte etter root");
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
server.post("/temp/deck", createDeckSeed);
server.patch("/temp/deck/shuffle/:deck_id", deckShuffle);
server.get("/temp/deck/:deck_id", createDeckiD);
server.get("/temp/deck/:deck_id/card", drawCard);


server.listen(server.get('port'), function () {
    console.log('Server running on port', server.get('port'));
});
