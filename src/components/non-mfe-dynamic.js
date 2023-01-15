export const fetchRemote = (url, remoteName) =>
  new Promise((resolve, reject) => {
    // We define a script tag to use the browser for fetching the remoteEntry.js file
    const script = document.createElement('script');
    script.src = url;
    script.onerror = (err) => {
      reject(new Error(`Failed to fetch remote: ${remoteName}`));
    };
    // When the script is loaded we need to resolve the promise back to Module Federation
    script.onload = () => {
      // The script is now loaded on window using the name defined within the remote
      const proxy = {
        get: (request) => window[remoteName].get(request),
        init: (arg) => {
          try {
            return window[remoteName].init(arg);
          } catch (e) {
            console.error(`Failed to initialize remote: ${remoteName}`);
            reject(e);
          }
        },
      };
      resolve(proxy);
    };
    // Lastly we inject the script tag into the document's head to trigger the script load
    document.head.appendChild(script);
  });

export const loadComponent =
  (remoteName, remoteUrl, moduleName, scope = 'default') =>
  async () => {
    // Check if this remote has already been loaded
    if (!(remoteName in window)) {
      // Initializes the shared scope. Fills it with known provided modules from this build and all remotes
      await __webpack_init_sharing__(scope);
      // Fetch the remote app. We assume our remote app is exposing a `remoteEntry.js` file.
      const fetchedContainer = await fetchRemote(`${remoteUrl}`, remoteName);
      // Initialize the remote app
      await fetchedContainer.init(__webpack_share_scopes__[scope]);
    }
    // 'container' is the remote app
    const container = window[remoteName];
    // The module pass to get() must match the "exposes" item in our remote app exactly
    const factory = await container.get(`./${moduleName}`);
    // 'Module' is the React Component from our remote app's "exposes" configuration
    const Module = factory();
    return Module;
  };
const RemoteComponent = ({
  url,
  module,
  remote,
  scope = 'default',
  fallback = null,
  // Any props needed by the Remote app can be passed through
  ...props
}) => {
  // Custom hook for getting the URL for a particular remote
  const remoteUrl = url;
  // Lazy loading the remote component
  const Component = React.lazy(loadComponent(remote, remoteUrl, module, scope));
  // Wrapping the remote component in an ErrorBoundary and React.Suspense to safely render the component
  return (
    <ErrorBoundary>
      <React.Suspense fallback={fallback}>
        <Component {...props} />
      </React.Suspense>
    </ErrorBoundary>
  );
};
