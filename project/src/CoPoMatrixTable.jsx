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
          if (data && data.COs) {
            setCos(data.COs);
          } else {
            setCos({});
          }
          setLoading(false);
          if (onDataReady) {
            onDataReady(data);
          }
        })
        .catch((error) => {
          setLoading(false);
          console.log(error)
        });
    }
  }, [selectedCourse, selectedProgram, onDataReady]);

  useEffect(() => {
    if (newMapping.length) {
      const updatedMapping = {};
      newMapping.forEach(({ course_outcome, similarities }) => {
        if (similarities && similarities.length) {
          updatedMapping[course_outcome] = similarities.reduce((acc, curr) => {
            acc[curr.program_outcome] = curr.similarity;
            return acc;
          }, {});
        } else {
          updatedMapping[course_outcome] = Array(poCount).fill('No Data');
        }
      });
      setCos(updatedMapping);
    }
  }, [newMapping]);

  if (!selectedCourse || !selectedProgram) return null;

  const poCount = Object.keys(cos).length > 0 ? Object.values(cos)[0].length : 0;

  if (loading) {
    return <p>Loading CO-PO Matrix...</p>;
  }

  if (Object.entries(cos).length === 0) {
    return <p>No CO-PO mapping data available for {selectedCourse}.</p>;
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
          {Object.entries(cos).map(([coId, values]) => (
            <tr key={coId}>
              <td className='td-center'>{coId}</td>
              {Array.isArray(values) && values.length > 0 ? (
                values.map((value, index) => (
                  <td className='td-center' key={index}>{value}</td>
                ))
              ) : (
                <td className='td-center' colSpan={poCount}>
                  No data available for {coId}.
                </td>
              )}
            </tr>
          ))}
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
