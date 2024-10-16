import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

export const CoPoMatrixTable = ({
  selectedCourse = '',
  selectedProgram = '',
  onDataReady, 
  newMapping = [],
}) => {
  const [cos, setCos] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedCourse && selectedProgram) {
      setLoading(true);
      fetch(
        `https://5000-sagar999-copomapper-sasdici9ljh.ws-us116.gitpod.io/get_mapping/${encodeURIComponent(
          selectedProgram
        )}/${encodeURIComponent(selectedCourse)}`
      )
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log('Fetched CO-PO data:', data); // Log the fetched data

          // Check if data.COs exists and has expected structure
          if (data && data.COs) {
            setCos(data.COs);
          } else {
            console.warn('Unexpected data structure:', data);
            setCos({});
          }
          setLoading(false);

          // Notify parent component when data is ready
          if (onDataReady) {
            onDataReady(data);
          }
        })
        .catch((error) => {
          console.error('Error fetching CO-PO data:', error);
          setLoading(false);
        });
    }
  }, [selectedCourse, selectedProgram, onDataReady]);

  useEffect(() => {
    if (newMapping.length) {
      console.log('New Mapping:', newMapping); // Log the new mapping data
      const updatedMapping = {};
      newMapping.forEach(({ course_outcome, similarities }) => {
        console.log(`Processing course outcome: ${course_outcome}`); // Log course outcome
        updatedMapping[course_outcome] = similarities.reduce((acc, curr) => {
          acc[curr.program_outcome] = curr.similarity;
          return acc;
        }, {});
      });
      console.log('Updated mapping:', updatedMapping);
      setCos(updatedMapping);
    }
  }, [newMapping]);

  if (!selectedCourse || !selectedProgram) return null;

  const poCount = Object.keys(cos).length > 0 ? Object.values(cos)[0].length : 0;

  if (loading) {
    return <p>Loading CO-PO Matrix...</p>;
  }

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
  onDataReady: PropTypes.func, 
  newMapping: PropTypes.array,
};
