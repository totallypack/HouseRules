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
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    createChore(chore).then((res) => {
      if (res.errors) {
        setErrors(res.errors);
      } else {
        navigate("/chores");
      }
    });
  };

  return (
    <div className="container">
      <h2>Create New Chore</h2>
      {Object.keys(errors).length > 0 && (
        <div style={{ color: "red" }}>
          {Object.keys(errors).map((key) => (
            <p key={key}>
              {key}: {errors[key].join(",")}
            </p>
          ))}
        </div>
      )}
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
            max="14"
            list="frequency-suggestions"
            value={chore.choreFrequencyDays}
            onChange={(e) =>
              setChore({ ...chore, choreFrequencyDays: parseInt(e.target.value) })
            }
            required
          />
          <datalist id="frequency-suggestions">
            <option value="1" />
            <option value="3" />
            <option value="7" />
            <option value="10" />
            <option value="14" />
          </datalist>
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
