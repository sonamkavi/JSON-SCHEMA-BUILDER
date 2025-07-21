import { Button } from "antd";
import "antd/dist/reset.css";
import { useState } from "react";
import "./App.css"; // ✅ import CSS
import SchemaBuilder from "./components/SchemaBuilder";

export default function App() {
  const [schema, setSchema] = useState([
    {
      id: Date.now(),
      name: "",
      type: "",
      required: false,
      fields: [],
    },
  ]);

  const hasAnyName = (fields) => {
    for (const f of fields) {
      if (f.name.trim() !== "") return true;
      if (f.type === "nested" && hasAnyName(f.fields)) return true;
    }
    return false;
  };

  const showPreview = hasAnyName(schema);

  function schemaToObject(fields) {
    const obj = {};
    fields.forEach((f) => {
      if (f.name.trim() === "") return;
      if (f.type === "nested") {
        obj[f.name] = schemaToObject(f.fields);
      } else {
        obj[f.name] = f.type;
      }
    });
    return obj;
  }

  const handleSubmit = () => {
    alert("Submitting schema:\n" + JSON.stringify(schemaToObject(schema), null, 2));
  };

  return (
    <div className="app-container">
      <h1>JSON Schema Builder</h1>
      <div className="schema-wrapper">
        {/* Left side - form */}
        <div className="schema-left">
          <SchemaBuilder schema={schema} setSchema={setSchema} />

          {/* + Add Item button at bottom */}
          <Button
            type="primary"
            className="add-button"
            onClick={() =>
              setSchema((prev) => [
                ...prev,
                {
                  id: Date.now() + Math.random(),
                  name: "",
                  type: "string",
                  required: false,
                  fields: [],
                },
              ])
            }
          >
            + Add Item
          </Button>

         
          <Button type="primary" onClick={handleSubmit} className="submit-button">
            Submit
          </Button>
        </div>

       
<div className={`schema-preview ${showPreview ? "has-content" : ""}`}>
  {showPreview ? (
    <pre>{JSON.stringify(schemaToObject(schema), null, 2)}</pre>
  ) : (
    <p className="schema-preview-empty">Start typing field names to see JSON</p>
  )}
</div>



      </div>
    </div>
  );
}
