import sanitize from './helpers/sanitize';
import createMessenger from './helpers/createMessenger';

const sym = name => '@@freestyler/' + name;
const $$instanceId = sym('debut/instanceId');

let instanceId = 0;

const getCompName = (Comp, instance) => {
  let name = `<${Comp.displayName || Comp.name || 'Unknown'}>`;

  if (instance) {
    if (!instance[$$instanceId]) {
      instance[$$instanceId] = instanceId++;
    }

    name += `[${instance[$$instanceId].toString(36)}]`;
  }

  return name;
};

const reducer = (state, action) => {
  const {Comp, instance} = action;
  const name = getCompName(Comp, instance);

  switch (action.type) {
    case 'RENDER': {
      return {
        ...state,
        [name]: action.styles
      };
    }
    case 'UNRENDER': {
      // eslint-disable-next-line no-unused-vars
      const {[name]: omit, ...rest} = state;

      return rest;
    }
    case 'RENDER_STATIC': {
      return {
        ...state,
        [name]: action.styles
      };
    }
  }

  return state;
};

export default function FreestylerEmitter(prefix = '') {
  let state = {};
  const message = createMessenger('FreestylerEmitter', 'Freestyler library');
  const channelName = sym('debug' + (prefix ? '/' + prefix : ''));
  const broadcaster = window[channelName];

  if (typeof broadcaster !== 'object') {
    const error = new Error(
      `Freestyler debug channel not found at window['${channelName}'].` +
      'If you are using FREESTYLER_PREFIX env variable, you have to specify' +
      'that in your kuker emitter, like FreestylerEmitter(myPrefix).'
    );

    console.error(error);
  }

  broadcaster.sub(action => {
    state = reducer(state, action);

    message({
      state: sanitize(state),
      type: '@freestyler_ACTION'
    });
  });
};
