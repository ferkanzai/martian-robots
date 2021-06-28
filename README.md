# Martian Robots

## Intro

This document explains the way to use this repository in order to calculate the final position of each robot in Mar's surface after finishing all its moves.

## 1. Configure

The only needed configuration is to create a file in the root of the repo's folder with the instructions to the robots, following the sample input pattern:

```
5 3
1 1 E
RFRFRFRF
3 2 N
FRRFLLFFRRFLL
0 3 W
LLFFFLFLFL
```

Then, you need to run the following command to run the calculations: `node index.js <filename>`, being filename the name of the input file you just created.

## 2. Explanation

I tried to keep the code as simple as possible, that is why I chose a functional approach, calculating each robot movements on the fly and trying to keep everything as self explanatory as I could.
