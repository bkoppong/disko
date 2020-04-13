import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { isLoaded, isEmpty, useFirestoreConnect } from 'react-redux-firebase';

import { HOST_PROVIDERS_REFERENCE } from '../constants';

const useHostProviderInfo = () => {
  const auth = useSelector((state) => state.firebase.auth);

  const [hostProviderInfo, setHostProviderInfo] = useState({});

  const firestoreHostProvidersQuery = {
    collection: `hosts/${auth.uid}/providers`,
    storeAs: HOST_PROVIDERS_REFERENCE,
  };
  useFirestoreConnect([firestoreHostProvidersQuery]);
  const hostProviderInfoSelector = useSelector(
    (state) => state.firestore.ordered[HOST_PROVIDERS_REFERENCE],
  );
  useEffect(() => {
    if (
      isLoaded(hostProviderInfoSelector) &&
      !isEmpty(hostProviderInfoSelector)
    ) {
      const spotifyHostInfo = hostProviderInfoSelector.find(
        (provider) => provider.name === 'spotify',
      );
      setHostProviderInfo(spotifyHostInfo);
    }
  }, [hostProviderInfoSelector]);
  return hostProviderInfo;
};

export default useHostProviderInfo;
