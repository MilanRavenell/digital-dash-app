"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _material = require("@mui/material");

var _iconsMaterial = require("@mui/icons-material");

var _twit_prof_pic = require("./twit_prof_pic.jpeg");

var _twit_prof_pic2 = _interopRequireDefault(_twit_prof_pic);

var _twit_cover = require("./twit_cover.jpeg");

var _twit_cover2 = _interopRequireDefault(_twit_cover);

var _twitter_logo = require("./twitter_logo.png");

var _twitter_logo2 = _interopRequireDefault(_twitter_logo);

var _youtube_logo = require("./youtube_logo.png");

var _youtube_logo2 = _interopRequireDefault(_youtube_logo);

require("./styles/ProfilePicker.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ProfilePicker = ({
  profiles,
  selectedProfileNames,
  handleProfileClick,
  expanded,
  toggleExpanded,
  editMode
}) => {
  const onProfileClick = profile => {
    if (editMode) {
      return;
    }

    if (profile === 'select-all') {
      handleProfileClick(profiles.map(profile => profile.username));
      return;
    }

    if (profile === 'select-none') {
      handleProfileClick([]);
      return;
    } // deep copy selectedProfileNames


    const finalProfiles = [...selectedProfileNames];

    if (finalProfiles.includes(profile)) {
      finalProfiles.splice(finalProfiles.indexOf(profile), 1);
    } else {
      finalProfiles.push(profile);
    }

    handleProfileClick(finalProfiles);
  };

  const selectedStyle = profile => {
    if (editMode) {
      return;
    }

    if (selectedProfileNames.includes(profile)) {
      return {
        color: 'blue',
        border: '1px solid blue'
      };
    }
  };

  const getExpandedContent = () => /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expanded-header"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expanded-header-text"
  }, "Profiles"), !editMode && /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-header-minimize",
    onClick: toggleExpanded
  }, /*#__PURE__*/_react2.default.createElement(_material.IconButton, null, /*#__PURE__*/_react2.default.createElement(_iconsMaterial.ArrowBackIos, null)))), !editMode && /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-button"
  }, /*#__PURE__*/_react2.default.createElement(_material.Button, {
    onClick: () => {
      onProfileClick('select-all');
    }
  }, "Select All"), /*#__PURE__*/_react2.default.createElement(_material.Button, {
    onClick: () => {
      onProfileClick('select-none');
    }
  }, "Select None")), profiles.map((profile, index) => /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-profile-container"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-profile",
    key: index,
    onClick: () => {
      onProfileClick(profile.username);
    },
    style: selectedStyle(profile.username)
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-profile-platform"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-profile-platform-logo",
    style: {
      backgroundImage: `url(${profile.platform === 'twitter' ? _twitter_logo2.default : _youtube_logo2.default})`
    }
  })), /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-profile-details"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-profile-pic-overlay"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-profile-pic",
    style: {
      backgroundImage: `url(${_twit_prof_pic2.default})`
    }
  })), /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-profile-cover",
    style: {
      backgroundImage: `url(${_twit_cover2.default})`
    }
  }), /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-profile-username"
  }, profile.username))), editMode && /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-expand-profile-delete"
  }, /*#__PURE__*/_react2.default.createElement(_material.Button, null, "Delete")))));

  const getMinimizedContent = () => /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-minimize"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-minimize-expand",
    onClick: toggleExpanded
  }, /*#__PURE__*/_react2.default.createElement(_material.IconButton, null, /*#__PURE__*/_react2.default.createElement(_iconsMaterial.ArrowForwardIos, null))), profiles.map((profile, index) => /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-minimize-profile",
    key: index
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "ProfilePicker-minimize-profile-pic",
    style: { ...selectedStyle(profile.username),
      backgroundImage: `url(${_twit_prof_pic2.default})`
    }
  }))));

  return expanded || editMode ? getExpandedContent() : getMinimizedContent();
};

exports.default = ProfilePicker;