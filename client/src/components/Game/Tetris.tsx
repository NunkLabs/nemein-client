/* eslint-disable react/sort-comp */

import React from 'react';
import axios from 'axios';
import { DateTime } from 'luxon';

import TetrisBoard from './TetrisBoard';
import './Tetris.css';
import * as TetrisConsts from './TetrisConsts';
import * as TetrisUtils from './TetrisUtils';

type TetrisProps = {
  boardWidth: number;
  boardHeight: number;
  boardGrid: boolean;
  gamePaused: boolean;
  gameRestart: boolean; /* We now use the newGame prop as a 'switch' to toggle a
  new game instead of polling its' value to determine whether or not a new game
  should start */
  gameState: (arg0: boolean) => void; /* We use a callback as another switch to
  let the parent component know whether the game is over */
  firstGameStart: boolean;
  userAuth: boolean;
};

type TetrisCol = {
  colArr: number[];
  lowestY: number;
};

type TetrisState = {
  init: boolean;
  gameOver: boolean;
  newGameSwitch: boolean;
  onHold: boolean;
  /* cor = Center of rotation */
  corX : number;
  corY: number;
  ghostCorY: number;
  heldTetromino: TetrisConsts.Tetromino;
  activeTetromino: TetrisConsts.Tetromino;
  tetrominoRotate: TetrisConsts.Rotation;
  score: number;
  level: number;
  progressSaved: boolean;
  tetrominosCount: number;
  timerId: number;
  field: TetrisCol[];
  spawnedTetrominos: TetrisConsts.Tetromino[];
};

class Tetris extends React.Component<TetrisProps, TetrisState> {
  constructor(props: TetrisProps) {
    super(props);

    /* Binding handles */
    this.keyboardInputHandle = this.keyboardInputHandle.bind(this);

    const initStates = this.initNewGame();

    this.state = {
      init: initStates.initGame,
      gameOver: initStates.initGameOver,
      newGameSwitch: props.gameRestart,
      onHold: initStates.initOnHold,
      corX: initStates.initCorX,
      corY: initStates.initCorY,
      ghostCorY: initStates.initGhostCorY,
      heldTetromino: initStates.initHeldTetromino,
      activeTetromino: initStates.initActiveTetromino,
      tetrominoRotate: initStates.initTetrominoRotate,
      score: initStates.initScore,
      level: initStates.initLevel,
      progressSaved: initStates.initProgressSaved,
      tetrominosCount: initStates.initTetrominosCount,
      timerId: 0,
      field: initStates.initField,
      spawnedTetrominos: initStates.initSpawnedTetrominos,
    };
  }

  componentDidMount(): void {
    const { keyboardInputHandle } = this;

    document.addEventListener(TetrisConsts.KEYBOARD_EVENT, keyboardInputHandle);

    this.setGameInterval(TetrisConsts.DEFAULT_TIME_INTERVAL_MS);
  }

  componentWillUnmount(): void {
    const { keyboardInputHandle } = this;
    const { timerId } = this.state;

    document.removeEventListener(TetrisConsts.KEYBOARD_EVENT,
      keyboardInputHandle);

    window.clearInterval(timerId);
  }

  /**
   * @brief: setGameInterval: Set the pace/speed of the game
   * @param[in]: interval(ms) - The 'pace' of the game to be set;
   * the lower the value is, the faster the game becomes
   */
  setGameInterval(interval: number): void {
    const {
      timerId,
    } = this.state;

    window.clearInterval(timerId);

    const newTimerId = window.setInterval(
      () => this.handleBoardUpdate(TetrisConsts.Command.Down),
      interval,
    );

    this.setState(() => ({
      timerId: newTimerId,
    }));
  }

