"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _TabSwitchContainer = require("./TabSwitchContainer");

var _TabSwitchContainer2 = _interopRequireDefault(_TabSwitchContainer);

var _material = require("@mui/material");

var _iconsMaterial = require("@mui/icons-material");

var _ProfilePicker = require("./ProfilePicker");

var _ProfilePicker2 = _interopRequireDefault(_ProfilePicker);

require("./styles/AddPlatformSelection.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AddPlatformSelection = ({
  handlePlatformSelected,
  handleContinue,
  currentProfiles
}) => {
  const platformList = ['twitter', 'youtube', 'tiktok'];
  return /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-left"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-left-picker"
  }, /*#__PURE__*/_react2.default.createElement(_ProfilePicker2.default, {
    profiles: currentProfiles,
    editMode: true
  }))), /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-right"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-right-content-container"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-right-content"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-platforms"
  }, platformList.map(platform => /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-platform"
  }, /*#__PURE__*/_react2.default.createElement(_material.Button, {
    className: "AddPlatformSelection-platform-inner",
    variant: "outlined",
    onClick: () => {
      handlePlatformSelected(platform);
    },
    key: platform
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-platform-logoName"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-platform-logo"
  }, "hi"), /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-platform-name"
  }, platform)), /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-platform-plus"
  }, /*#__PURE__*/_react2.default.createElement(_iconsMaterial.Add, {
    fontSize: "large"
  })))))), /*#__PURE__*/_react2.default.createElement("div", {
    className: "AddPlatformSelection-button"
  }, /*#__PURE__*/_react2.default.createElement(_material.Button, {
    onClick: handleContinue
  }, "Continue"))))));
};

exports.default = AddPlatformSelection;