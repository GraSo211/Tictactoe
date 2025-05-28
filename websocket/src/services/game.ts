export enum Player {
    P1 = "P1",
    P2 = "P2",
}

enum GameStatus {
    NOT_STARTED = 0,
    IN_PROGRESS = "EN JUEGO",
    FINISHED = 1,
}

// Posibles combinaciones de victoria
const WIN = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 4, 8],
    [2, 4, 6],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
];

export class Game {
    id: string;
    // Estado FALSE: NO INICIADO, EN JUEGO: EN JUEGO, TRUE: FINALIZADO
    gameStatus: GameStatus = GameStatus.NOT_STARTED;
    // Ganador
    winner: Player;
    // Tablero
    board = Array(9).fill(null);
    // Turno
    turn: Player = Player.P1;
    // Empate
    draw: boolean;

    firstTurn: Player;

    // CONSTRUCTOR
    constructor(turn: Player) {
        this.id = crypto.randomUUID();
        this.gameStatus = GameStatus.IN_PROGRESS;
        this.turn = turn;
        this.firstTurn = turn;
    }

    public getFirstTurn() {
        return this.firstTurn;
    }

    public getWinner() {
        return this.winner;
    }

    public getTurn() {
        return this.turn;
    }

    public getBoard() {
        return this.board;
    }

    public getGameStatus() {
        return this.gameStatus;
    }

    public getDraw() {
        return this.draw;
    }

    private setTurn(turn: Player) {
        this.turn = turn;
    }

    private setBoard(index: number, value: string) {
        this.board[index] = value;
    }

    private setGameStatus(status: GameStatus) {
        this.gameStatus = status;
    }

    private setWinner(player: Player) {
        this.winner = player;
    }

    private setDraw(draw: boolean) {
        this.draw = draw;
    }

    public makeMove(cell: number) {
        // Si el jugador toco una celda ya ocupada, no se hace nada.
        if (this.board[cell] != null) {
            return;
        }
        const currentPlayer = this.turn;
        // En el turno del jugador 1, se pone un 1 a su celda marcada y se cambia el turno al jugador 2. Para el jugador 2 se hace lo mismo pero con un 0.
        if (this.turn === Player.P1) {
            this.setBoard(cell, "1");

            this.setTurn(Player.P2);
        } else {
            this.setBoard(cell, "0");
            this.setTurn(Player.P1);
        }

        // Se checkea victoria y empate.
        this.checkWinner(currentPlayer);
        this.checkDraw();
    }

    private checkWinner(turn: Player) {
        for (const combination of WIN) {
            const [a, b, c] = combination;
            if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
                this.setGameStatus(GameStatus.FINISHED);
                this.setWinner(turn);
            }
        }
    }

    private checkDraw() {
        if (this.gameStatus === GameStatus.FINISHED) return;
        for (const cell of this.board) {
            if (cell === null) {
                return;
            }
        }
        this.setDraw(true);
        this.setGameStatus(GameStatus.FINISHED);
    }

    private checkWinnerIA(board: string[]): Player {
        let winnerSimulated;
        for (const combination of WIN) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return (winnerSimulated = board[a] === "1" ? Player.P1 : Player.P2);
            }
        }
        return null;
    }

    private isTerminal(board: string[]): boolean {
        return this.checkWinnerIA(board) !== null || board.every((cell) => cell !== null);
    }

    private getAvailableMoves(board: string[]): number[] {
        return board.map((cell, index) => (cell === null ? index : -1)).filter((index) => index !== -1);
    }

    private evaluate(board: string[]): number {
        const winnerSimulated = this.checkWinnerIA(board);
        if (winnerSimulated === "P2") return +1;
        if (winnerSimulated === "P1") return -1;
        return 0; // empate o no terminado
    }

    private heuristicMoveOrder(moves: number[]): number[] {
        const centro = [4];
        const esquinas = [0, 2, 6, 8];
        const laterales = [1, 3, 5, 7];
        return [...moves.filter((m) => centro.includes(m)), ...moves.filter((m) => esquinas.includes(m)), ...moves.filter((m) => laterales.includes(m))];
    }

    private minimaxAB(board: string[], isMax: boolean, depth: number, alpha: number, beta: number): number {
        if (this.isTerminal(board)) {
            const score = this.evaluate(board);
            return score === 1 ? score - depth : score + depth;
        }

        const moves = this.getAvailableMoves(board);

        if (isMax) {
            let value = -Infinity;
            for (const m of moves) {
                const b2 = [...board];
                b2[m] = "0";
                value = Math.max(value, this.minimaxAB(b2, false, depth + 1, alpha, beta));
                alpha = Math.max(alpha, value);
                if (alpha >= beta) break;
            }
            return value;
        } else {
            let value = Infinity;
            for (const m of moves) {
                const b2 = [...board];
                b2[m] = "1";
                value = Math.min(value, this.minimaxAB(b2, true, depth + 1, alpha, beta));
                beta = Math.min(beta, value);
                if (beta <= alpha) break;
            }
            return value;
        }
    }
    private getBestMoveAB(board: string[]): number {
        for (const m of this.getAvailableMoves(board)) {
            const b2 = [...board];
            b2[m] = "0"; // IA
            if (this.checkWinnerIA(b2) === Player.P2) {
                return m;
            }
        }

        for (const m of this.getAvailableMoves(board)) {
            const b2 = [...board];
            b2[m] = "1"; // humano
            if (this.checkWinnerIA(b2) === Player.P1) {
                return m;
            }
        }

        let bestScore = -Infinity;
        let bestMove = -1;
        const moves = this.heuristicMoveOrder(this.getAvailableMoves(board));
        console.log(moves);
        for (const m of moves) {
            if (m === 4) {
                bestMove = m;
                break;
            }
            const b2 = [...board];
            b2[m] = "0";
            const score = this.minimaxAB(b2, false, 0, -Infinity, +Infinity);
            if (score > bestScore) {
                bestScore = score;
                bestMove = m;
            }
        }
        return bestMove;
    }

    public makeMoveIA() {
        const best = this.getBestMoveAB(this.board) as number;
        if (best >= 0) {
            this.makeMove(best);
        }
    }
}