  /**
   * @brief: handleNewGameClick: Callback for the event of the new game
   * button being clicked on
   */
  handleNewGameClick(): void {
    const {
      gameRestart, gameState,
    } = this.props;

    /* Call gameState callback to reset parent's gameOver prop */
    gameState(false);

    const initStates = this.initNewGame();

    this.setState(() => ({
      init: initStates.initGame,
      gameOver: initStates.initGameOver,
      newGameSwitch: gameRestart,
      onHold: initStates.initOnHold,
      corX: initStates.initCorX,
      corY: initStates.initCorY,
      ghostCorY: initStates.initGhostCorY,
      heldTetromino: initStates.initHeldTetromino,
      activeTetromino: initStates.initActiveTetromino,
      tetrominoRotate: initStates.initTetrominoRotate,
      score: initStates.initScore,
      level: initStates.initLevel,
      progressSaved: initStates.initProgressSaved,
      tetrominosCount: initStates.initTetrominosCount,
      field: initStates.initField,
      spawnedTetrominos: initStates.initSpawnedTetrominos,
    }));

    /* Reset timer */
    this.setGameInterval(TetrisConsts.DEFAULT_TIME_INTERVAL_MS);
  }

  /**
   * @brief: handleBoardUpdate: Handler for each 'tick' of the game
   * or when a command is issued
   * @param[in]: command - The command to be executed. The command is
   * always 'Down' for each tick of the game
   */
  async handleBoardUpdate(command: TetrisConsts.Command): Promise<void> {
    const {
      gamePaused, gameRestart, gameState, boardWidth, userAuth,
    } = this.props;

    const {
      init, gameOver, newGameSwitch, onHold, corX, corY, ghostCorY,
      heldTetromino, activeTetromino, tetrominoRotate, score, field,
      progressSaved, spawnedTetrominos,
    } = this.state;

    /* Call new game handler and return if the new game/restart button was
    clicked */
    if (newGameSwitch !== gameRestart) {
      this.handleNewGameClick();

      return;
    }

    /* Call gameState callback, save user's score and return if game is over */
    if (gameOver) {
      gameState(true);

      if (userAuth && !progressSaved) {
        await axios.put('/api/user/update/scores', JSON.stringify({
          newScore: {
            score,
            timestamp: DateTime.now().setZone('America/Los_Angeles').toFormat('ff'),
          },
        }), {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        this.setState({
          progressSaved: true,
        });
      }

      return;
    }

    /* Return if game is paused */
    if (gamePaused) {
      return;
    }

    let newInit = init;
    let newOnHold = onHold;
    let newCorX = corX;
    let newCorY = corY;
    let newGhostCorY = ghostCorY;
    let newHeldTetromino = heldTetromino;
    let newTetromino = activeTetromino;
    let newTetrominoRotate = tetrominoRotate;
    let newField = field;
    let newTetrominos = spawnedTetrominos;

    let yAddValid = true;

    /* Handling init - We only render the newly spawned tetromino */
    if (init) {
      this.renderTetromino(newCorX, newGhostCorY, newTetromino,
        newTetrominoRotate,
        TetrisConsts.GHOST_TETROMINO_INDEX);
      this.renderTetromino(newCorX, newCorY, newTetromino, newTetrominoRotate,
        newTetromino);
      this.setState(() => ({
        init: false,
      }));

      return;
    }

    /* Remove current tetromino from field for next logic */
    this.renderTetromino(
      newCorX, newGhostCorY, newTetromino, newTetrominoRotate, 0,
    );
    this.renderTetromino(
      newCorX, newCorY, newTetromino, newTetrominoRotate, 0,
    );

    /* Determine which value to be modified (x - y - rotate ?) */
    switch (command) {
      case TetrisConsts.Command.Left: {
        newCorX -= 1;
        if (!this.isMoveValid(newCorX, newCorY, newTetromino,
          newTetrominoRotate)) {
          newCorX = corX;
        }
        break;
      }
      case TetrisConsts.Command.Right: {
        newCorX += 1;
        if (!this.isMoveValid(newCorX, newCorY, newTetromino,
          newTetrominoRotate)) {
          newCorX = corX;
        }
        break;
      }
      case TetrisConsts.Command.Rotate: {
        newTetrominoRotate = newTetrominoRotate + 1 === TetrisConsts.MAX_ROTATE
          ? TetrisConsts.Rotation.Up : (newTetrominoRotate + 1);
        const corXOffset = this.getTetrominoOnEdgeOffset(newCorX, newTetromino,
          newTetrominoRotate);
        newCorX += corXOffset;

        if (!this.isMoveValid(newCorX, newCorY, newTetromino,
          newTetrominoRotate)) {
          newTetrominoRotate = tetrominoRotate;
          newCorX = corX;
        }
        break;
      }
      case TetrisConsts.Command.Down: {
        newCorY += 1;
        yAddValid = this.isMoveValid(newCorX, newCorY, newTetromino,
          newTetrominoRotate);
        if (!yAddValid) {
          newCorY = corY;
        }
        break;
      }
      case TetrisConsts.Command.HardDrop: {
        yAddValid = false;
        newCorY = newGhostCorY;
        break;
      }
      case TetrisConsts.Command.HoldTetromino: {
        if (!newOnHold) {
          /* If there was a previously held tetromino, we have to switch the
          held one vs the one to be held */
          if (newHeldTetromino !== TetrisConsts.Tetromino.Blank) {
            const prevTetromino = newTetromino;
            newTetromino = newHeldTetromino;
            newHeldTetromino = prevTetromino;
          } else {
            const getTetrominoRet = TetrisUtils.getNewTetromino(newTetrominos);
            newHeldTetromino = newTetromino;
            newTetromino = getTetrominoRet.newTetromino;
            newTetrominos = getTetrominoRet.newTetrominos;
          }
          newCorX = Math.floor(boardWidth / 2);
          newCorY = TetrisConsts.Y_START;
          newTetrominoRotate = TetrisConsts.Rotation.Up;
          newOnHold = true;
        }
        break;
      }
      default: {
        return;
      }
    }

    /* Render new tetromino after the new coords are updated */
    newGhostCorY = this.findGhostTetrominoY(newCorX, newCorY, newTetromino,
      newTetrominoRotate);
    this.renderTetromino(newCorX, newGhostCorY, newTetromino,
      newTetrominoRotate,
      TetrisConsts.GHOST_TETROMINO_INDEX);
    this.renderTetromino(newCorX, newCorY, newTetromino, newTetrominoRotate,
      newTetromino);

    /* Handling blocked movement */
    if (!yAddValid) {
      const newStates = this.handleBlockedMovement(newCorX, newCorY,
        newTetromino, newTetrominoRotate);
      /* Game over */
      if (newStates === undefined) {
        return;
      }

      newInit = newStates.newInit;
      newCorX = newStates.newCorX;
      newCorY = newStates.newCorY;
      newTetromino = newStates.newTetromino;
      newTetrominoRotate = newStates.newTetrominoRotate;
      newGhostCorY = this.findGhostTetrominoY(newCorX, newCorY, newTetromino,
        newTetrominoRotate);
      newField = newStates.newField;
      newTetrominos = newStates.newTetrominos;
      newOnHold = (newOnHold === true) ? false : newOnHold;
    }

    /* Update new states */
    this.setState(() => ({
      init: newInit,
      onHold: newOnHold,
      corX: newCorX,
      corY: newCorY,
      ghostCorY: newGhostCorY,
      heldTetromino: newHeldTetromino,
      activeTetromino: newTetromino,
      tetrominoRotate: newTetrominoRotate,
      field: newField,
      spawnedTetrominos: newTetrominos,
    }));

    /* TBS-36: Getting new tetromino to spawn immediately

    This recursive call should not affect performance as we'd fall in the init
    handling section of this function - which should return anyway.
    Unless I'm wrong..? */
    if (!yAddValid) {
      await this.handleBoardUpdate(TetrisConsts.Command.Down);
    }
  }

  /**
   * @brief: keyboardInputHandle: Callback for the event of keyboard
   * input being received; translate the event keycode to the corresponding
   * command
   * @param[in]: event - The keyboard event received
   */
  async keyboardInputHandle(event: KeyboardEvent): Promise<void> {
    switch (event.key) {
      case TetrisConsts.ARROW_DOWN:
        await this.handleBoardUpdate(TetrisConsts.Command.Down);
        break;
      case TetrisConsts.ARROW_LEFT:
        await this.handleBoardUpdate(TetrisConsts.Command.Left);
        break;
      case TetrisConsts.ARROW_UP:
        await this.handleBoardUpdate(TetrisConsts.Command.Rotate);
        break;
      case TetrisConsts.ARROW_RIGHT:
        await this.handleBoardUpdate(TetrisConsts.Command.Right);
        break;
      case TetrisConsts.SPACE:
        await this.handleBoardUpdate(TetrisConsts.Command.HardDrop);
        break;
      case TetrisConsts.C_KEY:
        await this.handleBoardUpdate(TetrisConsts.Command.HoldTetromino);
        break;
      default:
    }
  }

  /**
   * @brief: isMoveValid: Check if this next move is being valid or not:
   *  Does the current tetromino go out of the board?
   *  Is is blocked by other tetrominos?
   * @param[in]: corX - Current center of rotation's x
   * @param[in]: corY - Current center of rotation's y
   * @param[in]: tetromino: Current type of tetromino
   * @param[in]: tetrominoRotate: Current rotation of tetromino
   * @return: True if the move is valid, false otw
   */
  isMoveValid(corX: number,
    corY: number,
    tetromino: TetrisConsts.Tetromino,
    tetrominoRotate: TetrisConsts.Rotation): boolean {
    const { field } = this.state;
    const { boardWidth, boardHeight } = this.props;

    const tetrominos = TetrisConsts.TETROMINOS_COORDS_ARR;

    /* We scan through each pixel of the tetromino to determine if the move is
    valid */
    for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL;
      pixelIter += 1) {
      /* Check to see if any pixel goes out of the board */
      /* HACK - We check pixels' y coords first to safely render tetrominos
      pixel by pixel initially */
      const coord = tetrominos[tetromino][tetrominoRotate][pixelIter];
      const yToCheck = corY + coord[TetrisConsts.Y_INDEX];
      const xToCheck = corX + coord[TetrisConsts.X_INDEX];
      const xValid = xToCheck >= 0 && xToCheck < boardWidth;

      if (yToCheck >= 0) {
        const yValid = yToCheck < boardHeight;
        if (xValid && yValid) {
          /* Check for any overlap */
          const pixelOverlapped = field[xToCheck].colArr[yToCheck] !== 0;
          if (pixelOverlapped) {
            return false;
          }
        } else {
          return false;
        }
      } else if (!xValid) {
        return false;
      }
    }

    return true;
  }

  /**
   * @brief: handleBlockedMovement: Handle for blocked movements
   * @param[in]: corX - Current center of rotation's x
   * @param[in]: corY - Current center of rotation's y
   * @param[in]: tetromino: Current type of tetromino
   * @param[in]: tetrominoRotate: Current rotation of tetromino
   * @return: Object containing the updated value for states; returning
   * undefined if game is over
   */
  handleBlockedMovement(corX: number,
    corY: number,
    tetromino: TetrisConsts.Tetromino,
    tetrominoRotate: TetrisConsts.Rotation): {
      newInit: boolean;
      newCorX: number;
      newCorY: number;
      newTetromino: TetrisConsts.Tetromino;
      newTetrominoRotate: TetrisConsts.Rotation;
      newField: TetrisCol[];
      newTetrominos: TetrisConsts.Tetromino[];
    } | undefined {
    const { field, spawnedTetrominos, level } = this.state;
    const { boardWidth, boardHeight } = this.props;
    const tetrominos = TetrisConsts.TETROMINOS_COORDS_ARR;
    const retField = field;

    /* Update the lowest pixel for each column */
    for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL;
      pixelIter += 1) {
      const coord = tetrominos[tetromino][tetrominoRotate][pixelIter];
      const xToRender = corX + coord[TetrisConsts.X_INDEX];
      const yToRender = corY + coord[TetrisConsts.Y_INDEX];
      if (yToRender >= 0) {
        const { lowestY } = retField[xToRender];
        if (lowestY > yToRender) {
          retField[xToRender].lowestY = yToRender;
        }
      }
    }

    /* Check for complete lines and clear if there are any */
    for (let row = boardHeight - 1; row >= 0; row -= 1) {
      let isLineComplete = true;

      for (let col = 0; col < boardWidth; col += 1) {
        if (retField[col].colArr[row] === 0) {
          isLineComplete = false;
          break;
        }
      }

      if (isLineComplete) {
        for (let detectedRow = row; detectedRow > 0; detectedRow -= 1) {
          for (let col = 0; col < boardWidth; col += 1) {
            retField[col].colArr[detectedRow] = retField[col]
              .colArr[detectedRow - 1];
          }
        }
        row += 1;

        /* Update the lowest row value for each col */
        for (let col = 0; col < boardWidth; col += 1) {
          if (retField[col].lowestY !== boardHeight - 1) {
            retField[col].lowestY += 1;
          }
        }
      }
    }

    /* Prepare new tetromino for the next board update */
    const getTetrominoRet = TetrisUtils.getNewTetromino(spawnedTetrominos);
    const retTetromino = getTetrominoRet.newTetromino;
    const retTetrominos = getTetrominoRet.newTetrominos;

    const retCorX = Math.floor(boardWidth / 2);
    const retCorY = TetrisConsts.Y_START;
    const retTetrominoRotate = TetrisConsts.Rotation.Up;

    /* Check if game is over. If not, update score + spawn a new tetromino
    + set new time interval and continue */
    let isGameOver = false;
    for (
      let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL; pixelIter += 1
    ) {
      const coord = tetrominos[retTetromino][retTetrominoRotate][pixelIter];
      const yToCheck = retCorY + coord[TetrisConsts.Y_INDEX];
      const xToCheck = retCorX + coord[TetrisConsts.X_INDEX];
      if (yToCheck >= 0) {
        if (retField[xToCheck].colArr[yToCheck] !== 0) {
          isGameOver = true;
          break;
        }
      }
    }

    if (isGameOver) {
      this.setState(() => ({
        gameOver: true,
      }));
      return undefined;
    }

    this.setState((prev) => ({
      score: prev.score + 1 * prev.level,
      tetrominosCount: prev.tetrominosCount + 1,
      level: 1 + Math.floor(prev.tetrominosCount / 10),
    }));

    const newGameInterval = level * TetrisConsts.EARLY_LEVEL_MULTIPLIER
    > TetrisConsts.INTERVAL_CAP
      ? (TetrisConsts.INTERVAL_CAP + level * TetrisConsts.LATE_LEVEL_MULTIPLIER)
      : (level * TetrisConsts.EARLY_LEVEL_MULTIPLIER);
    this.setGameInterval(TetrisConsts.DEFAULT_TIME_INTERVAL_MS
      - newGameInterval);

    return {
      newInit: true,
      newCorX: retCorX,
      newCorY: retCorY,
      newTetromino: retTetromino,
      newTetrominoRotate: retTetrominoRotate,
      newField: retField,
      newTetrominos: retTetrominos,
    };
  }

