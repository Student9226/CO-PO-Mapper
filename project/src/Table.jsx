import PropTypes from "prop-types";

export const Table = ({ courses=[], program=[]}) => {
  return (
    <>
      {courses.length > 0 && (
        <table className="course-table">
          <thead>
            <tr>
              <th>Course ID</th>
              <th>Course Name</th>
              <th>Outcomes</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td>{course.id}</td>
                <td>{course.name}</td>
                <td>
                  <ul>
                    {course.outcomes.map((outcome, index) => (
                      <li key={index}>{outcome}</li>
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
              <th>Program Outcomes</th>
            </tr>
          </thead>
          <tbody>
            {program.map((outcome, index) => (
              <tr key={index}>
                <td>{outcome}</td>
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
};
