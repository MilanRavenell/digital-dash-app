"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("./styles/StatContainer.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class StatContainer extends _react2.default.Component {
  render() {
    return /*#__PURE__*/_react2.default.createElement("div", {
      className: "StatContainer"
    }, this.props.name != null && /*#__PURE__*/_react2.default.createElement("div", {
      className: "StatContainer-inner"
    }, /*#__PURE__*/_react2.default.createElement("div", {
      className: "StatContainer-content"
    }, /*#__PURE__*/_react2.default.createElement("div", {
      className: "StatContainer-title"
    }, " ", this.props.name, " "), /*#__PURE__*/_react2.default.createElement("div", {
      className: "StatContainer-value"
    }, " ", this.props.value, " "), /*#__PURE__*/_react2.default.createElement("div", {
      className: "StatContainer-footer"
    }))));
  }

}

exports.default = StatContainer;