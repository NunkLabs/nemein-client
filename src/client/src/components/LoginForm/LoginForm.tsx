import React from 'react';
import { scaleDown as Menu } from 'react-burger-menu';
import './LoginForm.css';

const LoginMenu = (): JSX.Element => (
  <Menu isOpen outerContainerId="outer-container" pageWrapId="game-container" width="600px">
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
);

export default LoginMenu;
