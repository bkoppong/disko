import React from 'react';

import { useSelector } from 'react-redux';

import { useFirestore } from 'react-redux-firebase';

import { Trash } from 'react-feather';

import { Button } from 'antd';

const HostActionComponents = () => {
  const auth = useSelector((state) => state.firebase.auth);
  const profile = useSelector((state) => state.firebase.profile);
  const firestore = useFirestore();
  const roomId = useSelector((state) => state.room.id);

  if (profile.currentRoomId !== roomId) {
    return null;
  }

  const handleCloseRoom = async () => {
    await firestore.collection('rooms').doc(profile.currentRoomId).delete();
    await firestore.collection('hosts').doc(auth.uid).update({
      currentRoomId: firestore.FieldValue.delete(),
    });
  };

  return (
    <Button type="link" onClick={handleCloseRoom}>
      <Trash />
    </Button>
  );
};

export default HostActionComponents;
