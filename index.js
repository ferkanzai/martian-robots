const fs = require("fs");
const path = require("path");

const readInput = async () => {
  const file = await fs.readFileSync(path.join(__dirname, "./input.txt"), {
    encoding: "utf-8",
  });

  const inputs = file.toString().split("\n");

  return inputs;
};

class Grid {
  constructor(xSize, ySize) {
    this.xSize = Number(xSize);
    this.ySize = Number(ySize);
    this.lostPositions = [];
  }
}

class Robot {
  constructor(xPos, yPos, orientation, moves) {
    this.xPos = Number(xPos);
    this.yPos = Number(yPos);
    this.orientation = orientation;
    this.moves = moves.split("");
    this.orientationObj = {
      N: {
        R: "E",
        L: "W",
      },
      E: {
        R: "S",
        L: "N",
      },
      S: {
        R: "W",
        L: "E",
      },
      W: {
        R: "N",
        L: "S",
      },
    };
    this.lost = null;
    this.lostInMove = -1;
  }

  nextPos(move, moveIndex, grid) {
    if (move === "F") {
      if (
        grid.lostPositions.includes(
          JSON.stringify({ xPos: this.xPos, yPos: this.yPos })
        )
      ) {
        return;
      }
      this.calculateLostPos(grid, moveIndex);
      if (this.lost && this.lostInMove === moveIndex) return;
      if (this.orientation === "N") {
        this.yPos = this.yPos + 1;
      }
      if (this.orientation === "E") {
        this.xPos = this.xPos + 1;
      }
      if (this.orientation === "S") {
        this.yPos = this.yPos - 1;
      }
      if (this.orientation === "W") {
        this.xPos = this.xPos - 1;
      }
    } else {
      this.orientation = this.orientationObj[this.orientation][move];
    }
  }

  calculateLostPos(grid, moveIndex) {
    if (
      (this.orientation === "E" && this.xPos + 1 > grid.xSize) ||
      (this.orientation === "W" && this.xPos - 1 < 0) ||
      (this.orientation === "N" && this.yPos + 1 > grid.ySize) ||
      (this.orientation === "S" && this.yPos - 1 < 0)
    ) {
      this.lost = {
        xPos: this.xPos,
        yPos: this.yPos,
      };
      this.lostInMove = moveIndex;
    }
  }

  calculateFinalPos = (grid) => {
    this.moves.forEach((move, i) => {
      if (this.lost && this.lostInMove === i) {
        if (!grid.lostPositions.includes(JSON.stringify(this.lost)))
          grid.lostPositions.push(JSON.stringify(this.lost));
        return;
      }
      this.nextPos(move, i, grid);
    });

    return [this.xPos, this.yPos, this.orientation, this.lost];
  };
}

const getRobots = (arr, numOfOps, newArr = new Array()) => {
  if (arr.length % 2 !== 0) throw new Error("must be even");
  if (numOfOps === 0) return newArr;
  newArr.push(arr.splice(0, 2));
  return getRobots(arr, numOfOps - 1, newArr);
};

(async () => {
  const [gridSize, ...robotsInstructions] = await readInput();

  const [xSize, ySize] = gridSize.split(" ");

  if (xSize > 50 || ySize > 50) throw new Error("max grid size is 50");

  const robotsMapped = getRobots(
    robotsInstructions,
    robotsInstructions.length / 2
  );

  const grid = new Grid(xSize, ySize);

  robotsMapped.map((robot) => {
    const [xPos, yPos, orientation] = robot[0].split(" ");
    const moves = robot[1];

    if (moves.length > 100) throw new Error("max instructions number is 100");

    const rb = new Robot(xPos, yPos, orientation, moves);

    const test = rb.calculateFinalPos(grid);
    console.log(test);
  });
  console.log(grid);
})();
