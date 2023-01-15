export const dynamicRemoteContainerPackages = {
  react: {
    // eslint-disable-next-line global-require

    // eslint-disable-next-line global-require
    [require('react/package.json').version]: {
      // eslint-disable-next-line global-require

      get: () => new Promise((res) => res(() => require('react'))),

      loaded: true,

      from: 'webpack4',
    },
  },

  'react-dom': {
    // eslint-disable-next-line global-require

    [require('react-dom/package.json').version]: {
      // eslint-disable-next-line global-require

      get: () => new Promise((res) => res(() => require('react-dom'))),

      loaded: true,

      from: 'webpack4',
    },
  },

  'react-router-dom': {
    // eslint-disable-next-line global-require

    [require('react-router-dom/package.json').version]: {
      // eslint-disable-next-line global-require

      get: () => new Promise((res) => res(() => require('react-router-dom'))),

      loaded: true,

      from: 'webpack4',
    },
  },
};
