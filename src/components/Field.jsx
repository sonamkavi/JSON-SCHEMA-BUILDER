import { Button, Input, Select, Space, Switch } from "antd";
import "./Field.css";

const { Option } = Select;

export default function Field({
  field,
  updateField,
  addField,
  deleteField,
  level,
}) {
  const handleNameChange = (e) =>
    updateField(field.id, { name: e.target.value });

  const handleTypeChange = (value) => {
    if (value !== "nested") {
      updateField(field.id, { type: value, fields: [] });
    } else {
      updateField(field.id, { type: value });
    }
  };

  const handleRequiredChange = (checked) =>
    updateField(field.id, { required: checked });

  return (
    <div
      className="field-container"
      style={{ marginLeft: level * 20 }} 
    >
      
      <Space align="center" className="field-space">
        <Input
          placeholder="Field Name"
          value={field.name}
          onChange={handleNameChange}
          className="field-name-input"
        />

        <Select
          placeholder="Field Type"
          value={field.type || undefined}
          onChange={handleTypeChange}
          className="field-type-select"
          options={[
            { label: "string", value: "string" },
            { label: "number", value: "number" },
            { label: "nested", value: "nested" },
          ]}
        />

        <Switch
          checked={field.required}
          onChange={handleRequiredChange}
          title="Required"
        />

        <Button
          size="small"
          onClick={() => deleteField(field.id)}
          className="delete-button"
        >
          <span className="delete-button-icon">×</span>
        </Button>
      </Space>

      
      {field.type === "nested" &&
        field.fields.map((nestedField) => (
          <Field
            key={nestedField.id}
            field={nestedField}
            updateField={updateField}
            addField={addField}
            deleteField={deleteField}
            level={level + 1}
          />
        ))}

     
      <Button
        onClick={() => addField(field.id)}
        className="add-nested-button"
      >
        + Add Item
      </Button>
    </div>
  );
}
