const baseUrl = import.meta.env.VITE_BASE_URL;

class TaskServices{
    static async fetchTasks(Token) {
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
            console.error("failed to fetch data", response.status);
          }
        } catch (error) {
          console.error("error fetching tasks", error);
        }
      };
      
      static async addTask(taskData, Token){
        try {
          const response = await fetch(`${baseUrl}/add/`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
            },
            body: JSON.stringify(taskData),
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

      static async deleteTask(deleteID, Token, deleteRepeat) {
        try {
          const response = await fetch(`${baseUrl}/delete/${deleteID}/`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
            },
            body: JSON.stringify({ deleteRepeat }),
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

      static async editTask(editID, Token, taskData) {
        try {
          const response = await fetch(`${baseUrl}/edit/${editID}/`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${Token}`,
            },
            body: JSON.stringify(taskData),
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
          console.error("Error editing task:", error);
        }
      };
    
}

export default TaskServices;