  /**
   * @brief: initNewGame: Init a new game by calculating new x value
   * and randomizing the new tetromino
   * @return: Object containing the init value for states
   */
  initNewGame(): { initGame: boolean;
    initGrid: boolean;
    initGameOver: boolean;
    initOnHold: boolean;
    initCorX: number;
    initCorY: number;
    initGhostCorY: number;
    initHeldTetromino: TetrisConsts.Tetromino;
    initActiveTetromino: TetrisConsts.Tetromino;
    initTetrominoRotate: TetrisConsts.Rotation;
    initScore: number;
    initLevel: number;
    initProgressSaved: boolean;
    initTetrominosCount: number;
    initField: TetrisCol[];
    initSpawnedTetrominos: TetrisConsts.Tetromino[];
  } {
    const { boardWidth, boardHeight, boardGrid } = this.props;

    const retTetrominos = [];
    /* Add an additional tetromino to pop in init */
    for (let spawn = 0; spawn < TetrisConsts.MAX_SPAWNED_TETROMINOS + 1;
      spawn += 1) {
      const spawnedTetromino = Math.floor(Math.random()
        * (TetrisConsts.MAX_TETROMINO_INDEX - TetrisConsts.MIN_TETROMINO_INDEX
      + 1)) + 1;
      retTetrominos.push(spawnedTetromino);
    }
    const getTetrominoRet = TetrisUtils.getNewTetromino(retTetrominos);
    const retTetromino = getTetrominoRet.newTetromino;
    const retTetrominoRotation = TetrisConsts.Rotation.Up;
    const retGhostCorY = this.prepareGhostTetrominoY(retTetromino,
      retTetrominoRotation);

    const retField: TetrisCol[] = [];
    for (let x = 0; x < boardWidth; x += 1) {
      const col: number[] = [];
      for (let y = 0; y < boardHeight; y += 1) {
        col.push(0);
      }
      const initCol: TetrisCol = {
        colArr: col,
        lowestY: boardHeight - 1,
      };
      retField.push(initCol);
    }

    return {
      initGame: true,
      initGrid: boardGrid,
      initGameOver: false,
      initOnHold: false,
      initCorX: Math.floor(boardWidth / 2),
      initCorY: TetrisConsts.Y_START,
      initGhostCorY: retGhostCorY,
      initHeldTetromino: TetrisConsts.Tetromino.Blank,
      initActiveTetromino: retTetromino,
      initTetrominoRotate: retTetrominoRotation,
      initScore: 0,
      initLevel: 1,
      initProgressSaved: false,
      initTetrominosCount: 0,
      initField: retField,
      initSpawnedTetrominos: retTetrominos,
    };
  }

