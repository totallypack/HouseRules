import { useEffect, useState } from "react";
import { getUserProfiles } from "../../managers/userProfileManager";
import { Link } from "react-router-dom";
import { Table } from "reactstrap";

export default function UserProfileList() {
  const [userProfiles, setUserProfiles] = useState([]);

  useEffect(() => {
    getUserProfiles().then(setUserProfiles);
  }, []);

  return (
    <div className="container">
      <h2>User Profiles</h2>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {userProfiles.map((userProfile) => (
            <tr key={userProfile.id}>
              <td>
                {userProfile.firstName} {userProfile.lastName}
              </td>
              <td>{userProfile.email}</td>
              <td>{userProfile.address}</td>
              <td>
                <Link to={`/userprofiles/${userProfile.id}`}>Details</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
