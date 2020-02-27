import React from 'react'

import { useSelector } from 'react-redux';

import {
  useFirebase,
  isLoaded,
  isEmpty,
} from 'react-redux-firebase';

import Todos from '../Todos'
import NewTodo from '../NewTodo'

import {
  Layout,
  Row,
  Col,
  Typography,
} from 'antd';

import backgroundImage from './yosemite.jpg';

const { Header, Content } = Layout;
const { Title } = Typography;


function Home() {

  const firebase = useFirebase();

  firebase.auth().signInAnonymously().then(signInResult => {
    // do stuff with signInResult.user
  }).catch(function(error) {
    // Handle Errors here.
    let errorCode = error.code;
    let errorMessage = error.message;
    console.log(errorMessage)
    // ...
  });

  const auth = useSelector(state => state.firebase.auth);

  if (!isLoaded(auth)) {
    return <div>hi</div>;
  }

  return (
    <Layout style={{
        minHeight: '100vh',
        maxHeight: '100vh',
        overflow: 'scroll',
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}>
      <Header style={{
          position: 'fixed',
          width: '100%',
          zIndex: '1',
          backgroundColor: '#191414',
          height: '80px',
          lineHeight: '80px',
        }}>
        <NewTodo />
      </Header>
      <Content style={{
          paddingTop: '100px',
          paddingBottom: '80px',
        }}>
            <Row
              type="flex"
              justify="center"
            >
              <Col>
                <Title
                  style={{
                    textShadow: '0px 2px 7px #555',
                  }}
                >
                  Queueify
                </Title>
              </Col>
            </Row>
            <Row
              type="flex"
              justify="center"
            >
              <Col
                xs={20}
                md={12}
                lg={6}
                style={{
                  marginBottom: '80px',
                }}
              >
                <Todos />
              </Col>
            </Row>
      </Content>
    </Layout>
  )
}

export default Home