  /**
   * @brief: findGhostTetrominoY: Find the optimal Y for the ghost tetromino
   * @param[in]: corX - Current center of rotation's x
   * @param[in]: corY - Current center of rotation's y
   * @param[in]: tetromino: Current type of tetromino
   * @param[in]: tetrominoRotate: Current rotation of tetromino
   * @return: Optimal Y for the ghost tetromino
   */
  findGhostTetrominoY(corX: number,
    corY: number,
    tetromino: TetrisConsts.Tetromino,
    tetrominoRotate: TetrisConsts.Rotation): number {
    const { boardWidth, boardHeight } = this.props;
    const { field } = this.state;
    const tetrominos = TetrisConsts.TETROMINOS_COORDS_ARR;

    /* First we find the lowest Y among the number of cols this tetromino
    spans */
    let yHigherThanCmp = false;
    const yToCmpArr: number[] = [];
    for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL;
      pixelIter += 1) {
      const coord = tetrominos[tetromino][tetrominoRotate][pixelIter];
      const xToCheck = corX + coord[TetrisConsts.X_INDEX];
      const yToCheck = corY + coord[TetrisConsts.Y_INDEX];
      if (yToCheck >= 0) {
        const xValid = xToCheck >= 0 && xToCheck < boardWidth;
        const yValid = yToCheck < boardHeight;
        if (xValid && yValid) {
          const yToCmp = field[xToCheck].lowestY;
          /* If the current tetromino is already higher than the lowest Y among
          the X range, we have to handle it differently */
          if (yToCheck > yToCmp) {
            yHigherThanCmp = true;
            break;
          }
          if (!yToCmpArr.includes(yToCmp)) {
            yToCmpArr.push(yToCmp);
          }
        }
      }
    }

