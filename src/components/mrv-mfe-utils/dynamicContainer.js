/* eslint-disable react/default-props-match-prop-types */
/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
// import { logMFEEvent } from 'omnia-logger/src';
import { dynamicRemoteContainerPackages } from './dynamicRemoteContainerPackages';
// import { MfeLoader } from './MfeLoader';

const loadUrlStatus = {};
const initializedScopes = {};

let startTime = new Date();
const mfeNames = {
  ItemKeywordSearch: 'item-lookup',
};

// const callSuccessLogMfeEvent = (scope, getMfeName, url) => {
//   const mfeVersion = localStorage.getItem(`${scope}-version`);
//   logMFEEvent({
//     mfeName: getMfeName || '',
//     mfeVersion: mfeVersion || 'version not set',
//     startTime,
//     endTime: new Date(),
//     successFlag: true,
//     mfeRemoteUrl: url || '',
//   });
// };

const loadDynamicScript = (url, key) =>
  new Promise((resolve) => {
    const windowObj = window;
    const remoteUrl = url || windowObj[key] || '';
    if (!loadUrlStatus[remoteUrl]) {
      loadUrlStatus[remoteUrl] = new Promise((res) => {
        const element = document.createElement('script');
        element.src = remoteUrl;
        element.type = 'text/javascript';
        element.async = true;

        element.onload = () => {
          console.log(`Dynamic Script Loaded: ${remoteUrl}`);
          res(true);
        };

        element.onerror = () => {
          console.log(`Dynamic Script Error: ${remoteUrl}`);
          res(false);
        };

        document.head.appendChild(element);
      });
    }
    loadUrlStatus[remoteUrl].then(resolve);
  });

const useDynamicScript = (url, fallbackEntryUrl, getMfeName, key) => {
  const windowObj = window;
  const remoteUrl = url || windowObj[key] || '';
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);

  //   const callFailedLogMfeEvent = (mfeRemoteUrl) => {
  //     logMFEEvent({
  //       mfeName: getMfeName || '',
  //       mfeVersion: 'version not set',
  //       startTime,
  //       endTime: new Date(),
  //       successFlag: false,
  //       mfeRemoteUrl: mfeRemoteUrl || '',
  //     });
  //   };

  useEffect(() => {
    if (!loadUrlStatus[remoteUrl] && (url || key)) {
      startTime = new Date();
      loadDynamicScript(url, key).then((status) => {
        if (!status && !fallbackEntryUrl) {
          //   callFailedLogMfeEvent(url);
          delete loadUrlStatus[url];
          setFailed(true);
        } else if (!status && fallbackEntryUrl) {
          //   callFailedLogMfeEvent(url);
          delete loadUrlStatus[url];
          loadDynamicScript(fallbackEntryUrl, key).then((newtatus) => {
            if (!newtatus) {
              //       callFailedLogMfeEvent(fallbackEntryUrl);
              delete loadUrlStatus[fallbackEntryUrl];
              setFailed(true);
            } else {
              setReady(true);
            }
          });
        }
        setReady(true);
      });
    } else if (loadUrlStatus[remoteUrl]) {
      setReady(true);
    }
  }, [url, key]);

  return {
    ready,
    failed,
  };
};

const DynamicRemoteContainer = ({
  url,
  fallbackUrl,
  scope,
  module: moduleName,
  compProps,
  packages,
  loader,
  onError,
  mfeName,
  LoaderComponent,
  ErrorComponent,
  initialLoadForLazyLoading,
}) => {
  const getMfeName = mfeName || mfeNames[scope];
  const remoteEntryUrl = url?.trim();
  const fallbackEntryUrl = fallbackUrl?.trim();
  const { ready, failed } = useDynamicScript(remoteEntryUrl, fallbackEntryUrl, getMfeName);
  const [Component, setComponent] = useState(null);
  const moduleNameMem = useMemo(() => {
    if (moduleName.match(/^\.\//)) {
      return moduleName;
    }
    return `./${moduleName}`;
  }, [moduleName]);

  const legacyShareScope = useMemo(
    () => ({
      ...dynamicRemoteContainerPackages,
      ...(packages || {}),
    }),
    [packages],
  );

  const getLoader = () => (
    //     if (LoaderComponent) return <LoaderComponent />;
    //     if (loader) return <MfeLoader loader={loader} />;
    <h2>Loading dynamic script: {remoteEntryUrl}</h2>
  );
  useEffect(() => {
    const Comp = lazy(
      () =>
        new Promise((resolve) => {
          const moduleResolve = resolve;
          new Promise((res) => {
            /**
             * to fix container already initialized issue.
             */
            console.log('initializedScopes----', initializedScopes);
            console.log('initializedScopes[scope]---', initializedScopes[scope]);
            console.log('scope-----', scope);
            const oldScopeGh = __webpack_require__.S['default'];
            __webpack_require__.S['default'] = null;
            if (!initializedScopes[scope]) {
              initializedScopes[scope] = legacyShareScope;
            }
            // if (oldScopeGh) {
            window[scope].init(initializedScopes[scope]);
            // }
            res(1);
          }).then(() => {
            window[scope].get(moduleNameMem).then((factory) => {
              moduleResolve(factory());
            });
          });
        }),
    );
    setComponent(Comp);
  }, [remoteEntryUrl, moduleNameMem, scope, packages, legacyShareScope]);

  if (!ready) {
    return getLoader();
  }

  if (failed) {
    if (onError) {
      onError();
      return null;
    }
    if (ErrorComponent) return <ErrorComponent />;
    return <h2>Failed to load dynamic script: {remoteEntryUrl}</h2>;
  }

  //   if (initialLoadForLazyLoading) {
  //     setTimeout(() => {
  //       callSuccessLogMfeEvent(scope, getMfeName, url);
  //     }, 5000);
  //   }

  return (
    <Suspense fallback={getLoader()}>
      <Component
        {...compProps}
        initialLoadForLazyLoading={initialLoadForLazyLoading}
        startTime={startTime}
        endTime={new Date()}
      />
    </Suspense>
  );
};

DynamicRemoteContainer.propTypes = {
  url: PropTypes.string.isRequired,
  scope: PropTypes.string.isRequired,
  module: PropTypes.string.isRequired,
  mfeName: PropTypes.string.isRequired,
  compProps: PropTypes.object,
  packages: PropTypes.object,
  loader: PropTypes.string,
  onError: PropTypes.func,
  initialLoadForLazyLoading: PropTypes.bool,
  ErrorComponent: PropTypes.element,
};

DynamicRemoteContainer.defaultProps = {
  compProps: {},
  initialLoadForLazyLoading: false,
  loader: '',
  onError: null,
  ErrorComponent: null,
};

export { DynamicRemoteContainer };
export default DynamicRemoteContainer;
