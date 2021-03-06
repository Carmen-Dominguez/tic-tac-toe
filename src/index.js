import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.win} onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    handleClick(i) {
        const squares = this.state.squares.slice();
        
        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }

        squares[i] = this.state.XIsNext ? 'X': 'O';

        this.setState({
            squares: squares,
            XIsNext: !this.state.XIsNext,
        });
    }

    renderSquare(i) {
        return <Square 
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            win={this.props.win[i]}
        />;
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [{
                squares: Array(9).fill(null),
                win: Array(9).fill('square'),
            }],
            XIsNext: true,
            stepNumber: 0,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winblocks = current.win.slice();

        if (calculateWinner(squares)?.winner || squares[i]) {
            return;
        }

        squares[i] = this.state.XIsNext ? 'X': 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
                win: winblocks,
            }]),
            XIsNext: !this.state.XIsNext,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            XIsNext: (step % 2) === 0,
            stepNumber: step,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const calculatedWinner = calculateWinner(current.squares);
        const winner = calculatedWinner?.winner;
        const lines = calculatedWinner?.lines;

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        })

        let status;

        if (winner) {
            status = 'Winner: ' + winner;

            current.win[lines[0]] = "square win";
            current.win[lines[1]] = "square win";
            current.win[lines[2]] = "square win";
        } else {
            status = 'Next player: ' + (this.state.XIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} win={current.win}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [3,4,5],
        [0,1,2],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a,b,c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {winner: squares[a], lines: lines[i]};
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
