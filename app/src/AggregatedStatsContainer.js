"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _StatContainer = require("./StatContainer");

var _StatContainer2 = _interopRequireDefault(_StatContainer);

var _batchArray = require("./batch-array");

var _batchArray2 = _interopRequireDefault(_batchArray);

require("../styles/AggregatedStatsContainer.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AggregatedStatsContainer = ({
  data
}) => {
  const getContent = () => {
    return (0, _batchArray2.default)(Object.keys(data), 4).map((batch, batchIndex) => /*#__PURE__*/_react2.default.createElement("div", {
      className: "AggregatedStatsContainer-row",
      key: batchIndex
    }, batch.map((stat, keyIndex) => /*#__PURE__*/_react2.default.createElement(_StatContainer2.default, {
      name: stat,
      value: data[stat],
      key: keyIndex
    }))));
  };

  return /*#__PURE__*/_react2.default.createElement("div", {
    className: "AggregatedStatsContainer"
  }, getContent());
};

exports.default = AggregatedStatsContainer;