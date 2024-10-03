import PropTypes from "prop-types";
export const Table = ({ courses=[], program=[], programName=""}) => {
  return (
    <>
      {courses.length > 0 && (
        <table className="course-table">
          <thead>
            <tr>
            {courses.length!=1 && <th>Sr no</th>}
            
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Outcomes</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={course.id}>
                {courses.length>1 && (<td style={{textAlign:'center'}}>{index+1}</td>)}
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>
                  <ul>
                    {course.outcomes.map((outcome, index) => (
                      <li style={{listStyle:'I'}} key={index}>{outcome}</li>
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
                <td style={{textAlign:'center'}}>{index+1}</td>
                <td>{outcome}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
   

    </>
  );
}

Table.propTypes = {
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      outcomes: PropTypes.arrayOf(PropTypes.string),
    })
  ),
  program: PropTypes.arrayOf(PropTypes.string),
  programName: PropTypes.string
};