    let retGhostCorY = 0;
    /* We have to manually look for the best fit of the tetromino since the
    lowest Y doesn't help here */
    if (yHigherThanCmp) {
      let iterY = 0;
      while (this.isMoveValid(corX, corY + iterY, tetromino, tetrominoRotate)) {
        iterY += 1;
      }
      retGhostCorY = corY + iterY - 1;
      return retGhostCorY;
    }

    const lowestY = Math.min.apply(null, yToCmpArr);
    /* We find the correct starting point for the pivot */
    const pixelsToPivot = tetrominos[tetromino][tetrominoRotate][
      TetrisConsts.UPPER_Y_INDEX][TetrisConsts.Y_INDEX];
    retGhostCorY = lowestY - 1 - pixelsToPivot;

    /* Since we might change the pivot for the tetrominos in the future,
      it is best to try to find the best fit for the tetromino starting from
      the lowest Y we just found. We first try to go upwards (Y increases) */
    let upperBoundAttempts = 0;
    while (this.isMoveValid(corX, retGhostCorY + 1, tetromino,
      tetrominoRotate)) {
      retGhostCorY += 1;
      upperBoundAttempts += 1;
    }

    /* If the number of attempts to move Y upwards is not 0, it means that the
      actual point to render the ghost tetromino is in the upper region */
    if (upperBoundAttempts !== 0) {
      return retGhostCorY;
    }

