import React from 'react';
import './LoginForm.css';

const LoginFrom: React.FC<{}> = () => (
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
        <a className="btn-custom btn-custom-dark btn-block">Log In</a>
        <a className="btn-custom btn-custom-dark btn-block">Register Now</a>
      </div>
      <div className="mb-2" />
      <div className="mb-2">
        <a className="btn-custom btn-custom-dark btn-block" href="/auth/google">Log In with Google</a>
      </div>
    </form>
  </div>
);

export default LoginFrom;
