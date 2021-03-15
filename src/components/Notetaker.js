import { API, graphqlOperation } from "aws-amplify";
import { updateNote, createNote, deleteNote } from "../graphql/mutations";
import {
  onCreateNote,
  onDeleteNote,
  onUpdateNote
} from "../graphql/subscriptions";
import { listNotes } from "../graphql/queries";
import React, { useEffect, useState } from "react";

function Notetaker() {
  const [note, setNote] = useState([]);
  const [notes, setNotes] = useState([]);
  const [id, setId] = useState("");

  useEffect(() => {
    getNotes();
    try {
      API.graphql(graphqlOperation(onCreateNote)).subscribe({
        next: ({ value }) => {
          const newNote = value.data.onCreateNote;
          setNotes((prevState) => {
            const filteredNotes = prevState.filter(
              (note) => note.id !== newNote.id
            );
            return [...filteredNotes, newNote];
          });
        },
        error: (error) =>
          console.log("error occured while onCreateNote subscription", error)
      });
      API.graphql(graphqlOperation(onDeleteNote)).subscribe({
        next: ({ value }) => {
          const deletedNote = value.data.onDeleteNote;
          setNotes((prevState) =>
            prevState.filter((note) => note.id !== deletedNote.id)
          );
        },
        error: (error) =>
          console.log("error occured while onDeleteNote subscription", error)
      });
      API.graphql(graphqlOperation(onUpdateNote)).subscribe({
        next: ({ value }) => {
          const updatedNote = value.data.onUpdateNote;
          const index = notes.findIndex((note) => {
            console.log(note.id === updatedNote.id);
            return note.id === updatedNote.id;
          });
          console.log("updated note id", updatedNote.id, "index", index);
          if (index > -1)
            setNotes((prevState) => [
              ...prevState.slice(0, index),
              updatedNote,
              ...prevState.slice(index + 1)
            ]);
        },
        error: (error) =>
          console.log("error occured while onUpdateNote subscription", error)
      });
    } catch (error) {
      console.log("error occured while doing subscription", error);
    }
  }, [notes]);

  const getNotes = async () => {
    try {
      if (!notes.length) {
        const newNotes = await API.graphql(graphqlOperation(listNotes));
        setNotes((prevState) => [...notes, ...newNotes.data.listNotes.items]);
      }
    } catch (error) {
      console.log("error occured in list notes API", error);
    }
  };

  const handleDeleteNote = async (noteId) => {
    try {
      const input = { id: noteId };
      await API.graphql(graphqlOperation(deleteNote, { input }));
    } catch (error) {
      console.log("error occured in delete note API", error);
    }
  };

  const updateNotes = async () => {
    const input = { id, note };
    console.log("id inside update notes", id);
    await API.graphql(graphqlOperation(updateNote, { input }));
    setId("");
    setNote("");
  };

  const hasExistingNote = () => {
    if (id) {
      // is the id a valid id?
      const isNote = notes.findIndex((note) => note.id === id) > -1;
      return isNote;
    }
    return false;
  };

  const handleAddNote = async (event) => {
    event.preventDefault();
    try {
      // Check if we have an existing note, if so update it.
      if (hasExistingNote()) {
        updateNotes();
      } else {
        const input = { note };
        await API.graphql(
          graphqlOperation(createNote, {
            input
          })
        );
      }
      setNote("");
    } catch (error) {
      console.log("error occured in create note API", error);
    }
  };

  const handleEditNote = (note) => {
    setNote(note.note);
    setId(note.id);
  };

  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-yellow">
      <h1 className="code f2-l">
        Amplify Notetaker
        {/* Note form */}
        <form className="mb3" onSubmit={handleAddNote}>
          <input
            type="text"
            className="pa2 f4"
            placeholder="Any plans?"
            value={note}
            onChange={(event) => setNote(event.target.value)}
          />
          <button className="pa2 f4">{id ? "Update Note" : "Add Note"}</button>
        </form>
        {/* Notes list */}
        <div>
          {notes.map((item) => {
            return (
              <div key={item.id} className="flex items-center">
                <li
                  onClick={() => handleEditNote(item)}
                  className="list pa1 f3"
                >
                  {item.note}
                </li>
                <button
                  onClick={() => handleDeleteNote(item.id)}
                  className="bg-transparent bn f4"
                >
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
