"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _TabSwitchContainer = require("./TabSwitchContainer");

var _TabSwitchContainer2 = _interopRequireDefault(_TabSwitchContainer);

var _PostsContainerPostsView = require("./PostsContainerPostsView");

var _PostsContainerPostsView2 = _interopRequireDefault(_PostsContainerPostsView);

var _PostsContainerGraphView = require("./PostsContainerGraphView");

var _PostsContainerGraphView2 = _interopRequireDefault(_PostsContainerGraphView);

var _material = require("@mui/material");

require("../styles/PostsContainer.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PostsContainer = ({
  posts,
  headers,
  graphData,
  openPopUp
}) => {
  const views = ['graph', 'posts'];

  const [state, setState] = _react2.default.useState({
    view: views[0]
  });

  const handleViewChange = _react2.default.useCallback(element => {
    setState(prevState => ({ ...prevState,
      view: element.target.value
    }));
  }, []);

  return /*#__PURE__*/_react2.default.createElement("div", {
    className: "PostsContainer"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "PostsContainer-dropdown"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "PostContainer-dropdown-btn"
  }, /*#__PURE__*/_react2.default.createElement(_material.FormControl, {
    sx: {
      m: 1,
      minWidth: 120
    }
  }, /*#__PURE__*/_react2.default.createElement(_material.InputLabel, null, "View"), /*#__PURE__*/_react2.default.createElement(_material.Select, {
    label: "View",
    value: state.view,
    onChange: handleViewChange
  }, /*#__PURE__*/_react2.default.createElement(_material.MenuItem, {
    value: 'posts'
  }, "Posts"), /*#__PURE__*/_react2.default.createElement(_material.MenuItem, {
    value: 'graph'
  }, "Graph"))))), state.view === 'posts' ? /*#__PURE__*/_react2.default.createElement(_PostsContainerPostsView2.default, {
    posts: posts,
    headers: headers,
    openPopUp: openPopUp
  }) : /*#__PURE__*/_react2.default.createElement(_PostsContainerGraphView2.default, {
    graphData: graphData
  }));
};

exports.default = PostsContainer;