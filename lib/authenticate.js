import jwt_decode from "jwt-decode";

function setToken(token) {
  localStorage.setItem("access_token", token);
}

function getToken() {
  try {
    return localStorage.getItem("access_token");
  } catch (err) {
    return null;
  }
}

function removeToken() {
  localStorage.removeItem("access_token");
}

function readToken() {
  try {
    const token = getToken();
    return token ? jwt_decode(token) : null;
  } catch (err) {
    return null;
  }
}

function isAuthenticated() {
  const token = readToken();
  return token ? true : false;
}

async function authenticateUser(user, password) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ userName: user, password: password }),
    headers: {
      "content-type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    setToken(data.token);
    return true;
  } else {
    throw new Error(data.message);
  }
}

async function registerUser(user, email, password, password2) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
    method: "POST",
    body: JSON.stringify({
      userName: user,
      email: email,
      password: password,
      password2: password2,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return true;
  } else {
    throw new Error(data.message);
  }
}

module.exports = {
  setToken,
  getToken,
  removeToken,
  readToken,
  isAuthenticated,
  authenticateUser,
  registerUser,
};
