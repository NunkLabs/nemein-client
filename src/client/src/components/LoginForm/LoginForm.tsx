import React from 'react';
import { scaleDown as Menu } from 'react-burger-menu';
import './LoginForm.css';

type LoginMenu = {

};

const LoginMenu = (): JSX.Element => (
  <Menu isOpen outerContainerId="outer-container" pageWrapId="game-wrap" width="600px">
    <div className="form">
      <form>
        <div className="form-group">
          <input type="email" className="form-control-custom" />
        </div>
        <div className="form-group">
          <input type="password" className="form-control-custom" />
        </div>
        <button type="submit" className="btn-custom btn-custom-dark btn-block">Log In</button>
        <button type="submit" className="btn-custom btn-custom-dark btn-block">Register Now</button>
      </form>
    </div>
  </Menu>
);

export default LoginMenu;
