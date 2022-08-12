"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _logo = require("./logo.svg");

var _logo2 = _interopRequireDefault(_logo);

require("./styles/App.css");

var _MainContentContainer = require("./MainContentContainer");

var _MainContentContainer2 = _interopRequireDefault(_MainContentContainer);

var _SignIn = require("./SignIn");

var _SignIn2 = _interopRequireDefault(_SignIn);

var _AddPlatformSelection = require("./AddPlatformSelection");

var _AddPlatformSelection2 = _interopRequireDefault(_AddPlatformSelection);

var _AddPlatform = require("./AddPlatform");

var _AddPlatform2 = _interopRequireDefault(_AddPlatform);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const App = () => {
  const [state, setState] = _react2.default.useState({
    user: null,
    data: null,
    signUpMode: false,
    screen: 'sign-in'
  });

  _react2.default.useEffect(() => {
    if (state.user !== null && state.data === null) {
      _axios2.default.get(`http://localhost:8000/get-data?username=${state.user}`).then(response => {
        if (response.data) {
          setState({ ...state,
            data: response.data,
            screen: 'main-content'
          });
        }
      });
    }

    if (state.screen === 'loading' && state.user != null && state.data !== null) {
      console.log('fuck');
      setState({ ...state,
        screen: 'main-content'
      });
    }
  });

  const attemptSignIn = _react2.default.useCallback((username, password) => {
    _axios2.default.get(`http://localhost:8000/verify-user?username=${username}&pass=${password}`).then(response => {
      if (response.data) {
        setState(prevState => ({ ...prevState,
          user: username,
          screen: 'loading'
        }));
      }
    });
  }, []);

  const initUser = _react2.default.useCallback((username, password) => {
    _axios2.default.get(`http://localhost:8000/init-user?username=${username}&pass=${password}`).then(response => {
      if (response.data) {
        setState(prevState => ({ ...prevState,
          screen: 'add-platform-selection',
          user: username
        }));
      }
    });
  }, []);

  const goToAddPlatformSelection = _react2.default.useCallback(() => {
    setState(prevState => ({ ...prevState,
      screen: 'add-platform-selection'
    }));
  }, []);

  const goToAddPlatform = _react2.default.useCallback(platform => {
    setState(prevState => ({ ...prevState,
      screen: 'add-platform',
      addPlatform: platform
    }));
  }, []);

  const addPlatformAccount = _react2.default.useCallback((username, platform) => {
    _axios2.default.get(`http://localhost:8000/update-user?username=${state.user}&${platform}_user=${username}`).then(response => {
      setState(prevState => ({ ...prevState,
        screen: 'add-platform-selection'
      }));
    });
  }, [state]);

  const finishSignUp = _react2.default.useCallback(() => {
    // axios.get(`http://localhost:8000/run-scrapers?username=${state.user}`)
    setState(prevState => ({ ...prevState,
      screen: 'loading'
    }));
  }, [state]);

  const getContent = () => {
    switch (state.screen) {
      case 'sign-in':
        return /*#__PURE__*/_react2.default.createElement(_SignIn2.default, {
          handleSubmit: attemptSignIn,
          handleSignUp: initUser
        });

      case 'add-platform-selection':
        return /*#__PURE__*/_react2.default.createElement(_AddPlatformSelection2.default, {
          handlePlatformSelected: goToAddPlatform,
          handleContinue: finishSignUp,
          currentProfiles: state.data !== null ? state.data.profiles : []
        });

      case 'add-platform':
        return /*#__PURE__*/_react2.default.createElement(_AddPlatform2.default, {
          platform: state.addPlatform,
          handleSubmit: addPlatformAccount
        });

      case 'loading':
        return 'Loading';

      case 'main-content':
        return /*#__PURE__*/_react2.default.createElement(_MainContentContainer2.default, {
          user: state.user,
          data: state.data,
          goToAddPlatformSelection: goToAddPlatformSelection
        });
    }
  };

  return /*#__PURE__*/_react2.default.createElement("div", {
    className: "App"
  }, /*#__PURE__*/_react2.default.createElement("header", {
    className: "App-header"
  }), getContent());
};

exports.default = App;