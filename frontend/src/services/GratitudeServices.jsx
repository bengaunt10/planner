const baseUrl = import.meta.env.VITE_BASE_URL;

class GratitudeServices {
    static async fetch_Gratitude (Token) {
        try {
          const response = await fetch(`${baseUrl}/retrievegratitude`, {
            headers: {
              Authorization: `Bearer ${Token}`,
            },
            method: "GET",
          });
          if (response.ok) {
            let data = await response.json();
            return data;
          } else {
            console.error("Couldnt fetch gratitudes :(", response.status);
          }
        } catch (error) {
          console.error("Gratitudes cannot be fetched because", error);
        }
      };
      
      static async add_gratitudes(gratitudeData, Token){
        try {
          const response = await fetch(`${baseUrl}/addgratitude/`, {
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
          console.error("The task couldn't be posted because", error);
        }
      };

      static async deleteGratitude(gratitudeID, Token) {
        try {
          const response = await fetch(`${baseUrl}/deletegratitude/${gratitudeID}/`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
            },
          });
          if (response.ok) {
            return response.json();
          } else {
            console.error("Task couldn't be deleted", response.status);
          }
        } catch (error) {
          console.error("Deleting gratitudes led to an error: ", error);
        }
      };

      static async editGratitude(gratitudeID, Token, gratitudeData) {
        try {
          const response = await fetch(`${baseUrl}/editgratitude/${gratitudeID}/`, {
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
            console.error("Couldn't edit the grattitude", response.status);
          }
        } catch (error) {
          console.error("Error editing the gratitude: ", error);
        }
      };
}

export default GratitudeServices