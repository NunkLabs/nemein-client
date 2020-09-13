import React from 'react';

import GameControl from '../../components/Prompt/GameControl';
import Tetris from '../../components/Game/Tetris';

type HomeState = {
  gamePaused: boolean;
  gameRestart: boolean;
  gameOver: boolean;
  firstGameStart: boolean;
};

class Home extends React.Component<Record<string, unknown>, HomeState> {
  constructor(props: Record<string, unknown>) {
    super(props);

    this.state = {
      gamePaused: true,
      gameRestart: false,
      gameOver: false,
      firstGameStart: false,
    };
  }

  render(): JSX.Element {
    const {
      gamePaused, gameRestart, gameOver, firstGameStart,
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
          />
          <Tetris
            boardWidth={14}
            boardHeight={23}
            gamePaused={gamePaused}
            gameRestart={gameRestart}
            gameState={(isOver: boolean): void => this.setState({ gameOver: isOver })}
            firstGameStart={firstGameStart}
          />
        </div>
      </div>
    );
  }
}

export default Home;
