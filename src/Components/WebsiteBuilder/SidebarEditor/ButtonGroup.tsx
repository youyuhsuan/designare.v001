import React from "react";

interface ButtonOption {
  label: string;
  value: string;
}

interface ButtonGroupProps {
  options: ButtonOption[];
  value: string;
  onChange: (value: string) => void;
}

const styles = {
  container: {
    display: "flex",
    gap: "8px",
  },
  button: {
    padding: "8px 16px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.3s, color 0.3s",
  },
  buttonSelected: {
    backgroundColor: "#3b82f6",
    color: "white",
  },
  buttonUnselected: {
    backgroundColor: "#e5e7eb",
    color: "#1f2937",
  },
};

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  options,
  value,
  onChange,
}) => {
  return (
    <div style={styles.container}>
      {options.map((option) => (
        <button
          key={option.value}
          style={{
            ...styles.button,
            ...(value === option.value
              ? styles.buttonSelected
              : styles.buttonUnselected),
          }}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;
