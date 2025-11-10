import { useEffect, useState } from "react";
import { getChores, deleteChore, completeChore } from "../../managers/choreManager";
import { Link } from "react-router-dom";
import { Table, Button } from "reactstrap";

export default function ChoresList({ loggedInUser }) {
  const [chores, setChores] = useState([]);

  const getAllChores = () => {
    getChores().then(setChores);
  };

  useEffect(() => {
    getAllChores();
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this chore?")) {
      deleteChore(id).then(() => {
        getAllChores();
      });
    }
  };

  const handleComplete = (choreId) => {
    completeChore(choreId, loggedInUser.id).then(() => {
      getAllChores();
    });
  };

  const isAdmin = loggedInUser?.roles?.includes("Admin");

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Chores</h2>
        {isAdmin && (
          <Link to="/chores/create">
            <Button color="primary">Create New Chore</Button>
          </Link>
        )}
      </div>
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
          {chores.map((chore) => (
            <tr key={chore.id}>
              <td style={{ color: chore.isOverdue ? "red" : "inherit" }}>
                {chore.name}
              </td>
              <td>{chore.difficulty}</td>
              <td>{chore.choreFrequencyDays}</td>
              <td>
                <Button
                  color="success"
                  size="sm"
                  onClick={() => handleComplete(chore.id)}
                  className="me-2"
                >
                  Complete
                </Button>
                {isAdmin && (
                  <>
                    <Link to={`/chores/${chore.id}`} className="me-2">
                      Details
                    </Link>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={() => handleDelete(chore.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}
