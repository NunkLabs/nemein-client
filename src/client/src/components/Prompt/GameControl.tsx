import React from 'react';
import './GameControl.css';

type GameControlProps = {
  isOver: boolean;
  toggleGame: Function;
  restartGame: Function;
  openForm?: Function;
};

type GameControlState = {
  initialState: boolean;
  needRestart: boolean;
  promptVisible: boolean;
};

class GameControl extends React.Component<GameControlProps, GameControlState> {
  constructor(props: GameControlProps) {
    super(props);

    this.handleEscKey = this.handleEscKey.bind(this);
    this.handleUnfocus = this.handleUnfocus.bind(this);

    this.state = {
      initialState: true,
      needRestart: false,
      promptVisible: true,
    };
  }

  static getDerivedStateFromProps(props: GameControlProps, state: GameControlState): object | null {
    if (props.isOver && !state.promptVisible) {
      return {
        promptVisible: true,
      };
    }

    if (!props.isOver && state.needRestart) {
      return {
        promptVisible: false,
        needRestart: false,
      };
    }

    return null;
  }

  componentDidMount(): void {
    const { handleEscKey, handleUnfocus } = this;

    document.addEventListener('keydown', handleEscKey);
    document.addEventListener('visibilitychange', handleUnfocus);
  }

  componentWillUnmount(): void {
    const { handleEscKey, handleUnfocus } = this;

    document.removeEventListener('keydown', handleEscKey);
    document.removeEventListener('visibilitychange', handleUnfocus);
  }

  /**
   * @brief: handleEscKey: Callback for the event of the Escape key being received; pause the game
   * and pull up the game control prompt
   * @param[in]: event - The keyboard event received
   */
  handleEscKey(event: KeyboardEvent): void {
    const { toggleGame } = this.props;
    const { promptVisible } = this.state;

    if (event.key !== 'Escape') {
      return;
    }

    if (promptVisible) {
      toggleGame();
      this.setState({ promptVisible: false });
    } else {
      toggleGame();
      this.setState({ promptVisible: true });
    }
  }

  /**
   * @brief: handleUnfocus: Callback for the event of visibility status of the document being
   * changed; key being received; pause the game and pull up the game control prompt
   */
  handleUnfocus(): void {
    const { toggleGame } = this.props;
    const { promptVisible } = this.state;

    if (!promptVisible && document.visibilityState !== 'visible') {
      toggleGame();
      this.setState({ promptVisible: true });
    }
  }

  renderInitialPrompt(): JSX.Element {
    const { toggleGame } = this.props;

    const logInButton = this.renderLoginButton();

    return (
      <div>
        <button
          type="submit"
          className="btn-custom btn-custom-dark btn-block"
          onClick={(): void => {
            toggleGame();
            this.setState({
              initialState: false,
              promptVisible: false,
            });
          }}
        >
          Play
        </button>
        { logInButton }
      </div>
    );
  }

  renderPrompt(): JSX.Element {
    const { isOver, toggleGame, restartGame } = this.props;

    const logInButton = this.renderLoginButton();

    return (
      <div>
        { isOver ? (
          <h2>Game Over</h2>
        ) : (
          <button
            type="submit"
            className="btn-custom btn-custom-dark btn-block"
            onClick={(): void => {
              toggleGame();
              this.setState({ promptVisible: false });
            }}
          >
            Resume
          </button>
        )}
        <button
          type="submit"
          className="btn-custom btn-custom-dark btn-block"
          onClick={(): void => {
            restartGame();
            this.setState({
              promptVisible: false,
              needRestart: true,
            });
          }}
        >
          Restart
        </button>
        { logInButton }
      </div>
    );
  }

  renderLoginButton(): JSX.Element {
    const { openForm } = this.props;

    return openForm ? (
      <button
        type="submit"
        className="btn-custom btn-custom-dark btn-block"
        onClick={(): void => openForm()}
      >
        Log In
      </button>
    ) : (
      <button
        type="submit"
        className="btn-custom btn-custom-dark btn-block"
      >
        Log Out
      </button>
    );
  }

  render(): JSX.Element {
    const { initialState, promptVisible } = this.state;

    const prompt = initialState ? this.renderInitialPrompt() : this.renderPrompt();

    return (
      <div className="game-control-wrap">
        <div className={`game-control game-control-${promptVisible ? 'visible' : 'hidden'}`}>
          { prompt }
        </div>
      </div>
    );
  }
}

export default GameControl;
