import React from 'react';

import { Tetris } from 'components';

type LandingState = {
  boardGrid: boolean;
  formOpened: boolean;
  gamePaused: boolean;
  gameRestart: boolean;
  gameOver: boolean;
  firstGameStart: boolean;
  userAuth: boolean;
};

class Landing extends React.Component<Record<string, unknown>, LandingState> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      boardGrid: false,
      formOpened: false,
      gamePaused: false,
      gameRestart: false,
      gameOver: false,
      firstGameStart: true,
      userAuth: false,
    };
  }

  render() {
    const {
      boardGrid,
      formOpened,
      gamePaused,
      gameRestart,
      gameOver,
      firstGameStart,
      userAuth,
    } = this.state;

    return (
      <Tetris
        boardWidth={14}
        boardHeight={23}
        boardGrid={boardGrid}
        gamePaused={gamePaused}
        gameRestart={gameRestart}
        gameState={(isOver: boolean): void => {
          this.setState({
            gameOver: isOver,
          });
        }}
        firstGameStart={firstGameStart}
        userAuth={userAuth}
      />
    );
  }
}

export default Landing;
