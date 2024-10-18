import PropTypes from "prop-types";
import { useState, useMemo } from "react";

export const Table = ({ courses = [], program = [], programName = "", isEditable }) => {
  const [editableCourses, setEditableCourses] = useState(courses);
  const [editableProgram, setEditableProgram] = useState(program);

  const stableCourses = useMemo(() => courses, [courses]);
  const stableProgram = useMemo(() => program, [program]);


    


  const handleCourseOutcomeChange = (courseIndex, outcomeIndex, newValue) => {
    if (JSON.stringify(editableCourses) !== JSON.stringify(stableCourses)) {
      setEditableCourses(stableCourses);
    }
    const updatedCourses = [...editableCourses];
    updatedCourses[courseIndex].outcomes[outcomeIndex] = newValue;
    setEditableCourses(updatedCourses);
  };

  const handleProgramOutcomeChange = (index, newValue) => {
    
    if (JSON.stringify(editableProgram) !== JSON.stringify(stableProgram)) {
      setEditableProgram(stableProgram);
    }
    const updatedProgram = [...editableProgram];
    updatedProgram[index] = newValue;
    setEditableProgram(updatedProgram);
  };
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
                  <ul>
                    {course.outcomes.map((outcome, outcomeIndex) => (
                      <li className="list" key={outcomeIndex}>
                        {isEditable ? (
                          <input
                            className="list" 
                            type="text"
                            value={outcome}
                            onChange={(e) =>
                              handleCourseOutcomeChange(courseIndex, outcomeIndex, e.target.value)
                            }
                          />
                        ) : (
                          outcome
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
                    <input
                      className="list" 
                      type="text"
                      value={outcome}
                      onChange={(e) => handleProgramOutcomeChange(index, e.target.value)}
                    />
                  ) : (
                    outcome
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
};
