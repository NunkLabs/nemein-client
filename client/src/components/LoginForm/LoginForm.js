import React from 'react';
import './LoginForm.css';

const LoginForm = () => (
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
)

export default LoginForm;
