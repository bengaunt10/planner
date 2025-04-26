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
            console.error("Could not fetch the tasks", response.status);
          }
        } catch (error) {
          console.error("error when fetching the tasks", error);
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
          console.error("error when posting the task", error);
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
            console.error("Task wasn't able to be deleted", response.status);
          }
        } catch (error) {
          console.error("error when deleting! ", error);
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
          console.error("Error editing the task:", error);
        }
      };
    
}

export default TaskServices;