import PropTypes from 'prop-types';
import coPoMatrix from '../json/co_po_matrix.json';
import { useEffect, useState } from 'react';

export const CoPoMatrixTable = ({
  selectedCourse = '',
  selectedProgram = '',
  selectedSemester = '',
  onReady,
  newMapping = [],
}) => {
  const [cos, setCos] = useState({});
  
  useEffect(() => {
    // Call the onReady prop when the component mounts
    if (onReady) onReady();
    
    // Load the initial course outcomes data
    const courseData = coPoMatrix[selectedProgram]?.[selectedCourse] || {};
    setCos(courseData.COs || {});
  }, [selectedCourse, selectedProgram, onReady]);

  useEffect(() => {
    if (newMapping.length) {
      const updatedMapping = {};
      newMapping.forEach(({ course_outcome, similarities }) => {
        updatedMapping[course_outcome] = similarities.reduce((acc, curr) => {
          acc[curr.program_outcome] = curr.similarity;
          return acc;
        }, {});
      });
      setCos(updatedMapping);
    }
  }, [newMapping]);

  if (!selectedCourse || !selectedProgram) return null;

  const poCount = Object.keys(cos).length > 0 ? Object.values(cos)[0].length : 0;

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
          {Object.entries(cos).length > 0 ? (
            Object.entries(cos).map(([coId, values]) => (
              <tr key={coId}>
                <td className='td-center'>{coId}</td>
                {Array.isArray(values) ? (
                  values.map((value, index) => (
                    <td className='td-center' key={index}>{value}</td>
                  ))
                ) : (
                  <td className='td-center' colSpan={poCount}>
                    No data available for {coId}.
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={poCount + 1} className='td-center'>
                No CO-PO mapping data available for {selectedCourse}.
              </td>
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
  selectedSemester: PropTypes.string,
  onReady: PropTypes.func,
  newMapping: PropTypes.array,  // New prop for updated mapping data
};

// Default value for newMapping prop
