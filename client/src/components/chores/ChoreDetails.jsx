import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChoreById, assignChore, unassignChore, updateChore } from "../../managers/choreManager";
import { getUserProfiles } from "../../managers/userProfileManager";
import { FormGroup, Input, Label, Form, Button } from "reactstrap";

export default function ChoreDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chore, setChore] = useState(null);
  const [userProfiles, setUserProfiles] = useState([]);
  const [editedChore, setEditedChore] = useState({
    name: "",
    difficulty: 1,
    choreFrequencyDays: 1,
  });

  const loadChore = () => {
    getChoreById(id).then((choreData) => {
      setChore(choreData);
      setEditedChore({
        name: choreData.name,
        difficulty: choreData.difficulty,
        choreFrequencyDays: choreData.choreFrequencyDays,
      });
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();
    updateChore(id, editedChore).then(() => {
      navigate("/chores");
    });
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
      <h2>Update Chore</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={editedChore.name}
            onChange={(e) =>
              setEditedChore({ ...editedChore, name: e.target.value })
            }
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="difficulty">Difficulty (1-5)</Label>
          <Input
            type="number"
            id="difficulty"
            min="1"
            max="5"
            value={editedChore.difficulty}
            onChange={(e) =>
              setEditedChore({
                ...editedChore,
                difficulty: parseInt(e.target.value),
              })
            }
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="frequency">Frequency (Days)</Label>
          <Input
            type="number"
            id="frequency"
            min="1"
            max="14"
            value={editedChore.choreFrequencyDays}
            onChange={(e) =>
              setEditedChore({
                ...editedChore,
                choreFrequencyDays: parseInt(e.target.value),
              })
            }
            required
          />
        </FormGroup>
        <Button color="primary" type="submit">
          Update Chore
        </Button>
        <Button
          color="secondary"
          className="ms-2"
          onClick={() => navigate("/chores")}
        >
          Cancel
        </Button>
      </Form>

      <h3 className="mt-4">Assign Users</h3>
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

      <h3 className="mt-4">Most Recent Completion</h3>
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
