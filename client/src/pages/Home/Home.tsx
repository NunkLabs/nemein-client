import React from 'react';

import GameControl from '../../components/Prompt/GameControl';
import Tetris from '../../components/Game/Tetris';

type HomeState = {
  boardGrid: boolean;
  gamePaused: boolean;
  gameRestart: boolean;
  gameOver: boolean;
  firstGameStart: boolean;
  userAuth: boolean;
};

class Home extends React.Component<Record<string, unknown>, HomeState> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      boardGrid: false,
      gamePaused: true,
      gameRestart: false,
      gameOver: false,
      firstGameStart: false,
      userAuth: true,
    };
  }

  render(): JSX.Element {
    const {
      boardGrid, gamePaused, gameRestart, gameOver, firstGameStart, userAuth,
    } = this.state;

    return (
      <div id="outer-container">
        <div id="game-container">
          <GameControl
            isOver={gameOver}
            toggleGame={(): void => this.setState({ gamePaused: !gamePaused })}
            restartGame={(): void => this.setState({
              gamePaused: false,
              gameRestart: !gameRestart,
            })}
            toggleFirstGame={(): void => this.setState({
              gamePaused: !gamePaused,
              firstGameStart: true,
            })}
            toggleBoardGrid={(): void => this.setState({ boardGrid: !boardGrid })}
          />
          <Tetris
            boardWidth={14}
            boardHeight={23}
            boardGrid={boardGrid}
            gamePaused={gamePaused}
            gameRestart={gameRestart}
            gameState={(isOver: boolean): void => this.setState({ gameOver: isOver })}
            firstGameStart={firstGameStart}
            userAuth={userAuth}
          />
        </div>
      </div>
    );
  }
}

export default Home;
