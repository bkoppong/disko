'use strict'

const { admin } = require('./resources')

const asyncGenerateNewRoom = async (data, context) => {
  try {
    if (
      !(
        context.auth.uid.startsWith('spotify:') ||
        context.auth.uid.startsWith('applemusic:')
      )
    ) {
      throw new Error('You are not authorized to create a new room!')
    }

    const { uid } = context.auth

    const hostRef = admin
      .firestore()
      .collection('hosts')
      .doc(uid)

    const roomsRef = admin.firestore().collection('rooms')

    let possibleId

    while (true) {
      possibleId = Math.floor(1000 + (9999 - 1000) * Math.random()).toString()
      console.log(possibleId)

      const roomSnap = await roomsRef.doc(possibleId).get() // eslint-disable-line no-await-in-loop

      if (!roomSnap.exists) {
        break
      }
    }

    let hostSnap = await hostRef.get()

    if (!hostSnap.exists) {
      throw new Error('You are not authorized to create a new room!')
    }

    let hostData = hostSnap.data()

    let roomCreationTask = roomsRef.doc(possibleId).set({
      hostUid: uid,
      guestUids: []
    })

    let hostUpdateTask = hostRef.update({
      currentRoomId: possibleId
    })

    await Promise.all([roomCreationTask, hostUpdateTask])

    return {
      message: 'Successful room creation'
    }
  } catch (error) {
    console.error(error)
    return {
      error
    }
  }
}

module.exports = {
  asyncGenerateNewRoom
}
