import { EditableTable } from "./EditableTable";

export const Home = () => {
  const handleTableSubmit = async (data) => {
    try {
      const response = await fetch(
        "https://student9999.pythonanywhere.com/process",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("AI Response:", result);

        // Update the result element with the fetched data
        const resultElement = document.getElementsByClassName("result")[0];
        if (resultElement) {
          const formattedResult = JSON.stringify(result["result"], null, 2);
          // Set the formatted JSON into the element
          resultElement.innerHTML = `<pre>${formattedResult}</pre>`;
        } else {
          console.error("Error:", result.error);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <main>
        <h2>Welcome to CO PO Mapper</h2>
        <p>Consistent, accurate, reliable.</p>
      </main>
      <h2>Home Page</h2>
      <p>
        Enter Course outcomes and Program Outcomes in their respectives fields
        and submit to view the mapping.
      </p>
      <EditableTable onSubmit={handleTableSubmit} />
      <div className="result"></div>
    </div>
  );
};
