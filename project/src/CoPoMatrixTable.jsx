import PropTypes from 'prop-types';

export const CoPoMatrixTable = ({ selectedCourse = '', selectedProgram = '', coPoMatrixData = [] }) => {

  if (!selectedCourse || !selectedProgram) return null; 
  const cos = coPoMatrixData || []; 

  if (!cos.length) {
    return <p>No CO-PO mapping data available for {selectedCourse}.</p>;
  }

  const poCount = cos[0]?.length || 0; 
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
            <th>Program Outcomes</th>
            {Array.from({ length: poCount }, (_, index) => (
              <th key={index}>CO{index + 1}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {cos.map((values, coIndex) => (
            <tr key={coIndex}>
              <td style={{ padding: 8 }} className='td-center'>PO{coIndex + 1}</td>
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
