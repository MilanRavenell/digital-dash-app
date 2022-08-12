"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

require("./styles/TabSwitchContainer.css");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TabSwitchContainer = ({
  tabList,
  showSelectAll,
  currentTabs,
  onChange,
  children
}) => {
  const [state, setState] = _react2.default.useState({
    tabs: tabList
  });

  const onClick = value => {
    onChange(value);
  };

  _react2.default.useEffect(() => {
    if (showSelectAll && !state.tabs.includes('select all')) {
      const tabs = state.tabs;
      tabs.unshift('select all');
      setState(prevState => ({ ...prevState,
        tabs
      }));
    }
  });

  const style = value => {
    const activeStyles = currentTabs.includes(value) ? {
      color: 'red'
    } : {
      color: 'black'
    };
    return {
      flex: 1,
      ...activeStyles
    };
  };

  return /*#__PURE__*/_react2.default.createElement("div", {
    className: "TabSwitchContainer"
  }, /*#__PURE__*/_react2.default.createElement("div", {
    style: {
      border: "1px solid black",
      borderRadius: '5px',
      margin: '10px',
      display: 'flex'
    }
  }, state.tabs.map(tab => /*#__PURE__*/_react2.default.createElement("div", {
    key: tab,
    onClick: () => onClick(tab),
    style: style(tab)
  }, tab[0].toUpperCase() + tab.substring(1)))), /*#__PURE__*/_react2.default.createElement("div", null, children));
};

exports.default = TabSwitchContainer;