import PropTypes from 'prop-types';

export const Table = ({ courses = [], program = [], programName = "", editable, setProgramOutcomes, setFilteredCourses }) => {
  const handleProgramChange = (e, index) => {
    const updatedProgram = [...program];
    updatedProgram[index] = e.target.value;
    setProgramOutcomes(updatedProgram); 
  };

  const handleCourseOutcomeChange = (e, courseIndex, outcomeIndex) => {
    const updatedCourses = [...courses];
    updatedCourses[courseIndex].outcomes[outcomeIndex] = e.target.value;
    setFilteredCourses(updatedCourses); 
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
            {courses.map((course, index) => (
              <tr key={course.id} style={{width: "fit-content"}}>
                {courses.length > 1 && <td style={{ textAlign: "center" }}>{index + 1}</td>}
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>
                  <ul>
                    {course.outcomes.map((outcome, outcomeIdx) => (
                      editable ? (
                        <li key={outcomeIdx} style={{listStyle: 'none'}}>
                          <input
                            value={outcome}
                            onChange={(e) => handleCourseOutcomeChange(e, index, outcomeIdx)}
                            className='editable-input'
                          />
                        </li>
                      ) : (
                        <li className='static-outcome' key={outcomeIdx}>
                          {outcome}
                        </li>
                      )
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
              <th style={{width: '10%'}}>Sr no</th>
              <th>{programName} Program Outcomes</th>
            </tr>
          </thead>
          <tbody>
          {program.map((outcome, index) => (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td>
                {editable ? (
                  <input
                    className="editable-input"
                    value={outcome}
                    onChange={(e) => handleProgramChange(e, index)}
                  />
                ) : (
                  <span className="static-outcome" style={{display: "block"}}>{outcome}</span>
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
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      outcomes: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
  program: PropTypes.arrayOf(PropTypes.string),
  programName: PropTypes.string,
  editable: PropTypes.bool.isRequired,
  setProgramOutcomes: PropTypes.func,
  setFilteredCourses: PropTypes.func
};

