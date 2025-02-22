import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import HTTP_CODES from '../utils/httpCodes.mjs';
import { createGameTree } from '../gameTree.mjs';

const router = Router();

const games = {};

router.get("/:gameId", (req, res) => {
    const { gameId } = req.params;
    
    if (!games[gameId]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
            .send({ error: "Game not found" })
            .end();
    }

    res.status(HTTP_CODES.SUCCESS.OK).send({ board: games[gameId].board }).end();
});

router.get("/:gameId/moves", (req, res) => {
    const { gameId } = req.params;

    if (!games[gameId]) {
        return res.status(HTTP_CODES.CLIENT_ERROR.NOT_FOUND)
            .send({ error: "Game not found" })
            .end();
    }

    games[gameId].generateChildren();

    const moves = games[gameId].children.map(child => child.board);
    res.status(HTTP_CODES.SUCCESS.OK).send({ possibleMoves: moves }).end();
});

// Opprett et nytt Tic-Tac-Toe spill
router.post("/new", (req, res) => {
    const gameId = uuidv4();
    const gameTree = createGameTree();
    games[gameId] = gameTree;

    res.status(HTTP_CODES.SUCCESS.CREATED).send({ gameId, board: gameTree.board }).end();
});

export default router;
