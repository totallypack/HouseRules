import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChoreById, assignChore, unassignChore } from "../../managers/choreManager";
import { getUserProfiles } from "../../managers/userProfileManager";
import { FormGroup, Input, Label } from "reactstrap";

export default function ChoreDetails() {
  const { id } = useParams();
  const [chore, setChore] = useState(null);
  const [userProfiles, setUserProfiles] = useState([]);

  const loadChore = () => {
    getChoreById(id).then(setChore);
  };

  useEffect(() => {
    loadChore();
    getUserProfiles().then(setUserProfiles);
  }, [id]);

  const isUserAssigned = (userId) => {
    return chore.choreAssignments?.some(
      (assignment) => assignment.userProfileId === userId
    );
  };

  const handleCheckboxChange = (e) => {
    const userId = parseInt(e.target.value);
    const isChecked = e.target.checked;

    if (isChecked) {
      assignChore(id, userId).then(() => {
        loadChore();
      });
    } else {
      unassignChore(id, userId).then(() => {
        loadChore();
      });
    }
  };

  if (!chore) {
    return <div>Loading...</div>;
  }

  const mostRecentCompletion =
    chore.choreCompletions && chore.choreCompletions.length > 0
      ? chore.choreCompletions.sort(
          (a, b) => new Date(b.completedOn) - new Date(a.completedOn)
        )[0]
      : null;

  return (
    <div className="container">
      <h2>Chore Details</h2>
      <div>
        <p>
          <strong>Name:</strong> {chore.name}
        </p>
        <p>
          <strong>Difficulty:</strong> {chore.difficulty}
        </p>
        <p>
          <strong>Frequency (Days):</strong> {chore.choreFrequencyDays}
        </p>
      </div>

      <h3>Assign Users</h3>
      {userProfiles.map((user) => (
        <FormGroup check key={user.id}>
          <Input
            type="checkbox"
            value={user.id}
            checked={isUserAssigned(user.id)}
            onChange={handleCheckboxChange}
          />
          <Label check>
            {user.firstName} {user.lastName}
          </Label>
        </FormGroup>
      ))}

      <h3>Most Recent Completion</h3>
      {mostRecentCompletion ? (
        <p>
          Completed on: {new Date(mostRecentCompletion.completedOn).toLocaleDateString()}
        </p>
      ) : (
        <p>No completions yet</p>
      )}
    </div>
  );
}
