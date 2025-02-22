export class TreeNode {
    constructor(board, player) {
        this.board = board;  // 3x3 array som representerer brettet
        this.player = player; // 'X' eller 'O'
        this.children = [];  // Mulige neste trekk
    }

    cloneBoard() {
        return this.board.map(row => [...row]); // Kopierer brettet
    }

    generateChildren() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === " ") {  // Sjekk om feltet er tomt
                    let newBoard = this.cloneBoard();
                    newBoard[i][j] = this.player;  // Legg til spillerens trekk
                    let nextPlayer = this.player === "X" ? "O" : "X";
                    this.children.push(new TreeNode(newBoard, nextPlayer));
                }
            }
        }
    }
}

// Funksjon for å lage en ny spillrot
export function createGameTree() {
    const startBoard = [
        [" ", " ", " "],
        [" ", " ", " "],
        [" ", " ", " "]
    ];
    return new TreeNode(startBoard, "X");
}
