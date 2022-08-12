"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _StatContainer = require("./StatContainer");

var _StatContainer2 = _interopRequireDefault(_StatContainer);

var _TimeframePicker = require("./TimeframePicker");

var _TimeframePicker2 = _interopRequireDefault(_TimeframePicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AveragesContainer = ({
  data
}) => {
  const [state, setState] = _react2.default.useState({
    timeframe: 'day'
  });

  const handleTimeframeChange = _react2.default.useCallback(newValue => {
    setState({
      timeframe: newValue
    });
  }, []);

  return /*#__PURE__*/_react2.default.createElement("div", {
    style: {
      display: 'flex',
      border: '1px solid black',
      borderRadius: '5px'
    }
  }, /*#__PURE__*/_react2.default.createElement(_StatContainer2.default, {
    name: "Average Views",
    value: data[state.timeframe].avg_views
  }), /*#__PURE__*/_react2.default.createElement(_StatContainer2.default, {
    name: "Average Engagement",
    value: data[state.timeframe].avg_engagements
  }), /*#__PURE__*/_react2.default.createElement(_TimeframePicker2.default, {
    timeframe: state.timeframe,
    onChange: handleTimeframeChange
  }));
};

exports.default = AveragesContainer;