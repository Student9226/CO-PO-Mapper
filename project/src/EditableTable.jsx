import PropTypes from 'prop-types';
import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import deleteIcon from '../assets/delete_row.png';

export const EditableTable = ({ onSubmit }) => {
  const [rows, setRows] = useState([{ course: "", outcome: "" }]);

  const handleAddRow = () => {
    setRows([...rows, { course: "", outcome: "" }]);
  };

  const handleRowChange = (index, field, value) => {
    const newRows = rows.slice();
    newRows[index][field] = value;
    setRows(newRows);
  };

  const handleDeleteRow = (index) => {
    if (rows.length > 1) {
      const newRows = rows.filter((_, i) => i !== index);
      setRows(newRows);
    } else {
      alert("Your table must have at least one row.");
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const updatedRows = Array.from(rows);
    const [movedRow] = updatedRows.splice(source.index, 1);
    updatedRows.splice(destination.index, 0, movedRow);

    setRows(updatedRows);
  };

  const handleSubmit = () => {
    onSubmit(rows);
  };

  const handleExample = () => {
    const exampleCO = [
      "Understand the principles and concepts of computer forensics",
      "Analyze digital evidence from various sources",
      "Apply forensic tools to identify and collect evidence",
      "Communicate findings effectively in a report",
      "Evaluate the ethical implications of digital forensics"
    ];
  
    const examplePO = [
      "Students develop the ability to solve problems using a computer and develop computer-based solutions for real-world problems",
      "Students demonstrate critical thinking and problem-solving skills",
      "Students learn to utilize various software tools for data analysis",
      "Students enhance their written communication skills through report writing",
      "Students understand the legal and ethical responsibilities in digital forensics"
    ];
  
    const newRows = exampleCO.map((co, index) => ({
      course: co,
      outcome: examplePO[index] || "" // Use empty string if no corresponding PO exists
    }));
  
    setRows([...newRows]); // Replace existing rows with new rows
  };

  return (
    <div>
      <button onClick={handleExample}>Try an Example</button>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <table
              className="editable-table"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              <thead>
                <tr>
                  <th>CO</th>
                  <th>PO</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <Draggable key={index} draggableId={`draggable-${index}`} index={index}>
                    {(provided) => (
                      <tr
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <td>
                          <input
                            type="text"
                            value={row.course}
                            onChange={(e) =>
                              handleRowChange(index, "course", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={row.outcome}
                            onChange={(e) =>
                              handleRowChange(index, "outcome", e.target.value)
                            }
                          />
                        </td>
                        <td>
                          <button onClick={() => handleDeleteRow(index)}>
                            <img src={deleteIcon} height={20} alt="Delete Row" />
                          </button>
                        </td>
                      </tr>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
      <button onClick={handleAddRow}>Add Row</button>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

EditableTable.propTypes = {
  onSubmit: PropTypes.func.isRequired
};
