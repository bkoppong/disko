// import React from 'react';
//
// import { isEmpty } from 'react-redux-firebase';
// import { useSelector } from 'react-redux';
// import {
//   Route,
//   Redirect,
// } from 'react-router-dom';
//
//
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
//
// const ProtectedRoute = ({ children, ...rest }) => {
//   const auth = useSelector(state => state.firebase.auth);
//   const profile = useSelector(state => state.firebase.profile);
//   return (
//     <Route
//       {...rest}
//       render={({ location }) => {
//         if (!isEmpty(auth) && !isEmpty(profile) && profile.status === 'ACTIVE') {
//           return (children);
//         } else if (!isEmpty(auth)) {
//           return (
//             <Redirect
//               to={{
//                 pathname: "/inactive",
//                 state: { from: location }
//               }}
//             />
//           );
//         } else {
//           return (
//             <Redirect
//               to={{
//                 pathname: "/login",
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
//
// // TODO: Add private routing
//
// // const AdminRoute = ({ children, ...rest }) => {
// //   const auth = useSelector(state => state.firebase.auth);
// //   const profile = useSelector(state => state.firebase.profile);
// //   return (
// //     <Route
// //       {...rest}
// //       render={({ location }) => {
// //         if (!isEmpty(auth) && !isEmpty(profile) && profile.role === 'ADMIN') {
// //           return (
// //             children
// //           );
// //         } else if (!isEmpty(auth)) {
// //           return (
// //             <Redirect
// //               to={{
// //                 pathname: "/",
// //                 state: { from: location }
// //               }}
// //             />
// //           );
// //         }
// //         return (
// //           <Redirect
// //             to={{
// //               pathname: "/login",
// //               state: { from: location }
// //             }}
// //           />
// //         );
// //       }
// //       }
// //     />
// //   );
// // };
//
// // const AdminComponent = ({ children, ...rest }) => {
// //   const auth = useSelector(state => state.firebase.auth);
// //   const profile = useSelector(state => state.firebase.profile);
// //   if (!isEmpty(auth) && !isEmpty(profile) && profile.role === 'ADMIN') {
// //     return (
// //       children
// //     );
// //   } else {
// //     return null;
// //   }
// // };
//
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
//
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
//
// export {
//   PublicRoute,
//   ProtectedRoute,
//   AdminRoute,
//   AdminComponent,
//   ProtectedComponent,
//   PublicComponent,
// };
