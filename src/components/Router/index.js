import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../Home';
import GuestRoomPage from '../GuestRoomPage';
import HostRoomPage from '../HostRoomPage';
import { AnonymousRoute, ProtectedRoute } from '../Authorization';
import AuthenticatePage from '../AuthenticatePage';

const Router = props => {
  return (
    <BrowserRouter>
      <Switch>
        <AnonymousRoute path="/room/:roomId" component={GuestRoomPage} />
        <ProtectedRoute path="/host" component={HostRoomPage} />
        <Route path="/authenticate">
          <AuthenticatePage />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default Router;
