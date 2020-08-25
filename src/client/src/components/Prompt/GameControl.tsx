import React from 'react';
import './GameControl.css';

type GameControlProps = {
  isOver: boolean;
  openForm?: Function;
  toggleGame: Function;
  restartGame: Function;
};

type GameControlState = {
  initialState: boolean;
  needRestart: boolean;
  promptVisible: boolean;
};

class GameControl extends React.Component<GameControlProps, GameControlState> {
  constructor(props: GameControlProps) {
    super(props);

    this.escHandler = this.escHandler.bind(this);
    this.unfocusedHandler = this.unfocusedHandler.bind(this);

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

    if (!props.isOver && state.promptVisible && state.needRestart) {
      return {
        needRestart: false,
        promptVisible: false,
      };
    }

    return null;
  }

  componentDidMount(): void {
    const { escHandler, unfocusedHandler } = this;

    document.addEventListener('keydown', escHandler);
    document.addEventListener('visibilitychange', unfocusedHandler);
  }

  componentWillUnmount(): void {
    const { escHandler, unfocusedHandler } = this;

    document.removeEventListener('keydown', escHandler);
    document.removeEventListener('visibilitychange', unfocusedHandler);
  }

  /**
   * @brief: escHandler: Callback for the event of the Escape
   * key being received; pause the game and pull up the game control prompt
   * @param[in]: event - The keyboard event received
   */
  escHandler(event: KeyboardEvent): void {
    const { toggleGame } = this.props;
    const { promptVisible } = this.state;

    if (!promptVisible && event.key === 'Escape') {
      toggleGame();
      this.setState({ promptVisible: true });
    }
  }

  /**
   * @brief: unfocusedHandler: Callback for the event of visibility
   * status of the document being changed; key being received; pause the
   * game and pull up the game control prompt
   */
  unfocusedHandler(): void {
    const { toggleGame } = this.props;
    const { promptVisible } = this.state;

    if (!promptVisible && document.visibilityState !== 'visible') {
      toggleGame();
      this.setState({ promptVisible: true });
    }
  }

  render(): JSX.Element {
    const {
      isOver, openForm, toggleGame, restartGame,
    } = this.props;
    const { initialState, promptVisible } = this.state;

    return (
      <div className="game-control-wrap">
        <div className={`game-control game-control-${promptVisible ? 'visible' : 'hidden'}`}>
          { initialState ? (
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
              <button
                type="submit"
                className="btn-custom btn-custom-dark btn-block"
                onClick={(): void => {
                  if (openForm) openForm();
                }}
              >
                Log In
              </button>
            </div>
          ) : (
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
                    needRestart: true,
                    promptVisible: false,
                  });
                }}
              >
                Restart
              </button>
              <button
                type="submit"
                className="btn-custom btn-custom-dark btn-block"
                onClick={(): void => {
                  if (openForm) openForm();
                }}
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default GameControl;
