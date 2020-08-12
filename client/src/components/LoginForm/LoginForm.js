import React from 'react';
import './LoginForm.css';

const LoginForm = () => (
  <div class='form'>
    <form>
      <div class="form-group">
        <label>Username</label>
        <input type="email" class="form-control-custom"></input>
      </div>
      <div class="form-group">
        <label>Password</label>
        <input type="password" class="form-control-custom"></input>
      </div>
      <button type="submit" class="btn-custom btn-custom-dark btn-block">Log In</button>
      <button type="submit" class="btn-custom btn-custom-dark btn-block">Register Now</button>
    </form>
  </div>
)

export default LoginForm;
