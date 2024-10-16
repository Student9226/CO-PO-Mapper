import PropTypes from "prop-types";
import { useCallback } from "react";

export const Table = ({ courses = [], program = [], programName = "", isEditable, onCourseOutcomeChange, onProgramOutcomeChange }) => {
  const handleCourseOutcomeChange = useCallback((courseIndex, outcomeIndex, newValue) => {
    onCourseOutcomeChange(courseIndex, outcomeIndex, newValue);
  }, [onCourseOutcomeChange]);

  const handleProgramOutcomeChange = useCallback((index, newValue) => {
    onProgramOutcomeChange(index, newValue);
  }, [onProgramOutcomeChange]);

  const handleContentChange = (e, updateFunction, ...args) => {
    updateFunction(...args, e.target.innerText);
  };

  return (
    <>
      {courses.length > 0 && (
        <table className="course-table">
          <thead>
            <tr>
              {courses.length !== 1 && <th>Sr no</th>}
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Outcomes</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, courseIndex) => (
              <tr key={course.id}>
                {courses.length > 1 && (
                  <td style={{ textAlign: "center" }}>{courseIndex + 1}</td>
                )}
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>
                  <ul className="list">
                    {course.outcomes.map((outcome, outcomeIndex) => (
                      <li key={outcomeIndex}>
                        {isEditable ? (
                          <span
                            className="list"
                            contentEditable
                            suppressContentEditableWarning={true}
                            onBlur={(e) =>
                              handleContentChange(
                                e,
                                handleCourseOutcomeChange,
                                courseIndex,
                                outcomeIndex
                              )
                            }
                          >
                            {outcome}
                          </span>
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

      {program.length > 0 && (
        <table className="program-table">
          <thead>
            <tr>
              <th>Sr no</th>
              <th>{programName} Program Outcomes</th>
            </tr>
          </thead>
          <tbody>
            {program.map((outcome, index) => (
              <tr key={index}>
                <td style={{ textAlign: "center" }}>{index + 1}</td>
                <td>
                  {isEditable ? (
                    <span
                      className="list"
                      contentEditable
                      suppressContentEditableWarning={true}
                      onBlur={(e) =>
                        handleContentChange(e, handleProgramOutcomeChange, index)
                      }
                    >
                      {outcome}
                    </span>
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
      outcomes: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  program: PropTypes.arrayOf(PropTypes.string),
  programName: PropTypes.string,
  isEditable: PropTypes.bool,
  onCourseOutcomeChange: PropTypes.func.isRequired,  // Add this
  onProgramOutcomeChange: PropTypes.func.isRequired,  // Add this
};
