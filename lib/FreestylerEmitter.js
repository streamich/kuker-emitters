'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = FreestylerEmitter;

var _sanitize = require('./helpers/sanitize');

var _sanitize2 = _interopRequireDefault(_sanitize);

var _createMessenger = require('./helpers/createMessenger');

var _createMessenger2 = _interopRequireDefault(_createMessenger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var sym = function sym(name) {
  return '@@freestyler/' + name;
};
var $$instanceId = sym('debut/instanceId');

var instanceId = 0;

var getCompName = function getCompName(Comp, instance) {
  var name = '<' + (Comp.displayName || Comp.name || 'Unknown') + '>';

  if (instance) {
    if (!instance[$$instanceId]) {
      instance[$$instanceId] = instanceId++;
    }

    name += '[' + instance[$$instanceId].toString(36) + ']';
  }

  return name;
};

var reducer = function reducer(state, action) {
  var Comp = action.Comp,
      instance = action.instance;

  var name = getCompName(Comp, instance);

  switch (action.type) {
    case 'RENDER':
      {
        var _extends2;

        return _extends({}, state, (_extends2 = {}, _extends2[name] = action.styles, _extends2));
      }
    case 'UNRENDER':
      {
        // eslint-disable-next-line no-unused-vars
        var omit = state[name],
            rest = _objectWithoutProperties(state, [name]);

        return rest;
      }
    case 'RENDER_STATIC':
      {
        var _extends3;

        return _extends({}, state, (_extends3 = {}, _extends3[name] = action.styles, _extends3));
      }
  }

  return state;
};

function FreestylerEmitter() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  var state = {};
  var message = (0, _createMessenger2.default)('FreestylerEmitter', 'Freestyler library');
  var channelName = sym('debug' + (prefix ? '/' + prefix : ''));
  var broadcaster = window[channelName];

  if ((typeof broadcaster === 'undefined' ? 'undefined' : _typeof(broadcaster)) !== 'object') {
    var error = new Error('Freestyler debug channel not found at window[\'' + channelName + '\'].' + 'If you are using FREESTYLER_PREFIX env variable, you have to specify' + 'that in your kuker emitter, like FreestylerEmitter(myPrefix).');

    console.error(error);
  }

  broadcaster.sub(function (action) {
    state = reducer(state, action);

    message({
      state: (0, _sanitize2.default)(state),
      type: '@freestyler_ACTION'
    });
  });
};
module.exports = exports['default'];