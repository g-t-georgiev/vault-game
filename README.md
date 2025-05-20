# Open the vault game 

This is a simple game project created as part of a job application interview task.

## Project setup 

It utilizes a simple 2D game framework for [PixiJS](https://pixijs.com) using [Vite⚡](https://vitejs.dev/) and [TypeScript](https://www.typescriptlang.org/).

*DISCLAIMER: I do not own or have any part in the creation of the said boilerplate.*

## Project (as-is) requirements and description

It is a simple game where the user has to try to open the vault by interacting with the vault door handle (named "wheel" from now on). If a mistake is made in the combination sequence, the game restarts. 

The game is responsive and can be played on wide variety of devices, from mobile to desktop.

### Initial state (locked)

The game starts with a locked vault door. The general idea is to guess the vault opening combination. Initially, a secret combination code is generated, which consists of 3 direction - step(s) pairs. The direction is either clockwise or counterclockwise and the step(s) is a number of turns (interactions) with the wheel in each direction. The turns are in 60 degree chunks. The user interacts with the wheel by clicking on either side, triggering 60 deg rotation step to the left or to the right, respectively. If the user makes a mistake when trying to guess the combination a "reset" is initialized, which results in a few quick spins (opposite to the direction of last move) and new combination is generated. The combinations that are generated are in the following example format: 2 clockwise, 1 counterclockwise, 3 clockwise. And because this is a simple demo game, each generated combination is being logged in the developer tools console. Try to open the door without taking a look at it.

Additionally there is a timer displaying the time it took the user to open the vault. It stops updating when the vault enters "opened" state.

### Opened vault state

When the right combination of actions (rotations of the wheel) is being executed, the door opens, displaying the treasures hidden behind. A simple glittering animation starts playing, simulating the reflected light effect from the gold cubes. After 5 seconds the vault returns to the "locked" state again, a reset is triggered (a few quick rotations of the wheel) and the game restarts (timer resets and new opening combination is created).

### Github Pages
<a href="https://g-t-georgiev.github.io/vault-game/" target="_blank">This</a> is the link to the GH pages demo.

### Commands

| Command           | Description                                                          |
| ----------------- | -------------------------------------------------------------------- |
| `npm run start`   | Run dev server                                                       |
| `npm run build`   | Build project for production                                         |
| `npm run preview` | Preview production build (must run `build` before running `preview`) |
