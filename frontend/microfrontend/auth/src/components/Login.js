import React from 'react';

import '../blocks/login/login.css';
import '../blocks/auth-form/auth-form.css';
import api from '../utils/api'
import InfoTooltip from "./InfoTooltip";

function Login ( props ){
  const { history, location, match } = props;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

    const [tooltipStatus, setTooltipStatus] = React.useState(location.state?.tooltipStatus || "");
    const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(location.state?.isInfoToolTipOpen || false);


    function sendLoginEvent(status) {
        dispatchEvent(new CustomEvent("login-event", {
            detail: status
        }) );
    }

    function closeTooltopPopup() {
        setIsInfoToolTipOpen(false);
    }

  function onLogin({ email, password }) {
    api
        .login(email, password)
        .then((res) => {
          sendLoginEvent(true);
          setEmail(email);
          history.push("/");
        })
        .catch((err) => {
            setTooltipStatus("fail");
            setIsInfoToolTipOpen(true);
        });
  }

  function handleSubmit(e){
    e.preventDefault();
    const userData = {
      email,
      password
    }
    onLogin(userData);
  }
  return (
    <div className="auth-form">
      <form className="auth-form__form" onSubmit={handleSubmit}>
        <div className="auth-form__wrapper">
          <h3 className="auth-form__title">Вход</h3>
          <label className="auth-form__input">
            <input type="text" name="name" id="email"
              className="auth-form__textfield" placeholder="Email"
              onChange={e => setEmail(e.target.value)} required  />
          </label>
          <label className="auth-form__input">
            <input type="password" name="password" id="password"
              className="auth-form__textfield" placeholder="Пароль"
              onChange={e => setPassword(e.target.value)} required  />
          </label>
        </div>
        <button className="auth-form__button" type="submit">Войти</button>
      </form>
        <InfoTooltip
            isOpen={isInfoToolTipOpen}
            onClose={closeTooltopPopup}
            status={tooltipStatus}
        />
    </div>
  )
}

export default Login;
