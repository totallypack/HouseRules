import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getChoreById } from "../../managers/choreManager";

export default function ChoreDetails() {
  const { id } = useParams();
  const [chore, setChore] = useState(null);

  useEffect(() => {
    getChoreById(id).then(setChore);
  }, [id]);

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

      <h3>Current Assignees</h3>
      {chore.choreAssignments && chore.choreAssignments.length > 0 ? (
        <ul>
          {chore.choreAssignments.map((assignment) => (
            <li key={assignment.id}>
              {assignment.userProfile.firstName} {assignment.userProfile.lastName}
            </li>
          ))}
        </ul>
      ) : (
        <p>No users assigned</p>
      )}

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
