import PropTypes from 'prop-types';
import coPoMatrix from '../json/co_po_matrix.json'; 

export const CoPoMatrixTable = ({ selectedCourse = '', selectedProgram = '' }) => {
  const courseData = coPoMatrix[selectedCourse] || {}; 

  if (!selectedCourse || !selectedProgram) return null;

  return (
    <>
      <h2>CO-PO Matrix for {selectedCourse}</h2>
      <table>
        <thead>
          <tr>
            <th>Course Outcomes</th>
            {Array.from({ length: 11 }, (_, index) => (
              <th key={index}>PO{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(courseData).map(([courseId, { COs = {} }]) => (
            Object.entries(COs).map(([coId, values]) => (
              <tr key={coId}>
                <td>{coId} ({courseId})</td>
                {Array.isArray(values) ? (
                  values.map((value, index) => <td key={index}>{value}</td>)
                ) : (
                  <td colSpan={11}>No data available</td>
                )}
              </tr>
            ))
          ))}
        </tbody>
      </table>
    </>
  );
};
//This
CoPoMatrixTable.propTypes = {
  selectedCourse: PropTypes.string,
  selectedProgram: PropTypes.string,
};
