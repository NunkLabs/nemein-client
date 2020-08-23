import React from 'react';
import './GameControl.css';

type GameControlProps = {
  openForm: Function;
  toggleGame: Function;
};

type GameControlState = {
  initialState: boolean;
  promptVisible: boolean;
};

class GameControl extends React.Component<GameControlProps, GameControlState> {
  constructor(props: GameControlProps) {
    super(props);

    this.escHandler = this.escHandler.bind(this);

    this.state = {
      initialState: true,
      promptVisible: true,
    };
  }

  componentDidMount(): void {
    const { escHandler } = this;

    document.addEventListener('keydown', escHandler, false);
  }

  componentWillUnmount(): void {
    const { escHandler } = this;

    document.removeEventListener('keydown', escHandler, false);
  }

  escHandler(event: KeyboardEvent): void {
    const { toggleGame } = this.props;
    const { promptVisible } = this.state;

    if (!promptVisible && event.key === 'Escape') {
      toggleGame();
      this.setState({ promptVisible: true });
    }
  }

  render(): JSX.Element {
    const { openForm, toggleGame } = this.props;
    const { initialState, promptVisible } = this.state;

    return (
      <div className="game-control-wrap">
        <div className={`game-control game-control-${promptVisible ? 'visible' : 'hidden'}`}>
          { initialState ? (
            <button
              type="submit"
              className="btn-custom btn-custom-light btn-block"
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
          ) : (
            <button
              type="submit"
              className="btn-custom btn-custom-light btn-block"
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
            className="btn-custom btn-custom-light btn-block"
            onClick={(): void => openForm()}
          >
            Log In
          </button>
        </div>
      </div>
    );
  }
}

export default GameControl;
