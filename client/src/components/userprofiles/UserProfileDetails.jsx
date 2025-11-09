import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserProfileById } from "../../managers/userProfileManager";

export default function UserProfileDetails() {
  const { id } = useParams();
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    getUserProfileById(id).then(setUserProfile);
  }, [id]);

  if (!userProfile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2>User Profile Details</h2>
      <div>
        <p>
          <strong>Name:</strong> {userProfile.firstName} {userProfile.lastName}
        </p>
        <p>
          <strong>Email:</strong> {userProfile.email}
        </p>
        <p>
          <strong>Username:</strong> {userProfile.userName}
        </p>
        <p>
          <strong>Address:</strong> {userProfile.address}
        </p>
      </div>

      <h3>Assigned Chores</h3>
      {userProfile.choreAssignments && userProfile.choreAssignments.length > 0 ? (
        <ul>
          {userProfile.choreAssignments.map((assignment) => (
            <li key={assignment.id}>{assignment.chore.name}</li>
          ))}
        </ul>
      ) : (
        <p>No chores assigned</p>
      )}

      <h3>Completed Chores</h3>
      {userProfile.choreCompletions && userProfile.choreCompletions.length > 0 ? (
        <ul>
          {userProfile.choreCompletions.map((completion) => (
            <li key={completion.id}>
              {completion.chore.name} - Completed on:{" "}
              {new Date(completion.completedOn).toLocaleDateString()}
            </li>
          ))}
        </ul>
      ) : (
        <p>No chores completed</p>
      )}
    </div>
  );
}
