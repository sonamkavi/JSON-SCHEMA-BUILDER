import Field from "./Field";
import "./SchemaBuilder.css";

export default function SchemaBuilder({ schema, setSchema }) {
  const updateField = (id, updatedField) => {
    const recursiveUpdate = (fields) =>
      fields.map((f) => {
        if (f.id === id) return { ...f, ...updatedField };
        if (f.type === "nested" && f.fields.length)
          return { ...f, fields: recursiveUpdate(f.fields) };
        return f;
      });

    setSchema((prev) => recursiveUpdate(prev));
  };

  const addField = (parentId) => {
    const newField = {
      id: Date.now() + Math.random(),
      name: "",
      type: "string",
      required: false,
      fields: [],
    };

    if (!parentId) {
      setSchema((prev) => [...prev, newField]);
      return;
    }

    const recursiveAdd = (fields) =>
      fields.map((f) => {
        if (f.id === parentId) {
          if (f.type === "nested") {
            return { ...f, fields: [...f.fields, newField] };
          }
          return f;
        }
        if (f.type === "nested" && f.fields.length) {
          return { ...f, fields: recursiveAdd(f.fields) };
        }
        return f;
      });

    setSchema((prev) => recursiveAdd(prev));
  };

  const deleteField = (id) => {
    const recursiveDelete = (fields) =>
      fields
        .filter((f) => f.id !== id)
        .map((f) =>
          f.type === "nested"
            ? { ...f, fields: recursiveDelete(f.fields) }
            : f
        );

    setSchema((prev) => recursiveDelete(prev));
  };

  return (
    <div className="schema-builder">
      {schema.map((field) => (
        <Field
          key={field.id}
          field={field}
          updateField={updateField}
          addField={addField}
          deleteField={deleteField}
          level={0}
          parentId={null}
        />
      ))}
    </div>
  );
}
