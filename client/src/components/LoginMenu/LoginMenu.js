import React from 'react';
import { scaleDown as Menu } from 'react-burger-menu'; 
import './LoginMenu.css';

class LoginMenu extends React.Component {
  showSettings (event) 
  {
    event.preventDefault();
  }

  render() 
  {
    return (
      <Menu isOpen={ true } outerContainerId={ 'outer-container' } pageWrapId={ 'game-wrap' } width={ '600px' }>
        <div className='form'>
          <form>
            <div className="form-group">
              <label>Username</label>
              <input type="email" className="form-control-custom"></input>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" className="form-control-custom"></input>
            </div>
            <button type="submit" className="btn-custom btn-custom-dark btn-block">Log In</button>
            <button type="submit" className="btn-custom btn-custom-dark btn-block">Register Now</button>
          </form>
        </div>
      </Menu>
    )
  }
}

export default LoginMenu;
