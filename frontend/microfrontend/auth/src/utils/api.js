const BASE_URL = 'https://auth.nomoreparties.co';

class Api {
  constructor({address}) {
    // стандартная реализация — объект options
    this._address = address;
  }

  getResponse(res) {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  }

  register(email, password) {
    return fetch(`${BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
        .then(this.getResponse)
  };

  login(email, password) {
    return fetch(`${BASE_URL}/signin`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({email, password})
    })
        .then(this.getResponse)
        .then((data) => {
          localStorage.setItem('jwt', data.token)
          return data;
        })
  };

  checkToken(token) {
    return fetch(`${BASE_URL}/users/me`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
        .then(this.getResponse)
  }
}

const api = new Api({
  //address: 'http://localhost:3001',
  address: 'https://nomoreparties.co',
});

export default api;