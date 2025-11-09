import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createChore } from "../../managers/choreManager";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";

export default function CreateChore() {
  const navigate = useNavigate();
  const [chore, setChore] = useState({
    name: "",
    difficulty: 1,
    choreFrequencyDays: 1,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createChore(chore).then(() => {
      navigate("/chores");
    });
  };

  return (
    <div className="container">
      <h2>Create New Chore</h2>
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="name">Name</Label>
          <Input
            type="text"
            id="name"
            value={chore.name}
            onChange={(e) => setChore({ ...chore, name: e.target.value })}
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
            value={chore.difficulty}
            onChange={(e) =>
              setChore({ ...chore, difficulty: parseInt(e.target.value) })
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
            value={chore.choreFrequencyDays}
            onChange={(e) =>
              setChore({ ...chore, choreFrequencyDays: parseInt(e.target.value) })
            }
            required
          />
        </FormGroup>
        <Button color="primary" type="submit">
          Create Chore
        </Button>
        <Button
          color="secondary"
          className="ms-2"
          onClick={() => navigate("/chores")}
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
}
