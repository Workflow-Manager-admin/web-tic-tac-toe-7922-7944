import React, { useState, useEffect } from 'react';
import './App.css';

/*
Tic Tac Toe Game
Features:
- Interactive 3x3 grid for two players (X, O)
- Player turn indicator
- Win and tie detection, notification
- Board reset/restart button
- Score tracking (current session)
- Modern, minimalistic, centered layout
- Light theme, custom color palette per requirements
*/

/** Color palette (as used in style):
  --primary:   #1976d2;
  --secondary: #424242;
  --accent:    #ff7043;
*/

/* Helper functions */
// PUBLIC_INTERFACE
function calculateWinner(squares) {
  /** Returns 'X', 'O', or null if no winner */
  const lines = [
    [0,1,2],[3,4,5],[6,7,8], // rows
    [0,3,6],[1,4,7],[2,5,8], // cols
    [0,4,8],[2,4,6] // diags
  ];
  for (let line of lines) {
    const [a,b,c] = line;
    if (squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

/** Returns true if all squares are filled and no winner */
function checkTie(squares) {
  return squares.every(Boolean) && !calculateWinner(squares);
}

/** Single Square */
// PUBLIC_INTERFACE
function Square({ value, onClick, isWinner }) {
  return (
    <button
      className={`ttt-square${isWinner ? " winner" : ""}`}
      onClick={onClick}
      aria-label={value ? `Cell: ${value}` : 'Empty cell'}
      tabIndex={0}
    >
      {value}
    </button>
  );
}

/** Board Grid */
// PUBLIC_INTERFACE
function Board({ squares, onSquareClick, winningLine }) {
  return (
    <div className="ttt-board">
      {Array(3).fill(0).map((_, row) => (
        <div className="ttt-row" key={row}>
          {Array(3).fill(0).map((_, col) => {
            const idx = row*3+col;
            const isWinner = winningLine && winningLine.includes(idx);
            return (
              <Square
                key={idx}
                value={squares[idx]}
                onClick={() => onSquareClick(idx)}
                isWinner={isWinner}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // State: board (9 cells), XisNext, score, status
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXisNext] = useState(true);
  const [score, setScore] = useState({X: 0, O: 0, ties: 0});
  const [winner, setWinner] = useState(null); // 'X'|'O'|null
  const [winningLine, setWinningLine] = useState(null);

  // Find winning line for highlight
  function findWinningLine(squares) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];
    for (let line of lines) {
      const [a,b,c] = line;
      if (squares[a] &&
          squares[a] === squares[b] &&
          squares[a] === squares[c]) {
        return line;
      }
    }
    return null;
  }

  // Effect: Check for win/tie on squares update
  useEffect(() => {
    const win = calculateWinner(squares);
    if (win) {
      setWinner(win);
      setWinningLine(findWinningLine(squares));
      setScore(sc => ({...sc, [win]: sc[win]+1}));
    } else if (checkTie(squares)) {
      setWinner("Tie");
      setWinningLine(null);
      setScore(sc => ({...sc, ties: sc.ties+1}));
    }
    // eslint-disable-next-line
  }, [squares]);

  // Handle user clicking a square
  // PUBLIC_INTERFACE
  function handleSquareClick(idx) {
    if (squares[idx] || winner) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? "X" : "O";
    setSquares(nextSquares);
    setXisNext(x => !x);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setSquares(Array(9).fill(null));
    setXisNext((score.X+score.O+score.ties)%2 === 0); // Alternate first
    setWinner(null);
    setWinningLine(null);
  }

  // PUBLIC_INTERFACE
  function handleScoreReset() {
    setScore({X: 0, O: 0, ties: 0});
    handleRestart();
  }

  // Notification/status
  let statusText;
  if (winner === "X" || winner === "O") {
    statusText = (
      <span>
        <span className="ttt-winner-ind">Player&nbsp;{winner} wins!</span>
      </span>
    );
  } else if (winner === "Tie") {
    statusText = <span className="ttt-tie-ind">It's a tie!</span>;
  } else {
    statusText = <span>Turn: <b>Player {xIsNext ? "X" : "O"}</b></span>;
  }

  // UI
  return (
    <div className="ttt-app">
      <div className="ttt-game-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        {/* Player/Score Row */}
        <div className="ttt-info-bar">
          <div className={`ttt-player ${xIsNext && !winner ? "active" : ""}`}>
            <span className="ttt-px">X</span>
            <div className="ttt-score">{score.X}</div>
          </div>
          <div className="ttt-status" aria-live="polite">{statusText}</div>
          <div className={`ttt-player ${!xIsNext && !winner ? "active" : ""}`}>
            <span className="ttt-po">O</span>
            <div className="ttt-score">{score.O}</div>
          </div>
        </div>
        {/* Board */}
        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
        />
        {/* Restart/Reset Controls */}
        <div className="ttt-controls">
          <button className="ttt-btn" onClick={handleRestart} aria-label="Restart Game">Restart</button>
          <button className="ttt-btn ttt-btn-score" onClick={handleScoreReset} aria-label="Reset Score">Reset Score</button>
        </div>
        {/* Ties */}
        <div className="ttt-ties">Ties: <span className="ttt-tie-count">{score.ties}</span></div>
      </div>
      <footer className="ttt-footer">
        <small>
          Modern React Tic Tac Toe &middot; <a href="https://reactjs.org/" className="ttt-footer-link" target="_blank" rel="noopener noreferrer">Learn React</a>
        </small>
      </footer>
    </div>
  );
}

export default App;
