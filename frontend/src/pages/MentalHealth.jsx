import {useState, useEffect } from 'react';
export default function MentalHealth() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('https://sandbox.api.service.nhs.uk/nhs-website-content/mental-health', {
            method: 'GET',
            headers: {
              'accept': 'application/json'
            }
          });
  
          if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
          }
  
          const result = await response.json();
          setData(result);
        } catch (error) {
          setError(error.message);
        }
      };
  
      fetchData();
    }, []);
  
    if (error) return <div>Error: {error}</div>;
    if (!data) return <div>Loading...</div>;
  
    return (
      <div>
        <h1>Mental Health Information</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  };
  
