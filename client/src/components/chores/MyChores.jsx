import { useEffect, useState } from "react";
import { getChores, completeChore } from "../../managers/choreManager";
import { Table, Button } from "reactstrap";

export default function MyChores({ loggedInUser }) {
  const [myChores, setMyChores] = useState([]);

  const loadMyChores = () => {
    getChores().then((allChores) => {
      const overdueAssignedChores = allChores.filter(
        (chore) =>
          chore.isOverdue &&
          chore.choreAssignments?.some(
            (assignment) => assignment.userProfileId === loggedInUser.id
          )
      );
      setMyChores(overdueAssignedChores);
    });
  };

  useEffect(() => {
    loadMyChores();
  }, []);

  const handleComplete = (choreId) => {
    completeChore(choreId, loggedInUser.id).then(() => {
      loadMyChores();
    });
  };

  return (
    <div className="container">
      <h2>My Chores</h2>
      {myChores.length === 0 ? (
        <p>You have no overdue chores. Great job!</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Difficulty</th>
              <th>Frequency (Days)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myChores.map((chore) => (
              <tr key={chore.id}>
                <td>{chore.name}</td>
                <td>{chore.difficulty}</td>
                <td>{chore.choreFrequencyDays}</td>
                <td>
                  <Button
                    color="success"
                    size="sm"
                    onClick={() => handleComplete(chore.id)}
                  >
                    Complete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
