import React from 'react';
import { Link } from 'react-router-dom';
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
        <button type="submit" className="btn-custom btn-custom-dark btn-block">Log In</button>
        <button type="submit" className="btn-custom btn-custom-dark btn-block">Register Now</button>
      </div>
      <div className="mb-2" />
      <div className="mb-2">
        <Link to="/auth/google">
          <button type="submit" className="btn-custom btn-custom-dark btn-block">Log In with Google</button>
        </Link>
      </div>
    </form>
  </div>
);

export default LoginFrom;
