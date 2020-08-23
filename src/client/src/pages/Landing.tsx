import React from 'react';
import { scaleDown as Menu, State } from 'react-burger-menu';

import LoginForm from '../components/Form/LoginForm';
import GameControl from '../components/Prompt/GameControl';
import Tetris from '../components/Game/Tetris';
import './Landing.css';

type LandingState = {
  formIsOpened: boolean;
  gameIsPaused: boolean;
};

class Landing extends React.Component<{}, LandingState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      formIsOpened: false,
      gameIsPaused: true,
    };
  }

  handleGameState(): void {
    this.setState((state: LandingState) => ({ gameIsPaused: !state.gameIsPaused }));
  }

  handleFormState(state: State): void {
    this.setState({ formIsOpened: state.isOpen });
  }

  render(): JSX.Element {
    const { formIsOpened, gameIsPaused } = this.state;

    return (
      <div id="outer-container">
        <Menu
          customBurgerIcon={false}
          isOpen={formIsOpened}
          onStateChange={(state: State): void => this.handleFormState(state)}
          outerContainerId="outer-container"
          pageWrapId="game-container"
          width="600px"
        >
          <LoginForm />
        </Menu>
        <div id="game-container">
          <GameControl
            openForm={(): void => this.setState(() => ({ formIsOpened: true }))}
            toggleGame={(): void => this.setState(() => ({ gameIsPaused: !gameIsPaused }))}
          />
          <Tetris boardWidth={14} boardHeight={20} isPaused={gameIsPaused} newGame={false} />
        </div>
      </div>
    );
  }
}

export default Landing;
