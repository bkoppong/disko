import React, { useState } from 'react'
import { useFirestore } from 'react-redux-firebase'

import {
  Input,
  Row,
  Col,
  Button,
} from 'antd';

function capital_letter(str)
{
    str = str.split(" ");

    for (var i = 0, x = str.length; i < x; i++) {
        str[i] = str[i][0].toUpperCase() + str[i].substr(1);
    }

    return str.join(" ");
}

function NewTodo() {
  const [inputVal, changeInput] = useState('')
  const firestore = useFirestore()

  function resetInput() {
    changeInput('')
  }
  function onInputChange(e) {
    return changeInput(e && e.target && e.target.value)
  }

  function addTodo() {
    if (!inputVal) {
      return;
    }
    let cleanedInputVal = capital_letter(inputVal);
    firestore
      .collection('requests')
      .add({
        songName: cleanedInputVal,
        upvotes: [],
        upvotesCount: 0,
        creationTimestamp: firestore.FieldValue.serverTimestamp(),
      });
    resetInput();
  }

  return (
    <Row
      gutter={17}
      type="flex"
      justify="space-between"

    >
      <Col span={22}>
        <Input
          value={inputVal}
          onChange={onInputChange}
          placeholder="Queue a song..."
          size="large"
          onPressEnter={addTodo}
        />
      </Col>
      <Col span={2}>
        <Button
          onClick={addTodo}
          type="primary"
          shape="circle"
          icon="plus"
          size="large"
        />
      </Col>
    </Row>
  )
}

export default NewTodo
