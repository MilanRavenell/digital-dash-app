"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _material = require("@mui/material");

require("./styles/AddPlatform.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AddPlatform = ({
  platform,
  handleSubmit
}) => {
  const userRef = _react2.default.useRef();

  const onSubmitClick = () => {
    handleSubmit(userRef.current.value, platform);
  };

  const onCancelClick = () => {
    handleSubmit(null, null);
  };

  return /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatform"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatform-left"
  }), /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatform-right"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatform-form"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatform-header"
  }, "Add ", platform, " account"), /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatform-username"
  }, /*#__PURE__*/_react2.default.createElement(_material.TextField, {
    inputRef: userRef,
    variant: "outlined",
    label: "username"
  })), /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatform-buttons"
  }, /*#__PURE__*/_react2.default.createElement(_material.Button, {
    onClick: onSubmitClick
  }, "Add Account"), /*#__PURE__*/_react2.default.createElement(_material.Button, {
    onClick: onCancelClick
  }, "Cancel")))));
};

exports.default = AddPlatform;