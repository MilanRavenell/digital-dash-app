"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _TabSwitchContainer = require("./TabSwitchContainer");

var _TabSwitchContainer2 = _interopRequireDefault(_TabSwitchContainer);

var _AggregatedStatsContainer = require("./AggregatedStatsContainer");

var _AggregatedStatsContainer2 = _interopRequireDefault(_AggregatedStatsContainer);

var _PostsContainer = require("./PostsContainer");

var _PostsContainer2 = _interopRequireDefault(_PostsContainer);

var _IndividualPostPopUp = require("./IndividualPostPopUp");

var _IndividualPostPopUp2 = _interopRequireDefault(_IndividualPostPopUp);

var _ProfilePicker = require("./ProfilePicker");

var _ProfilePicker2 = _interopRequireDefault(_ProfilePicker);

var _material = require("@mui/material");

var _iconsMaterial = require("@mui/icons-material");

var _dataManipulations = require("./data-manipulations");

require("./styles/MainContentContainer.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MainContentContainer = ({
  data,
  goToAddPlatformSelection
}) => {
  const timeframeNames = data.timeframes.map(timeframe => timeframe.name);
  const profileNames = data.profiles.map(profile => profile.username);

  const [state, setState] = _react2.default.useState({
    profiles: profileNames,
    timeframe: data.timeframes[0],
    popUpPost: null,
    profilePickerExpanded: true,
    settingsAnchorEl: null
  });

  const handleProfileChange = _react2.default.useCallback(newValue => {
    setState(prevState => ({ ...prevState,
      profiles: newValue
    }));
  }, []);

  const handleTimeFrameChange = _react2.default.useCallback(event => {
    const timeframeIndex = timeframeNames.indexOf(event.target.value);
    setState(prevState => ({ ...prevState,
      timeframe: data.timeframes[timeframeIndex]
    }));
  }, []);

  const setPopUpPost = _react2.default.useCallback(post => {
    setState(prevState => ({ ...prevState,
      popUpPost: post
    }));
  }, []);

  const clearPopUpPost = () => {
    setState(prevState => ({ ...prevState,
      popUpPost: null
    }));
  };

  const toggleProfilePickerExpanded = _react2.default.useCallback(() => {
    setState(prevState => ({ ...prevState,
      profilePickerExpanded: !prevState.profilePickerExpanded
    }));
  }, []);

  const openSettingsMenu = event => {
    setState(prevState => ({ ...prevState,
      settingsAnchorEl: event.currentTarget
    }));
  };

  const closeSettingsMenu = () => {
    setState(prevState => ({ ...prevState,
      settingsAnchorEl: null
    }));
  };

  const filterRecordsByTimeframeAndUsername = () => {
    const profileRecords = data.records.filter(record => state.profiles.includes(record.username));
    const partitionDate = state.timeframe.partitionDate;

    if (partitionDate === null) {
      return profileRecords;
    }

    return profileRecords.filter(record => new Date(record['Date']) > new Date(partitionDate));
  };

  const filteredRecords = filterRecordsByTimeframeAndUsername();
  const aggregatedData = (0, _dataManipulations.getAggregatedStats)(filteredRecords, data.metrics);
  const graphData = (0, _dataManipulations.getGraphData)(filteredRecords, [...state.timeframe.graphPartitions]);

  const getPostHeaders = () => {
    const selectedProfiles = data.profiles.filter(profile => state.profiles.includes(profile.username));
    return new Set(selectedProfiles.map(profile => profile.platform)).size > 1 || state.profiles.length === 0 ? data.postHeaders['global'] : data.postHeaders[data.profiles[data.profiles.findIndex(profile => profile.username === state.profiles[0])].platform];
  };

  return /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-header"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-header-left"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-header-left-banner"
  }, "Digital Dash App")), /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-header-right"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-header-right-content"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-header-right-content-name"
  }, "Hi, Milan"), /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-header-right-content-settings"
  }, /*#__PURE__*/_react2.default.createElement(_material.IconButton, {
    onClick: openSettingsMenu
  }, /*#__PURE__*/_react2.default.createElement(_iconsMaterial.SettingsOutlined, {
    fontSize: "medium"
  }))), /*#__PURE__*/_react2.default.createElement(_material.Menu, {
    anchorEl: state.settingsAnchorEl,
    open: state.settingsAnchorEl !== null,
    onClose: closeSettingsMenu
  }, /*#__PURE__*/_react2.default.createElement(_material.MenuItem, {
    onClick: goToAddPlatformSelection
  }, "Add/Remove Accounts"), /*#__PURE__*/_react2.default.createElement(_material.MenuItem, null, "Sign Out"))))), /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-content"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-content-left"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-content-left-picker"
  }, /*#__PURE__*/_react2.default.createElement(_ProfilePicker2.default, {
    profiles: data.profiles,
    selectedProfileNames: state.profiles,
    handleProfileClick: handleProfileChange,
    expanded: state.profilePickerExpanded,
    toggleExpanded: toggleProfilePickerExpanded
  }))), /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-content-right"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-dropdown"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-dropdown-btn"
  }, /*#__PURE__*/_react2.default.createElement(_material.FormControl, {
    sx: {
      m: 1,
      minWidth: 120
    }
  }, /*#__PURE__*/_react2.default.createElement(_material.InputLabel, null, "Timeframe"), /*#__PURE__*/_react2.default.createElement(_material.Select, {
    label: "Timeframe",
    value: state.timeframe.name,
    onChange: handleTimeFrameChange
  }, data.timeframes.map((timeframe, index) => /*#__PURE__*/_react2.default.createElement(_material.MenuItem, {
    value: timeframe.name,
    key: index
  }, timeframe.name)))))), /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-content-top"
  }, /*#__PURE__*/_react2.default.createElement(_AggregatedStatsContainer2.default, {
    data: aggregatedData
  })), /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-content-bottom"
  }, /*#__PURE__*/_react2.default.createElement(_PostsContainer2.default, {
    posts: filteredRecords,
    headers: getPostHeaders(),
    graphData: graphData,
    openPopUp: setPopUpPost
  })))), state.popUpPost !== null && [/*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-popup-background",
    onClick: clearPopUpPost
  }), /*#__PURE__*/_react2.default.createElement("div", {
    className: "MainContentContainer-popup"
  }, /*#__PURE__*/_react2.default.createElement(_IndividualPostPopUp2.default, {
    post: state.popUpPost,
    headers: data.postHeaders[state.popUpPost.platform]
  }))]);
};

exports.default = MainContentContainer;