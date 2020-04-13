import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { AnonymousRoute, ProtectedRoute } from '../Authorization';
import LoadingPage from '../LoadingPage';

const Home = lazy(() => import('../Home'));
const GuestRoomPage = lazy(() => import('../GuestRoomPage'));
const HostRoomPage = lazy(() => import('../HostRoomPage'));
const AuthenticatePage = lazy(() => import('../AuthenticatePage'));

const Router = (props) => {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
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
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
