import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { imgSrc } from "./imgSrc";

function Dashboard() {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const getNotes = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("/notes/read", {
                method: "GET",
                headers: {
                    "Authorization": token
                }
            });

            const data = await response.json();

            setNotes(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    const deleteNote = async (id) => {
        if (!window.confirm("Are you sure you want to delete this note?")) {
            return;
        }
        try {
            const token = localStorage.getItem("token");

            await fetch(`/notes/delete/${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": token
                }
            });

            await getNotes();
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getNotes();
    }, []);

    
    const list = Array.isArray(notes) ? notes : [];

    return (
        <div className="page">
            <div className="page-head">
                <div>
                    <h1 className="page-title">My Notes</h1>
                    <p className="page-sub">
                        {loading ? "" : list.length === 1 ? "1 note" : `${list.length} notes`}
                    </p>
                </div>
                <Link to="/create" className="btn btn-primary">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M12 5v14M5 12h14" />
                    </svg>
                    Create Note
                </Link>
            </div>

            {loading ? (
                <p className="page-sub">Loading…</p>
            ) : list.length === 0 ? (
                <div className="empty">
                    <h3>No notes yet</h3>
                    <p>Write your first note and it will show up here.</p>
                    <Link to="/create" className="btn btn-primary">Create Note</Link>
                </div>
            ) : (
                <div className="notes-grid">
                    {list.map((note, index) => (
                        <div
                            key={note._id}
                            className={`note-card tone-${index % 6}`}
                            style={{ cursor: "pointer" }}
                            onClick={() => navigate(`/note/${note._id}`)}
                        >
                            {note.image && (
                                <img className="note-image" src={imgSrc(note.image)} alt="" />
                            )}
                            <h3>{note.title || "Untitled"}</h3>
                            <p>{note.description}</p>

                            <div className="note-actions">
                                <button
                                    className="btn btn-ghost btn-sm"
                                    onClick={(e) => { e.stopPropagation(); navigate(`/edit/${note._id}`); }}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M12 20h9" />
                                        <path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                                    </svg>
                                    Edit
                                </button>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={(e) => { e.stopPropagation(); deleteNote(note._id); }}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M3 6h18" />
                                        <path d="M8 6V4h8v2" />
                                        <path d="M19 6l-1 14H6L5 6" />
                                    </svg>
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Dashboard;