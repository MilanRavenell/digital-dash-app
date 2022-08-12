"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _material = require("@mui/material");

require("./styles/SignIn.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SignIn = ({
  handleSubmit,
  handleSignUp
}) => {
  const userRef = _react2.default.useRef();

  const passRef = _react2.default.useRef();

  const onSubmitClick = () => {
    handleSubmit(userRef.current.value, passRef.current.value);
  };

  const onSignUpClick = () => {
    handleSignUp(userRef.current.value, passRef.current.value);
  };

  return /*#__PURE__*/_react2.default.createElement("div", {
    className: "SignIn"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "SignIn-Form"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "SignIn-email"
  }, /*#__PURE__*/_react2.default.createElement(_material.TextField, {
    inputRef: userRef,
    variant: "outlined",
    label: "email"
  })), /*#__PURE__*/_react2.default.createElement("div", {
    className: "SignIn-password"
  }, /*#__PURE__*/_react2.default.createElement(_material.TextField, {
    inputRef: passRef,
    variant: "outlined",
    label: "password",
    type: "password"
  })), /*#__PURE__*/_react2.default.createElement("div", null, /*#__PURE__*/_react2.default.createElement(_material.Button, {
    onClick: onSubmitClick
  }, "Sign In")), /*#__PURE__*/_react2.default.createElement("div", null, /*#__PURE__*/_react2.default.createElement(_material.Button, {
    onClick: onSignUpClick
  }, "Sign Up"))));
};

exports.default = SignIn;