"use strict";

var _react = require("@testing-library/react");

var _App = require("./App");

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('renders learn react link', () => {
  (0, _react.render)( /*#__PURE__*/React.createElement(_App2.default, null));

  const linkElement = _react.screen.getByText(/learn react/i);

  expect(linkElement).toBeInTheDocument();
});