import React from 'react';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Home from '../Home';
import GuestRoomPage from '../GuestRoomPage';
import HostRoomPage from '../HostRoomPage';
import { ProtectedRoute } from '../Authorization';
import AuthenticatePage from '../AuthenticatePage';

const Router = props => {
  return (
    <BrowserRouter>
      <Switch>
        <ProtectedRoute path="/room/:roomId">
          <GuestRoomPage />
        </ProtectedRoute>
        <Route path="/host">
          <HostRoomPage />
        </Route>
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
