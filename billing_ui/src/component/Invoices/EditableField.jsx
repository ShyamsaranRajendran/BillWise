import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

const EditableField = ({ cellData, onItemizedItemEdit }) => {
  console.log(cellData);

  return (
    <InputGroup className="input-group-custom">
      {cellData.leading != null && (
        <InputGroup.Text className="input-group-text-custom">
          <span className="input-group-icon">{cellData.leading}</span>
        </InputGroup.Text>
      )}
      <Form.Control
        className={
          cellData.textAlign === "text-end"
            ? "input-control-end"
            : "input-control"
        }
        type={cellData.type}
        placeholder={cellData.placeholder}
        min={cellData.min}
        name={cellData.name}
        id={cellData.id}
        value={cellData.value}
        step={cellData.step}
        precision={cellData.precision}
        aria-label={cellData.name}
        onChange={onItemizedItemEdit}
        required
      />
    </InputGroup>
  );
};

export default EditableField;
