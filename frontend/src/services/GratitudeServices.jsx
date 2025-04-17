const baseUrl = import.meta.env.VITE_BASE_URL;

class GratitudeServices {
    static async fetch_Gratitude (Token) {
        try {
          const response = await fetch(`${baseUrl}/retrieve`, {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
            method: "GET",
          });
          if (response.ok) {
            let data = await response.json();
            return data;
          } else {
            console.error("failed to fetch gratitudes", response.status);
          }
        } catch (error) {
          console.error("error fetching gratitudes", error);
        }
      };
      
      static async add_gratitudes(gratitudeData, Token){
        try {
          const response = await fetch(`${baseUrl}/add/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
            },
            body: JSON.stringify(gratitudeData),
          });
          if (response.ok) {
            return response.json();
          } else {
            const data = await response.json();
            if (data.OVERLAP) {
              alert(data.OVERLAP); 
            }
          }
        } catch (error) {
          console.error("Error posting task:", error);
        }
      };

      static async deleteGratitude(gratitudeID, Token) {
        try {
          const response = await fetch(`${baseUrl}/delete/${gratitudeID}/`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
            },
          });
          if (response.ok) {
            return response.json();
          } else {
            console.error("Failed to delete task");
          }
        } catch (error) {
          console.error("error: ", error);
        }
      };

      static async editGratitude(gratitudeID, Token, gratitudeData) {
        try {
          const response = await fetch(`${baseUrl}/edit/${gratitudeID}/`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
            },
            body: JSON.stringify(gratitudeData),
          });
          if (response.ok) {
            return response.json();
          } else {
            console.error("failed to edit gratitude")
          }
        } catch (error) {
          console.error("Error editing gratitude:", error);
        }
      };
}

export default GratitudeServices