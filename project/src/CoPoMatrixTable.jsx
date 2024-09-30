import PropTypes from 'prop-types';
import coPoMatrix from '../json/co_po_matrix.json'; // Adjust the path as necessary

export const CoPoMatrixTable = ({ selectedCourse = 'BSc IT' }) => {
  const coData = coPoMatrix[selectedCourse] || {}; // Use empty object if undefined

  return (
    <div>
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
          {Object.entries(coData).map(([coId, values]) => (
            <tr key={coId}>
              <td>{coId}</td>
              {values.map((value, index) => (
                <td key={index}>{value}</td>
              ))}
            </tr>
          ))}
          {/* Handle AVG row if required */}
        </tbody>
      </table>
    </div>
  );
};

CoPoMatrixTable.propTypes={
  selectedCourse: PropTypes.string
}
