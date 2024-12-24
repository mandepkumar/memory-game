import { useEffect, useMemo } from "react";
import { useState } from "react";
import "./styles.css";

const generateGrid = (row) => {
  const numbers = parseInt((row * row) / 2);
  const arr = new Array(numbers * 2).fill(null).map((item, idx) => ({
    value: parseInt((idx + 2) / 2),
    isSelected: false,
  }));

  for (let i = 0; i < arr.length; i++) {
    const randomIdx = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[randomIdx]] = [arr[randomIdx], arr[i]];
  }

  return Array.from({ length: Math.ceil(arr.length / row) }, (_, i) =>
    arr.slice(i * row, (i + 1) * row)
  );
};

const Grid = ({ row, setRow }) => {
  const [grid, setGrid] = useState(generateGrid(row));
  const [firstClick, setFirstClick] = useState(null);
  const [secondClick, setSecondClick] = useState(null);
  const [locked, setLocked] = useState(new Set());

  const isWon = locked.size == parseInt((row * row) / 2);

  const makeSelected = (x, y, value) => {
    setGrid((prev) =>
      prev.map((r, i) => {
        if (i != x) return r;
        const newRow = [...r];
        newRow[y] = {
          ...newRow[y],
          isSelected: value,
        };
        return newRow;
      })
    );
  };
  const playAgain = () => {
    setGrid(generateGrid(row));
  };

  useEffect(() => {
    if (secondClick && firstClick) {
      if (firstClick.value === secondClick.value) {
        setFirstClick(null);
        setSecondClick(null);
        setLocked((prev) => prev.add(firstClick.value));
        return;
      }
      setTimeout(() => {
        setFirstClick(null);
        setSecondClick(null);
        makeSelected(firstClick.pos.x, firstClick.pos.y, false);
        makeSelected(secondClick.pos.x, secondClick.pos.y, false);
      }, 800);
    }
  }, [secondClick]);
  return (
    <div>
      <input
        placeholder="Number of row"
        type="number"
        value={row}
        onChange={(e) => setRow(e.target.value)}
      />
      <div className="grid-container">
        <div className="grid">
          {grid.map((r, i) => (
            <div key={"row-" + i} className="row">
              {r.map((cell, j) => (
                <div
                  key={"cell-" + i + j}
                  className="cell"
                  style={{
                    backgroundColor: locked.has(cell.value)
                      ? "darkgreen"
                      : cell.isSelected
                      ? "skyblue"
                      : "lightgray",
                    color: locked.has(cell.value) ? "wheat" : "black",
                  }}
                  onClick={() => {
                    if (!firstClick?.clicked) {
                      setFirstClick({
                        clicked: true,
                        pos: { x: i, y: j },
                        value: cell.value,
                      });
                      makeSelected(i, j, true);
                      return;
                    }
                    if (!secondClick?.clicked) {
                      setSecondClick({
                        clicked: true,
                        pos: { x: i, y: j },
                        value: cell.value,
                      });
                      makeSelected(i, j, true);
                      return;
                    }
                  }}
                >
                  {cell.isSelected ? cell.value : ""}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="won">
        {isWon && "You Won the Game!!"}
        <br />
        {isWon && <button onClick={playAgain}>Play Again </button>}
      </div>
    </div>
  );
};
export default function App() {
  const [row, setRow] = useState(3);
  return (
    <div className="App">
      <h3> Memory Game</h3>
      <Grid row={row} setRow={setRow} />
    </div>
  );
}
