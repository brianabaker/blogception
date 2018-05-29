const tokenService = require('../services/tokenService');
const userModel = require('../models/auth');

function recieveToken(req, res, next) {
  if (req.headers.authorization) {
    req.authToken = req.headers.authorization.replace(/^Bearer\s/, '');
  }
  next();
};

function restrict(req, res, next) {
  tokenService.verify(req.authToken)
    .then(data => {
      res.locals.user = data;
      next();
    })
    .catch(err => res.status(401).json({
      status: 'Error',
      message: 'Invalid credentials'
    }))
}

function register(req, res) {
  userModel.register(req.body)
    .catch(err => res.status(401).json({
      message: 'Username taken'
    }))
    .then(data => tokenService.makeToken({
      username: data.username,
      email: data.email,
      id: data.id
    }))
    .then(token => {
      res.json({
        token
      })
    });
}

function login(req, res, next) {
  userModel.login(req.body)
    .catch(err => res.status(401).json({
      status: 'Error',
      message: 'Invalid credentials'
    }))
    .then(data => tokenService.makeToken({
      id: data.id,
      email: data.email,
      username: data.username
    }))
    .then(token => {
      res.json({
        token
      })
    });
}

module.exports = {
  recieveToken,
  restrict,
  register,
  login
}