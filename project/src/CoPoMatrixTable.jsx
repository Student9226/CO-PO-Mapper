const coPoMatrix = {
  "CO1": [1, 1, 3, 2, 2, 0, 1, 1, 1, 0, 2],
  "CO2": [0, 1, 3, 2, 1, 0, 1, 0, 0, 0, 2],
  "CO3": [0, 1, 3, 2, 1, 0, 1, 0, 0, 0, 2],
  "CO4": [0, 1, 3, 2, 1, 0, 1, 0, 0, 0, 2],
  "AVG": [0.25, 1.00, 3.00, 2.00, 1.25, 0.00, 1.00, 0.25, 0.25, 0.00, 2.00]
};

// CO PO Matrix Component
export const CoPoMatrixTable = () => {
  const poHeaders = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
  
  return (
    <div>
      <h3>CO PO Matrix</h3>
      <table border="1" style={{ borderCollapse: 'collapse', width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>Course Outcomes</th>
            {poHeaders.map((po, index) => (
              <th key={index}>PO{po}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(coPoMatrix).map((co, index) => (
            <tr key={index}>
              <td  style={{textAlign: "center"}}>{co}</td>
              {coPoMatrix[co].map((value, idx) => (
                <td  style={{textAlign: "center"}} key={idx}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

