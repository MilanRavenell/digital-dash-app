"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _batchArray = require("./batch-array");

var _batchArray2 = _interopRequireDefault(_batchArray);

require("../styles/IndividualPostPopUp.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const IndividualPostPopUp = ({
  post,
  headers
}) => {
  return /*#__PURE__*/_react2.default.createElement("div", {
    className: "IndividualPostPopUp"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "IndividualPostPopUp-details"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "IndividualPostPopUp-header"
  }, "Post"), /*#__PURE__*/_react2.default.createElement("div", {
    className: "IndividualPostPopUp-title"
  }, post['Title']), /*#__PURE__*/_react2.default.createElement("div", {
    className: "IndividualPostPopUp-extra-details"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "IndividualPostPopUp-title-date"
  }, post['Date']), /*#__PURE__*/_react2.default.createElement("div", {
    className: "IndividualPostPopUp-title-link"
  }, /*#__PURE__*/_react2.default.createElement("a", {
    href: post['Link'],
    target: "_blank",
    rel: "noreferrer"
  }, "Link")))), /*#__PURE__*/_react2.default.createElement("div", {
    className: "IndividualPostPopUp-stats"
  }, (0, _batchArray2.default)(headers.filter(header => header != 'Title' && header != 'Date'), 2).map((batch, batchIndex) => /*#__PURE__*/_react2.default.createElement("div", {
    className: "IndividualPostPopUp-stats-row",
    key: batchIndex
  }, batch.map((key, keyIndex) => /*#__PURE__*/_react2.default.createElement("div", {
    className: "IndividualPostPopUp-stats-stat",
    key: `${keyIndex}-stat`
  }, /*#__PURE__*/_react2.default.createElement("div", null, key, key != null ? ':' : ''), /*#__PURE__*/_react2.default.createElement("div", null, post[key])))))), /*#__PURE__*/_react2.default.createElement("div", {
    className: "IndividualPostPopUp-engagements"
  }));
};

exports.default = IndividualPostPopUp;