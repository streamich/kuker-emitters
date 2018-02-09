import sanitize from './helpers/sanitize';
import createMessenger from './helpers/createMessenger';

export default function ReduxEmitter() {
  const message = createMessenger('ReduxEmitter', 'Redux library');

  return function middleware({ getState, dispatch }) {
    return next => action => {
      const result = next(action);

      message({
        state: sanitize(getState()),
        type: '@redux_ACTION',
        action: sanitize(action)
      });
      return result;
    };
  };
};
