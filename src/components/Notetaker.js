import React, { useEffect, useState } from "react";

function Notetaker() {
  const [notes, setNotes] = useState([{ id: 1, note: "Hello world" }]);
  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-yellow">
      <h1 className="code f2-l">
        Amplify Notetaker
        {/* Note form */}
        <form className="mb3">
          <input type="text" className="pa2 f4" placeholder="Any plans?" />
          <button className="pa2 f4">Add Note</button>
        </form>
        {/* Notes list */}
        <div>
          {notes.map((item) => {
            return (
              <div key={item.id} className="flex items-center">
                <li className="list pa1 f3">{item.note}</li>
                <button className="bg-transparent bn f4">
                  <span>&times;</span>
                </button>
              </div>
            );
          })}
        </div>
      </h1>
    </div>
  );
}

export default Notetaker;
