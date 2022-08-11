"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactChartjs = require("react-chartjs-2");

var _chart = require("chart.js");

require("./styles/PostsContainerGraphView.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chart.Chart.register(_chart.BarElement, _chart.CategoryScale, _chart.LinearScale, _chart.PointElement, _chart.LineElement, _chart.Title, _chart.Tooltip, _chart.Legend);

const PostsContainerGraphView = ({
  graphData
}) => {
  return /*#__PURE__*/_react2.default.createElement("div", {
    className: "PostsContainerGraphView"
  }, /*#__PURE__*/_react2.default.createElement(_reactChartjs.Bar, {
    data: graphData,
    options: {
      responsive: true,
      maintainAspectRatio: false
    }
  }));
};

exports.default = PostsContainerGraphView;