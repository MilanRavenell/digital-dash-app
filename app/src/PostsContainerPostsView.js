"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("./styles/PostsContainerPostsView.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const PostsContainerPostsView = ({
  posts,
  headers,
  openPopUp
}) => {
  return /*#__PURE__*/_react2.default.createElement("div", {
    className: "PostsContainerPostsView"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "PostsContainerPostsView-header"
  }, headers.map((field, keyIndex) => {
    const style = field === 'Platform' ? 'short' : 'long';
    return /*#__PURE__*/_react2.default.createElement("div", {
      className: `PostsContainerPostsView-header-field PostsContainerPostsView-header-field-${style}`,
      key: keyIndex
    }, field);
  })), posts.map((post, postIndex) => {
    return /*#__PURE__*/_react2.default.createElement("div", {
      className: "PostsContainerPostsView-post",
      key: postIndex,
      onClick: () => {
        openPopUp(post);
      }
    }, headers.map((field, keyIndex) => {
      const style = field === 'Platform' ? 'short' : 'long';
      return /*#__PURE__*/_react2.default.createElement("div", {
        className: `PostsContainerPostsView-post-field PostsContainerPostsView-post-field-${style}`,
        key: keyIndex
      }, field === 'Title' ? /*#__PURE__*/_react2.default.createElement("a", {
        href: post['Link'],
        target: "_blank",
        rel: "noreferrer"
      }, post[field]) : post[field]);
    }));
  }));
};

exports.default = PostsContainerPostsView;