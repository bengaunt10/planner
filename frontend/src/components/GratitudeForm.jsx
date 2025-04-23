/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "../Styling/gratitudes.css";

function GratitudeForm({ onSubmit, passedData, editForm=false }) {
    const [gratitudeData, setGratitudeData] = useState({
        newGratitudes: "",
        newDoneToday: "",
        newBestPartToday: "",
    });

    useEffect(() => {
        if (passedData) {
            setGratitudeData({
                newGratitudes: passedData.gratitudes,
                newDoneToday: passedData.doneToday,
                newBestPartToday: passedData.bestPartToday,
            });
        }
    }
    , [passedData]);

    const Submission = (e) => {
        e.preventDefault();
    
        onSubmit({
          gratitudes: gratitudeData.newGratitudes,
          doneToday: gratitudeData.newDoneToday,
          bestPartToday: gratitudeData.newBestPartToday,
        });
    };


  return (
    <div>
        <form onSubmit={Submission}>
            <div className="form-group">
              <label htmlFor="grats"> What are your gratitudes for today? </label>
              <textarea className="form-control"
              id="grats"
                type="text"
                value={gratitudeData.newGratitudes}
                placeholder="I am grateful for..."
                onChange={(e) =>
                  setGratitudeData({ ...gratitudeData, newGratitudes: e.target.value })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="completed"> What have you completed today? </label>
              <textarea className="form-control"
              id="completed"
                type="text"
                value={gratitudeData.newDoneToday}
                placeholder="Today I have..."
                onChange={(e) =>
                  setGratitudeData({
                    ...gratitudeData,
                    newDoneToday: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="reflect"> Reflect on the best parts of your day </label>
              <textarea className="form-control"
              id="reflect"
                type="text"
                placeholder="The best parts were..."
                value={gratitudeData.newBestPartToday}
                onChange={(e) =>
                  setGratitudeData({
                    ...gratitudeData,
                    newBestPartToday: e.target.value,
                  })
                }
                required
              />
            </div>


            <button className="btn btn-success" type="submit">
                {editForm ? 'Update' : 'Add'} Entry
            </button>
          </form>

    </div>
  )
}

export default GratitudeForm