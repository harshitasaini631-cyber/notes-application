
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { imgSrc } from "./imgSrc";
import { API_URL } from "../api";

function ViewNote() {
    const { id } = useParams();
    const [note, setNote] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const getNote = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/notes/read/${id}`, {
                    headers: { "Authorization": token }
                });
                const data = await response.json();
                if (!response.ok || !data || !data._id) {
                    setError(data?.msg || "Note not found");
                    return;
                }
                setNote(data);
            } catch (err) {
                console.log(err);
                setError("Something went wrong");
            }
        };
        getNote();
    }, [id]);

    if (error) {
        return (
            <div className="page page-narrow">
                <div className="empty">
                    <h3>{error}</h3>
                    <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
                </div>
            </div>
        );
    }

    if (!note) {
        return (
            <div className="page page-narrow">
                <p className="page-sub">Loading…</p>
            </div>
        );
    }

    return (
        <div className="page page-narrow">
            <div className="page-head">
                <h1 className="page-title">{note.title || "Untitled"}</h1>
                <div className="form-actions">
                    <Link to="/dashboard" className="btn btn-ghost">Back</Link>
                    <Link to={`/edit/${note._id}`} className="btn btn-primary">Edit</Link>
                </div>
            </div>
            <div className={`editor-card view-layout ${note.image ? "has-image" : ""}`}>
                {note.image && (
                    <div className="upload-preview">
                        <img src={imgSrc(note.image)} alt="Note attachment" />
                    </div>
                )}
                <p className="view-body">{note.description}</p>
            </div>
        </div>
    );
}

export default ViewNote;
