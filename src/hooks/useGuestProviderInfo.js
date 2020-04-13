import { useState, useEffect } from 'react';

import { useSelector } from 'react-redux';

import { isLoaded, isEmpty, useFirestoreConnect } from 'react-redux-firebase';

import { GUEST_PROVIDERS_REFERENCE } from '../constants';

const useGuestProviderInfo = () => {
  const firestoreGuestProvidersQuery = {
    collection: `providers`,
    storeAs: GUEST_PROVIDERS_REFERENCE,
  };
  useFirestoreConnect([firestoreGuestProvidersQuery]);
  const [guestProviderInfo, setGuestProviderInfo] = useState({});
  const guestProviderInfoSelector = useSelector(
    (state) => state.firestore.ordered[GUEST_PROVIDERS_REFERENCE],
  );
  useEffect(() => {
    if (
      isLoaded(guestProviderInfoSelector) &&
      !isEmpty(guestProviderInfoSelector)
    ) {
      const spotifyGuestInfo = guestProviderInfoSelector.find(
        (provider) => provider.name === 'spotify',
      );
      setGuestProviderInfo(spotifyGuestInfo);
    }
  }, [guestProviderInfoSelector]);
  return guestProviderInfo;
};

export default useGuestProviderInfo;
