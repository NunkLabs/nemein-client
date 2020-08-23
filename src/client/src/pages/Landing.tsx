import React from 'react';
import { scaleDown as Menu } from 'react-burger-menu';
import Tetris from '../components/Game/Tetris';
import './Landing.css';

type LandingState = {
  isOpen: boolean;
};

class Landing extends React.Component<{}, LandingState> {
  constructor(props: {}) {
    super(props);

    this.state = {
      isOpen: false,
    };

    this.toggleLoginForm = this.toggleLoginForm.bind(this);
  }

  handleStateChange(state: LandingState): void {
    this.setState({ isOpen: state.isOpen });
  }

  toggleLoginForm(): void {
    this.setState((state) => ({ isOpen: !state.isOpen }));
  }

  render(): JSX.Element {
    const { isOpen } = this.state;

    return (
      <div id="outer-container">
        <Menu
          customBurgerIcon={false}
          isOpen={isOpen}
          onStateChange={(state): void => this.handleStateChange(state)}
          outerContainerId="outer-container"
          pageWrapId="game-container"
          width="600px"
        >
          <div className="form">
            <form>
              <div className="mb-2">
                <label className="form-label" htmlFor="username-input">
                  Username
                  <input type="email" className="form-control-custom" id="username-input" />
                </label>
              </div>
              <div className="mb-2">
                <label className="form-label" htmlFor="password-input">
                  Password
                  <input type="password" className="form-control-custom" id="password-input" />
                </label>
              </div>
              <div className="mb-2">
                <button type="submit" className="btn-custom btn-custom-dark btn-block">Log In</button>
                <button type="submit" className="btn-custom btn-custom-dark btn-block">Register Now</button>
              </div>
            </form>
          </div>
        </Menu>
        <div id="game-container">
          <div className="popup-console-wrap">
            <div className="popup-console">
              <button type="submit" className="btn-custom btn-custom-light btn-block">Play</button>
              <button type="submit" className="btn-custom btn-custom-light btn-block" onClick={(): void => this.toggleLoginForm()}>Log In</button>
            </div>
          </div>
          <Tetris boardWidth={14} boardHeight={20} />
        </div>
      </div>
    );
  }
}

export default Landing;
