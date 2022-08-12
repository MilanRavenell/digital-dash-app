"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TimeFramePicker = ({
  timeframe,
  onChange
}) => {
  const onClick = value => {
    onChange(value);
  };

  const style = value => {
    return value === timeframe ? {
      color: 'red'
    } : {
      color: 'black'
    };
  };

  return /*#__PURE__*/_react2.default.createElement("div", {
    style: {
      border: "1px solid black",
      borderRadius: '5px',
      margin: '10px',
      flex: 1
    }
  }, /*#__PURE__*/_react2.default.createElement("div", {
    onClick: () => onClick('day'),
    style: style('day')
  }, " 1 Day "), /*#__PURE__*/_react2.default.createElement("div", {
    onClick: () => onClick('week'),
    style: style('week')
  }, " 1 Week "), /*#__PURE__*/_react2.default.createElement("div", {
    onClick: () => onClick('month'),
    style: style('month')
  }, " 1 Month "), /*#__PURE__*/_react2.default.createElement("div", {
    onClick: () => onClick('year'),
    style: style('year')
  }, " 1 Year "));
};

exports.default = TimeFramePicker;