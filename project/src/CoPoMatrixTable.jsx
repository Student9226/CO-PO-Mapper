import PropTypes from 'prop-types';
import coPoMatrix from '../json/co_po_matrix.json';

export const CoPoMatrixTable = ({ selectedCourse = '', selectedProgram = '', selectedSemester='' }) => {
  if (!selectedCourse || !selectedProgram) return null;
  
  const courseData = coPoMatrix[selectedProgram]?.[selectedCourse] || {};
  const cos = courseData.COs || {};

  if (!Object.keys(cos).length || selectedSemester) {
    return <p>No CO-PO mapping data available for {selectedCourse}.</p>;
  }

  const averages = {};
  for (const co in cos) {
    if (Array.isArray(cos[co])) {
      for (let i = 0; i < cos[co].length; i++) {
        if (!averages[i]) averages[i] = [];
        averages[i].push(cos[co][i]);
      }
    }
  }

  const avgValues = Object.values(averages).map(arr => {
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return (sum / arr.length).toFixed(2); 
  });

  const poCount = Math.min(...Object.values(cos).map(arr => arr.length), 11);

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
              <td className='td-center'>{coId}</td>
              {Array.isArray(values) ? (
                values.map((value, index) => <td className='td-center' key={index}>{value}</td>)
              ) : (
                <td className='td-center' colSpan={poCount}>No data available of the selected semester of {coId} for now. Please try at a later time.</td>
              )}
            </tr>
          ))}
          <tr key="avg">
            <td className='td-center'>AVG</td>
            {avgValues.map((value, index) => <td className='td-center' key={index}>{value}</td>)}
          </tr>
        </tbody>
      </table>
    </>
  );
};

CoPoMatrixTable.propTypes = {
  selectedCourse: PropTypes.string,
  selectedProgram: PropTypes.string,
  selectedSemester: PropTypes.string,
};
