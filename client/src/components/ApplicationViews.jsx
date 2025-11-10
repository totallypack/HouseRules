import { Route, Routes } from "react-router-dom";
import { AuthorizedRoute } from "./auth/AuthorizedRoute";
import Login from "./auth/Login";
import Register from "./auth/Register";
import Home from "./Home";
import UserProfileList from "./userprofiles/UserProfileList";
import UserProfileDetails from "./userprofiles/UserProfileDetails";
import ChoresList from "./chores/ChoresList";
import ChoreDetails from "./chores/ChoreDetails";
import CreateChore from "./chores/CreateChore";
import MyChores from "./chores/MyChores";

export default function ApplicationViews({ loggedInUser, setLoggedInUser }) {
  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <Home />
            </AuthorizedRoute>
          }
        />
        <Route
          path="login"
          element={<Login setLoggedInUser={setLoggedInUser} />}
        />
        <Route
          path="register"
          element={<Register setLoggedInUser={setLoggedInUser} />}
        />
      </Route>
      <Route path="userprofiles">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
              <UserProfileList />
            </AuthorizedRoute>
          }
        />
        <Route
          path=":id"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
              <UserProfileDetails />
            </AuthorizedRoute>
          }
        />
      </Route>
      <Route path="chores">
        <Route
          index
          element={
            <AuthorizedRoute loggedInUser={loggedInUser}>
              <ChoresList loggedInUser={loggedInUser} />
            </AuthorizedRoute>
          }
        />
        <Route
          path=":id"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
              <ChoreDetails />
            </AuthorizedRoute>
          }
        />
        <Route
          path="create"
          element={
            <AuthorizedRoute loggedInUser={loggedInUser} roles={["Admin"]}>
              <CreateChore />
            </AuthorizedRoute>
          }
        />
      </Route>
      <Route
        path="mychores"
        element={
          <AuthorizedRoute loggedInUser={loggedInUser}>
            <MyChores loggedInUser={loggedInUser} />
          </AuthorizedRoute>
        }
      />
      <Route path="*" element={<p>Whoops, nothing here...</p>} />
    </Routes>
  );
}
