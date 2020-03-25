import React from 'react';

import {
  Switch,
  Route,
  Link,
  useRouteMatch,
} from 'react-router-dom';

import {
  Row,
  Col,
  Button,
} from 'antd';

import AuthenticateSpotify from './AuthenticateSpotify';

const AuthenticatePage = props => {

  let match = useRouteMatch();

  return (
    <Switch>
      <Route path={`${match.url}/spotify`}>
        <AuthenticateSpotify />
      </Route>
      <Route path={`${match.url}/applemusic`}>
        <div>apple music</div>
      </Route>
      <Route path={'/'}>
        <Row
          type="flex"
          align="middle"
        >
          <Col>
            <Row>
              <Link to={`${match.url}/spotify`}>
                <Button
                  block
                  style={{
                    marginBottom: '40px',
                  }}
                >
                  Login With Spotify
                </Button>
              </Link>
            </Row>
            <Row>
              <Link to={`${match.url}/applemusic`}>
                <Button
                  block
                  style={{
                    marginBottom: '40px',
                  }}
                >
                  Login With Apple Music
                </Button>
              </Link>
            </Row>

          </Col>
        </Row>
      </Route>
    </Switch>
  );
};

export default AuthenticatePage;
