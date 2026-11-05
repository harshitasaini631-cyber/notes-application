
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { imgSrc } from "./imgSrc";
import { API_URL } from "../api";

function EditNote() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [existingImage, setExistingImage] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [newPreview, setNewPreview] = useState("");
    const [removeExisting, setRemoveExisting] = useState(false);
    const [inputKey, setInputKey] = useState(0);
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getNotes = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/notes/read`, {
                    headers: { "Authorization": token }
                });
                const data = await response.json();
                setNotes(data);
            } catch (err) {
                console.log(err);
            }
        };
        getNotes();
    }, []);

    useEffect(() => {
        const getNote = async () => {
            setLoading(true);
            setError("");
            setNewImage(null);
            setNewPreview("");
            setRemoveExisting(false);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${API_URL}/notes/read/${id}`, {
                    headers: { "Authorization": token }
                });
                const data = await response.json();
                if (!response.ok || !data || !data._id) {
                    setError(data?.msg || "Note not found");
                } else {
                    setTitle(data.title || "");
                    setDescription(data.description || "");
                    setExistingImage(data.image || "");
                }
            } catch (err) {
                console.log(err);
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };
        getNote();
    }, [id]);

    useEffect(() => {
        return () => {
            if (newPreview) URL.revokeObjectURL(newPreview);
        };
    }, [newPreview]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            alert("Please choose an image file");
            return;
        }
        if (file.size > 2 * 1024 * 1024) {
            alert("Image must be smaller than 2 MB");
            return;
        }
        setNewImage(file);
        setNewPreview(URL.createObjectURL(file));
        setRemoveExisting(false);
    };

    const handleRemove = () => {
        setNewImage(null);
        setNewPreview("");
        setRemoveExisting(true);
        setInputKey((k) => k + 1);
    };

    const shownImage = newPreview || (removeExisting ? "" : imgSrc(existingImage));

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            if (newImage) formData.append("image", newImage);
            if (removeExisting && !newImage) formData.append("removeImage", "true");

            const response = await fetch(`${API_URL}/notes/update/${id}`, {
                method: "PUT",
                headers: { "Authorization": token },
                body: formData
            });
            const data = await response.json();
            alert(data.msg);
            if (data.msg === "Note updated successfully") {
                navigate("/dashboard");
            }
        } catch (err) {
            console.log(err);
            alert("Something went wrong");
        }
    };

    const list = Array.isArray(notes) ? notes : [];

    return (
        <div className="page page-create">
            <div className="create-layout">
                <aside className="pane">
                    <div className="pane-head">
                        <span>Your notes</span>
                        <small>{list.length}</small>
                    </div>
                    <div className="pane-list">
                        {list.length === 0 ? (
                            <p className="pane-empty">No notes yet.</p>
                        ) : (
                            list.map((note, index) => (
                                <Link
                                    key={note._id}
                                    to={`/note/${note._id}`}
                                    className={`mini tone-${index % 6}`}
                                    style={note._id === id ? { borderColor: "var(--accent)" } : undefined}
                                >
                                    <strong>{note.title || "Untitled"}</strong>
                                    <span>{note.description}</span>
                                </Link>
                            ))
                        )}
                    </div>
                </aside>

                <section className="pane editor-pane">
                    <div className="pane-head">
                        <span>Edit note</span>
                    </div>

                    {error ? (
                        <div className="editor-form">
                            <p className="pane-empty">{error}</p>
                            <div className="form-actions">
                                <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
                            </div>
                        </div>
                    ) : loading ? (
                        <div className="editor-form">
                            <p className="pane-empty">Loading…</p>
                        </div>
                    ) : (
                        <form className="editor-form" onSubmit={handleUpdate}>
                            <input
                                className="title-input"
                                type="text"
                                placeholder="Enter note title"
                                aria-label="Note title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <div className="body-box">
                                {shownImage && (
                                    <div className="body-img">
                                        <div className="img-wrap">
                                            <img src={shownImage} alt="Note attachment" />
                                            <button type="button" className="img-remove" onClick={handleRemove} aria-label="Remove image">×</button>
                                        </div>
                                    </div>
                                )}
                                <textarea
                                    className="body-input"
                                    placeholder="Enter note description"
                                    aria-label="Note description"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                <div className="body-bar">
                                    <label className="upload-btn">
                                        <input key={inputKey} type="file" accept="image/*" onChange={handleImage} />
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <rect x="3" y="3" width="18" height="18" rx="3" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                        {shownImage ? "Change image" : "Add image"}
                                    </label>
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="btn btn-primary">Update Note</button>
                                <Link to="/dashboard" className="btn btn-ghost">Cancel</Link>
                            </div>
                        </form>
                    )}
                </section>
            </div>
        </div>
    );
}

export default EditNote;
