const fs = require("fs");
const path = require("path");

// to read the input file
const readInput = async (filename) => {
  const file = await fs.readFileSync(path.join(__dirname, filename), {
    encoding: "utf-8",
  });

  const inputs = file.toString().split("\n");

  return inputs;
};

// in order to split each robot into an array as [[x, y, orientation], [moves]]
const getRobots = (arr, numOfOps, newArr = new Array()) => {
  if (arr.length % 2 !== 0) throw new Error("must be even");
  if (numOfOps === 0) return newArr;
  newArr.push(arr.splice(0, 2));
  return getRobots(arr, numOfOps - 1, newArr);
};

const orientationObj = {
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

// calculates the robot's final position
const getFinalPosition = (robot, xGrid, yGrid, lostPositions) => {
  let [xPos, yPos, orientation] = robot[0].split(" ");
  xPos = Number(xPos);
  yPos = Number(yPos);
  const moves = robot[1].split("");
  let lostInMove = -1;
  let isLost = false;

  if (moves.length > 100) throw new Error("Max instructions number is 100");

  moves.map((move, moveNum) => {
    if (isLost) return;
    if (move === "F") {
      if (
        !isLost &&
        ((orientation === "E" && xPos + 1 > xGrid) ||
          (orientation === "W" && xPos - 1 < 0) ||
          (orientation === "N" && yPos + 1 > yGrid) ||
          (orientation === "S" && yPos - 1 < 0)) &&
        !lostPositions.includes(JSON.stringify({ xPos, yPos }))
      ) {
        lostInMove = moveNum;
        isLost = true;
        lostPositions.push(JSON.stringify({ xPos, yPos }));
        return;
      } else if (
        !isLost &&
        ((orientation === "E" && xPos + 1 > xGrid) ||
          (orientation === "W" && xPos - 1 < 0) ||
          (orientation === "N" && yPos + 1 > yGrid) ||
          (orientation === "S" && yPos - 1 < 0)) &&
        lostPositions.includes(JSON.stringify({ xPos, yPos }))
      ) {
        return;
      } else {
        if (orientation === "N") {
          yPos = yPos + 1;
        }
        if (orientation === "E") {
          xPos = xPos + 1;
        }
        if (orientation === "S") {
          yPos = yPos - 1;
        }
        if (orientation === "W") {
          xPos = xPos - 1;
        }
      }
    } else {
      orientation = orientationObj[orientation][move];
    }
  });
  return [xPos, yPos, orientation, isLost ? "LOST" : undefined];
};

(async () => {
  try {
    if (process.argv.length < 3) {
      throw new Error("No input file found as arg");
    }

    const filename = process.argv[2];

    const [gridSize, ...robotsInstructions] = await readInput(filename);

    const [xGrid, yGrid] = gridSize.split(" ");
    const lostPositions = [];

    if (xGrid > 50 || yGrid > 50) throw new Error("Max grid size is 50");

    const robotsMapped = getRobots(
      robotsInstructions,
      robotsInstructions.length / 2
    );

    const finalPositions = robotsMapped.map((robot) =>
      getFinalPosition(robot, xGrid, yGrid, lostPositions)
    );

    finalPositions.forEach((pos) => {
      if (pos[3]) console.log(`${pos[0]} ${pos[1]} ${pos[2]} ${pos[3]}`);
      else console.log(`${pos[0]} ${pos[1]} ${pos[2]}`);
    });
  } catch (err) {
    console.log("Exiting...");
    console.log(err.message);
  }
})();
