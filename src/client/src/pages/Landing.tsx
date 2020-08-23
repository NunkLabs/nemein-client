import React from 'react';
import { scaleDown as Menu, State } from 'react-burger-menu';

import LoginForm from '../components/Form/LoginForm';
import GameControl from '../components/Prompt/GameControl';
import Tetris from '../components/Game/Tetris';
import './Landing.css';

type LandingState = {
  formIsOpened: boolean;
  gameIsPaused: boolean;
  gameWillRestart: boolean;
};

class Landing extends React.Component<{}, LandingState> {
  constructor(props: {}) {
    super(props);

    this.handleFormState = this.handleFormState.bind(this);

    this.state = {
      formIsOpened: false,
      gameIsPaused: true,
      gameWillRestart: false,
    };
  }

  /**
   * @brief: handleFormState: Callback to sync the state being set
   * using our own onClick event with the state being set using the
   * default means in the react-burger-menu module
   * @param[in]: state - The state of the menu
   */
  handleFormState(state: State): void {
    this.setState({ formIsOpened: state.isOpen });
  }

  render(): JSX.Element {
    const { formIsOpened, gameIsPaused, gameWillRestart } = this.state;

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
            openForm={(): void => this.setState({ formIsOpened: true })}
            toggleGame={(): void => this.setState({ gameIsPaused: !gameIsPaused })}
            restartGame={(): void => this.setState({
              gameIsPaused: false,
              gameWillRestart: !gameWillRestart
            })}
          />
          <Tetris
            boardWidth={14}
            boardHeight={20}
            isPaused={gameIsPaused}
            newGame={gameWillRestart}
          />
        </div>
      </div>
    );
  }
}

export default Landing;
