import React from "react";

const CustomInput = (props) => {
  const { type, label, i_id, i_class, name, val, onChng, onBlr } = props;
  const isColor = type === "color";
  const inputId = i_id || name || label.replace(/\s+/g, '-').toLowerCase();

  if (isColor) {
    return (
      <div className="d-flex flex-column gap-2 mt-3">
        <label htmlFor={inputId} className="form-label mb-0" style={{ color: "var(--text-subtitle)" }}>
          {label}
        </label>
        <input
          type="color"
          className={`form-control form-control-color ${i_class || ""}`}
          id={inputId}
          name={name}
          value={val}
          onChange={onChng}
          onBlur={onBlr}
          style={{ height: "45px", width: "120px", padding: "4px", cursor: "pointer", border: "1px solid var(--border-color)", borderRadius: "6px" }}
        />
      </div>
    );
  }

  return (
    <div className="form-floating mt-3">
      <input
        type={type}
        className={`form-control ${i_class || ""}`}
        id={inputId}
        placeholder=" "
        name={name}
        value={val}
        onChange={onChng}
        onBlur={onBlr}
      />
      <label htmlFor={inputId}>{label}</label>
    </div>
  );
};

export default CustomInput;
