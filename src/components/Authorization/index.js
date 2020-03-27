import React from 'react';

import { isLoaded, isEmpty, useFirebase } from 'react-redux-firebase';

import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

import LoadingPage from '../LoadingPage';

// const PublicRoute = ({ children, ...rest }) => {
//   const auth = useSelector(state => state.firebase.auth);
//   return (
//     <Route
//       {...rest}
//       render={({ location }) => {
//         if (isEmpty(auth)) {
//           return (children);
//         } else {
//           return (
//             <Redirect
//               to={{
//                 pathname: "/",
//                 state: { from: location }
//               }}
//             />
//           );
//         }
//       }
//       }
//     />
//   );
// };

const AnonymousRoute = ({ children, ...rest }) => {
  const firebase = useFirebase();

  const auth = useSelector(state => state.firebase.auth);

  if (!isLoaded(auth)) {
    return <LoadingPage />;
  }

  if (isEmpty(auth)) {
    try {
      firebase.auth().signInAnonymously();
    } catch (error) {
      console.error(error);
    }

    return <LoadingPage />;
  }

  return (
    <Route
      {...rest}
      render={props => {
        const childrenWithProps = React.Children.map(children, child =>
          React.cloneElement(child, { auth: auth }),
        );
        return childrenWithProps;
      }}
    />
  );
};

const ProtectedRoute = ({ children, ...rest }) => {
  const auth = useSelector(state => state.firebase.auth);
  const profile = useSelector(state => state.firebase.profile);

  if (!isLoaded(auth) || !isLoaded(profile)) {
    return <LoadingPage />;
  }

  return (
    <Route
      {...rest}
      render={({ location, ...rest }) => {
        if (isEmpty(auth) || isEmpty(profile)) {
          return (
            <Redirect
              to={{
                pathname: '/authenticate',
                state: { from: rest.location },
              }}
            />
          );
        }
        const childrenWithProps = React.Children.map(children, child =>
          React.cloneElement(child, { auth: auth, profile: profile }),
        );
        return childrenWithProps;
      }}
    />
  );
};

// TODO: Add private routing

// const AdminRoute = ({ children, ...rest }) => {
//   const auth = useSelector(state => state.firebase.auth);
//   const profile = useSelector(state => state.firebase.profile);
//   return (
//     <Route
//       {...rest}
//       render={({ location }) => {
//         if (!isEmpty(auth) && !isEmpty(profile) && profile.role === 'ADMIN') {
//           return (
//             children
//           );
//         } else if (!isEmpty(auth)) {
//           return (
//             <Redirect
//               to={{
//                 pathname: "/",
//                 state: { from: location }
//               }}
//             />
//           );
//         }
//         return (
//           <Redirect
//             to={{
//               pathname: "/login",
//               state: { from: location }
//             }}
//           />
//         );
//       }
//       }
//     />
//   );
// };

// const AdminComponent = ({ children, ...rest }) => {
//   const auth = useSelector(state => state.firebase.auth);
//   const profile = useSelector(state => state.firebase.profile);
//   if (!isEmpty(auth) && !isEmpty(profile) && profile.role === 'ADMIN') {
//     return (
//       children
//     );
//   } else {
//     return null;
//   }
// };

// const ProtectedComponent = ({ children, ...rest }) => {
//   const auth = useSelector(state => state.firebase.auth);
//   const profile = useSelector(state => state.firebase.profile);
//   if (!isEmpty(auth) && !isEmpty(profile) && profile.status === 'ACTIVE') {
//     return (
//       children
//     );
//   } else {
//     return null;
//   }
// };

// const PublicComponent = ({ children, ...rest }) => {
//   const auth = useSelector(state => state.firebase.auth);
//   if (isEmpty(auth)) {
//     return (
//       children
//     );
//   } else {
//     return null;
//   }
// };

export {
  // PublicRoute,
  AnonymousRoute,
  ProtectedRoute,
  // AdminRoute,
  // AdminComponent,
  // ProtectedComponent,
  // PublicComponent,
};
