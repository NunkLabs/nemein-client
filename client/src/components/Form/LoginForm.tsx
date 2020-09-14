import React from 'react';

import './LoginForm.css';

const LoginFrom: React.FC<Record<string, unknown>> = () => (
  <div className="form">
    <h1>TetriBASS</h1>
    <form>
      <div className="mb-2">
        <label className="form-label" htmlFor="username-input">
          Email address
          <input type="email" className="form-control-custom" id="username-input" />
        </label>
      </div>
      <div className="mb-2">
        <label className="form-label" htmlFor="password-input">
          Password
          <input type="password" className="form-control-custom" id="password-input" />
        </label>
      </div>
      <div className="mb-3 form-buttons">
        <button type="submit" className="btn-custom btn-custom-light btn-block">Register Now</button>
        <div />
        <button type="submit" className="btn-custom btn-custom-dark btn-block">Log In</button>
      </div>
      <div className="mb-3 form-separator">
        Or
      </div>
      <div>
        <a className="btn-custom btn-custom-dark btn-block google-log-in" href="/auth/google">Log In with Google</a>
      </div>
    </form>
  </div>
);

export default LoginFrom;
