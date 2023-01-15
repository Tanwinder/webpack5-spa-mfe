import { DynamicRemoteContainer } from '../components/mrv-mfe-utils/dynamicContainer';
import { getItemKeywordSearchMFEUrl, flippedMfeUrl } from './urls';

export const IKSMFEInitialLoad = () => (
  <DynamicRemoteContainer
    url={getItemKeywordSearchMFEUrl()}
    scope="ItemKeywordSearch"
    module="ItemSearchUIWithStore"
    loader="Please wait while Loading... "
    initialLoadForLazyLoading
    mfeName="item-lookup"
  />
);

export const LazyLoadIKS = (props) => {
  return (
    <DynamicRemoteContainer
      url={getItemKeywordSearchMFEUrl()}
      scope="ItemKeywordSearch"
      module="ItemSearchUIWithStore"
      loader="Please wait while Loading... "
      // ErrorComponent={() => (
      //   // <MfeErrorBoundary
      //   //   handleBackClick={props.onBackButtonClick}
      //   //   errorMsg={IKS_MFE_DOWN_ERROR}
      //   // />
      // )}
      compProps={{ featureConf: {}, ...props }}
    />
  );
};

export const FlippedMfe = (props) => {
  return (
    <DynamicRemoteContainer
      url={flippedMfeUrl()}
      scope="flipMfe"
      module="App"
      loader="Please wait while Loading... "
      // ErrorComponent={() => (
      //   // <MfeErrorBoundary
      //   //   handleBackClick={props.onBackButtonClick}
      //   //   errorMsg={IKS_MFE_DOWN_ERROR}
      //   // />
      // )}
      compProps={{ featureConf: {}, ...props }}
    />
  );
};
