import express from 'express';
import HTTP_CODES from './utils/httpCodes.mjs';

const server = express();
const port = process.env.PORT || 8000;

server.set('port', port);
server.use(express.static('public'));

// Liste med sitater
const quotes = [
    "I am on a seafood diet. I see food and I eat it.",
    "Age is of no importance unless you're a cheese. — Billie Burke",
    "In three words I can sum up everything I've learned about life: it goes on. — Robert Frost",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "If life were predictable it would cease to be life, and be without flavor. - Eleanor Roosevelt"
];

// Funksjon for å hente et tilfeldig sitat
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

// Funksjon for å håndtere /tmp/sum/a/b
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

// Endepunkter
server.get("/", getRoot);
server.get("/tmp/poem", getPoem);
server.get("/tmp/quote", getRandomQuote);
server.post("/tmp/sum/:a/:b", postSum);
server.get("/tmp/sum/:a/:b", postSum);

server.listen(server.get('port'), function () {
    console.log('Server running on port', server.get('port'));
});
