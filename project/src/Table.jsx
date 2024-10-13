import PropTypes from "prop-types";
import { useState, useEffect, useMemo, useRef } from "react";

export const Table = ({ courses = [], program = [], programName = "", isEditable }) => {
  const [editableCourses, setEditableCourses] = useState(courses);
  const [editableProgram, setEditableProgram] = useState(program);

  const stableCourses = useMemo(() => courses, [courses]);
  const stableProgram = useMemo(() => program, [program]);

  useEffect(() => {
    if (JSON.stringify(editableCourses) !== JSON.stringify(stableCourses)) {
      setEditableCourses(stableCourses);
    }
  }, [stableCourses]);

  useEffect(() => {
    if (JSON.stringify(editableProgram) !== JSON.stringify(stableProgram)) {
      setEditableProgram(stableProgram);
    }
  }, [stableProgram]);

  const handleCourseOutcomeChange = (courseIndex, outcomeIndex, newValue) => {
    const updatedCourses = [...editableCourses];
    updatedCourses[courseIndex].outcomes[outcomeIndex] = newValue;
    setEditableCourses(updatedCourses);
  };

  const handleProgramOutcomeChange = (index, newValue) => {
    const updatedProgram = [...editableProgram];
    updatedProgram[index] = newValue;
    setEditableProgram(updatedProgram);
  };

  const autoResizeTextarea = (textarea) => {
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to calculate new height
      textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }
  };

  // This effect will resize textareas after the component mounts and after the data updates
  useEffect(() => {
    const textareas = document.querySelectorAll("textarea");
    textareas.forEach(autoResizeTextarea);
  }, [editableCourses, editableProgram]);

  return (
    <>
      {editableCourses.length > 0 && (
        <table className="course-table">
          <thead>
            <tr>
              {editableCourses.length !== 1 && <th>Sr no</th>}
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Outcomes</th>
            </tr>
          </thead>
          <tbody>
            {editableCourses.map((course, courseIndex) => (
              <tr key={course.id}>
                {editableCourses.length > 1 && (
                  <td style={{ textAlign: "center" }}>{courseIndex + 1}</td>
                )}
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>
                  <ul className="list">
                    {course.outcomes.map((outcome, outcomeIndex) => (
                      <li key={outcomeIndex}>
                        {isEditable ? (
                          <textarea
                            className="list"
                            defaultValue={outcome} // Use defaultValue instead of value
                            onChange={(e) => {
                              handleCourseOutcomeChange(courseIndex, outcomeIndex, e.target.value);
                              autoResizeTextarea(e.target); // Resize on change
                            }}
                            rows="1" // Set initial row count
                            style={{ width: "100%", resize: "none" }} // Prevent resizing to maintain table layout
                          />
                        ) : (
                          <span className="list">{outcome}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editableProgram.length > 0 && (
        <table className="program-table">
          <thead>
            <tr>
              <th>Sr no</th>
              <th>{programName} Program Outcomes</th>
            </tr>
          </thead>
          <tbody>
            {editableProgram.map((outcome, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>
                  {isEditable ? (
                    <textarea
                      className="list"
                      defaultValue={outcome} // Use defaultValue instead of value
                      onChange={(e) => {
                        handleProgramOutcomeChange(index, e.target.value);
                        autoResizeTextarea(e.target); // Resize on change
                      }}
                      rows="1" // Set initial row count
                      style={{ width: "100%", resize: "none" }} // Prevent resizing to maintain table layout
                    />
                  ) : (
                    <span className="list">{outcome}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

Table.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      outcomes: PropTypes.object,
    })
  ),
  program: PropTypes.object,
  programName: PropTypes.string,
  isEditable: PropTypes.bool,
};
