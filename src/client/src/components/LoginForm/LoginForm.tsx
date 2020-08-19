import React from 'react';
import { scaleDown as Menu } from 'react-burger-menu';
import './LoginForm.css';

const LoginMenu = (): JSX.Element => (
  <Menu isOpen outerContainerId="outer-container" pageWrapId="game-wrap" width="600px">
    <div className="form">
      <form>
        <div className='mb-2'>
          <label className="form-label">Username</label>
          <input type="email" className="form-control-custom" />
        </div>
        <div className='mb-2'>
          <label className="form-label">Password</label>
          <input type="password" className="form-control-custom"/>
        </div>
        <div className='mb-2'>
          <button type="submit" className="btn-custom btn-custom-dark btn-block">Log In</button>
          <button type="submit" className="btn-custom btn-custom-dark btn-block">Register Now</button>
        </div>
      </form>
    </div>
  </Menu>
);

export default LoginMenu;
