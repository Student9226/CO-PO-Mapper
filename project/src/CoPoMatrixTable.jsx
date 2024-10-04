import PropTypes from 'prop-types';
import coPoMatrix from '../json/co_po_matrix.json';
export const CoPoMatrixTable = ({ selectedCourse = '', selectedProgram = '' }) => {
  if (!selectedCourse || !selectedProgram) return null;
  const courseData = coPoMatrix[selectedProgram]?.[selectedCourse] || {};
  const cos = courseData.COs || {};
  console.log('Selected Course Data:', selectedCourse);

  if (!Object.keys(cos).length) {
    return <p>No CO-PO mapping data available for {selectedCourse}.</p>;
  }
  const poCount = Math.min(...Object.values(cos).map(arr => arr.length),11); 
  return (
    <>
      <h2>CO-PO Matrix for {selectedCourse}</h2>
      <table>
        <thead>
          <tr>
            <th>Course Outcomes</th>
            {Array.from({ length: poCount }, (_, index) => (
              <th key={index}>PO{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.entries(cos).map(([coId, values]) => (
            <tr key={coId}>
              <td>{coId}</td>
              {Array.isArray(values) ? (
                values.map((value, index) => <td key={index}>{value}</td>)
              ) : (
                <td colSpan={poCount}>No data available</td>
              )}
            </tr>
          ))}
          {cos.AVG && (
            <tr key="avg">
              <td>AVG</td>
              {cos.AVG.map((value, index) => <td key={index}>{value}</td>)}
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
};

CoPoMatrixTable.propTypes = {
  selectedCourse: PropTypes.string,
  selectedProgram: PropTypes.string,
};