    /* Otherwise, it is in the lower region */
    while (!this.isMoveValid(corX, retGhostCorY, tetromino,
      tetrominoRotate)) {
      retGhostCorY -= 1;
    }

    return retGhostCorY;
  }

  /**
   * @brief: prepareGhostTetrominoY: Get the center of rotation's ghost Y value
   * of a newly spawned tetromino
   * @note: This is basically a quick hack - Instead of having to
   * call findGhostTetrominoY, we can simply just
   * calculate the ghost tetromino's Y coordinate as it is only
   * [the higest pixel - number of pixels to the pivot
   * (0, 0) of the init tetromino]
   * @param[in]: tetromino: Current type of tetromino
   * @param[in]: tetrominoRotate: Current rotation of tetromino
   * @return: Center of rotation's ghost Y value of a newly spawned tetromino
   */
  prepareGhostTetrominoY(tetromino: TetrisConsts.Tetromino,
    tetrominoRotate: TetrisConsts.Rotation): number {
    const { boardHeight } = this.props;
    const tetrominos = TetrisConsts.TETROMINOS_COORDS_ARR;

    const pixelsToPivot = tetrominos[tetromino][tetrominoRotate][
      TetrisConsts.UPPER_Y_INDEX][TetrisConsts.Y_INDEX];

    return boardHeight - 1 - pixelsToPivot;
  }

  /**
   * @brief: getTetrominoOnEdgeOffset: Get X offset if the tetromino is on the
   * edges (2 sides) of the board
   * @param[in]: corX - Current center of rotation's x
   * @param[in]: tetromino - Current type of tetromino
   * @param[in]: tetrominoRotate: Current rotation of tetromino
   * @return: Tetromino offset:
   *          - Postive value if tetromino's on the left edge of board
   *          - Negative value if tetromino's on the right edge of board
   *          - 0 if tetromino is not on edge
   */
  getTetrominoOnEdgeOffset(corX: number,
    tetromino: TetrisConsts.Tetromino,
    tetrominoRotate: TetrisConsts.Rotation): number {
    const { boardWidth } = this.props;
    const tetrominos = TetrisConsts.TETROMINOS_COORDS_ARR;

    let retOffset = 0;

    for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL;
      pixelIter += 1) {
      const coord = tetrominos[tetromino][tetrominoRotate][pixelIter];
      const xToCheck = corX + coord[TetrisConsts.X_INDEX];
      if (xToCheck >= boardWidth) {
        const offset = xToCheck + 1 - boardWidth;
        retOffset = retOffset < offset ? -offset : retOffset;
      } else if (xToCheck < 0) {
        const offset = 0 - xToCheck;
        retOffset = offset > retOffset ? offset : retOffset;
      }
    }

    return retOffset;
  }

  /**
   * @brief: renderTetromino: Render the desired tetromino
   * @note: Field state will be updated after the function returns
   * @param[in]: corX - Current center of rotation's x
   * @param[in]: corY - Current center of rotation's y
   * @param[in]: tetromino - Current type of tetromino
   * @param[in]: tetrominoRotate - Current rotation of tetromino
   * @param[in]: renderValue - Render value (color of tetromino)
   */
  renderTetromino(corX: number,
    corY: number,
    tetromino: TetrisConsts.Tetromino,
    tetrominoRotate: TetrisConsts.Rotation,
    renderValue: number): void {
    const { field } = this.state;
    const tetrominos = TetrisConsts.TETROMINOS_COORDS_ARR;
    const newField = field;

    for (let pixelIter = 0; pixelIter < TetrisConsts.MAX_PIXEL;
      pixelIter += 1) {
      const coord = tetrominos[tetromino][tetrominoRotate][pixelIter];
      const xToRender = corX + coord[TetrisConsts.X_INDEX];
      const yToRender = corY + coord[TetrisConsts.Y_INDEX];
      if (yToRender >= 0) {
        newField[xToRender].colArr[yToRender] = renderValue;
      }
    }

    this.setState(() => ({
      field: newField,
    }));
  }

  render(): JSX.Element {
    const {
      boardHeight, boardWidth, boardGrid, firstGameStart,
    } = this.props;
    const {
      score, level, heldTetromino, field, spawnedTetrominos,
    } = this.state;

    const renderField: number[][] = [];

    for (let y = 0; y < boardHeight; y += 1) {
      const row = [];
      for (let x = 0; x < boardWidth; x += 1) {
        row.push(field[x].colArr[y]);
      }
      renderField.push(row);
    }

    return (
      <div className="game-wrap">
        <TetrisBoard
          field={renderField}
          score={score}
          level={level}
          spawnedTetrominos={spawnedTetrominos}
          heldTetromino={heldTetromino}
          firstGameStart={firstGameStart}
          displayGrid={boardGrid}
        />
      </div>
    );
  }
}

export default Tetris;
