import React from 'react';
import GameControl from '../../components/Prompt/GameControl';
import Tetris from '../../components/Game/Tetris';

type HomeState = {
  gamePaused: boolean;
  gameRestart: boolean;
  gameOver: boolean;
};

class Home extends React.Component<{}, HomeState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      gamePaused: true,
      gameRestart: false,
      gameOver: false,
    };
  }

  render(): JSX.Element {
    const {
      gamePaused, gameRestart, gameOver,
    } = this.state;

    return (
      <div id="game-container">
        <GameControl
          isOver={gameOver}
          toggleGame={(): void => this.setState({ gamePaused: !gamePaused })}
          restartGame={(): void => this.setState({
            gamePaused: false,
            gameRestart: !gameRestart,
          })}
        />
        <Tetris
          boardWidth={14}
          boardHeight={20}
          gamePaused={gamePaused}
          gameRestart={gameRestart}
          gameState={(isOver: boolean): void => this.setState({ gameOver: isOver })}
        />
      </div>
    );
  }
}

export default Home;
