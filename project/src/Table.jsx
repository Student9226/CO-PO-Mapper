import PropTypes from "prop-types";
import { useState, useEffect, useMemo } from "react";

export const Table = ({ courses = [], program = [], programName = "", isEditable }) => {
  const [editableCourses, setEditableCourses] = useState(courses);
  const [editableProgram, setEditableProgram] = useState(program);

  const stableCourses = useMemo(() => courses, [courses]);
  const stableProgram = useMemo(() => program, [program]);

  useEffect(() => {
    if (JSON.stringify(editableCourses) !== JSON.stringify(stableCourses)) {
      setEditableCourses(stableCourses);
    }
  }, [stableCourses, editableCourses]);

  useEffect(() => {
    if (JSON.stringify(editableProgram) !== JSON.stringify(stableProgram)) {
      setEditableProgram(stableProgram);
    }
  }, [stableProgram, editableProgram]);

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

  const handleContentChange = (e, updateFunction, ...args) => {
    updateFunction(...args, e.target.innerText);
  };

  const handleOutcomesSubmit = () => {
    const requestBody = {
      program: programName,
      course_outcomes: editableCourses.map(course => course.outcomes),
      program_outcomes: editableProgram,
    };
    console.log(requestBody);
    fetch("https://5000-sagar999-copomapper-sasdici9ljh.ws-us116.gitpod.io/map-outcomes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching mapping:", error);
      });
  };

  return (
    <>
      {editableCourses.length > 0 && (
        <div>
          <h3>Course Outcomes</h3>
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
          <button onClick={handleOutcomesSubmit}>Submit Outcomes</button>
        </div>
      )}

      {editableProgram.length > 0 && (
        <div>
          <h3>{programName} Program Outcomes</h3>
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
                      <span
                        className="list"
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={(e) =>
                          handleContentChange(
                            e,
                            handleProgramOutcomeChange,
                            index
                          )
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
        </div>
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
