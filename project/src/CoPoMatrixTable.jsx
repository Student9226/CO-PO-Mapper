import PropTypes from 'prop-types';

export const CoPoMatrixTable = ({ selectedCourse = '', selectedProgram = '', coPoMatrixData = [] }) => {

  console.log(coPoMatrixData);

  if (!selectedCourse || !selectedProgram) return null; // Removed duplicate check

  // Directly assign the mapping data
  const cos = coPoMatrixData || []; // Use coPoMatrixData directly

  if (!cos.length) {
    return <p>No CO-PO mapping data available for {selectedCourse}.</p>;
  }

  const poCount = cos[0]?.length || 0; // Assuming all COs have the same length

  const avgValues = cos.reduce((acc, co) => {
    co.forEach((value, index) => {
      acc[index] = (acc[index] || 0) + value;
    });
    return acc;
  }, new Array(poCount).fill(0)).map(sum => (sum / cos.length).toFixed(2));

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
          {cos.map((values, coIndex) => (
            <tr key={coIndex}>
              <td style={{ padding: 8 }} className='td-center'>CO{coIndex + 1}</td>
              {values.map((value, index) => <td className='td-center' key={index}>{value}</td>)}
            </tr>
          ))}
          <tr key="avg">
            <td className='td-center'>AVG</td>
            {avgValues.map((value, index) => <td style={{ padding: 8 }} className='td-center' key={index}>{value}</td>)}
          </tr>
        </tbody>
      </table>
    </>
  );
};

CoPoMatrixTable.propTypes = {
  selectedCourse: PropTypes.string,
  selectedProgram: PropTypes.string,
  coPoMatrixData: PropTypes.array.isRequired,
};
