export enum Player {
    P1 = "P1",
    P2 = "P2"
}

enum GameStatus {
    NOT_STARTED = 0,
    IN_PROGRESS = "EN JUEGO",
    FINISHED = 1
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
    id:string
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

    firstTurn: Player

    // CONSTRUCTOR
    constructor(turn:Player) {
        this.id = crypto.randomUUID();
        this.gameStatus = GameStatus.IN_PROGRESS;
        this.turn = turn
        this.firstTurn = turn
    }

    public getFirstTurn(){
        return this.firstTurn;
    }

    public getWinner(){
        return this.winner;
    }

    public getTurn(){
        return this.turn;
    }

    public getBoard(){
        return this.board;
    }

    public getGameStatus(){
        return this.gameStatus;

    }

    public getDraw(){
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

    private setDraw(draw:boolean){
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
}
