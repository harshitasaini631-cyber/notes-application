import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function CreateNote() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [inputKey, setInputKey] = useState(0);
    const [notes, setNotes] = useState([]);

    const navigate = useNavigate();

    // Existing notes for the left panel
    const getNotes = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch("/notes/read", {
                method: "GET",
                headers: { "Authorization": token }
            });
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getNotes();
    }, []);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

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
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(null);
        setPreview("");
        setInputKey((k) => k + 1);
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const formData = new FormData();
            formData.append("title", title);
            formData.append("description", description);
            if (image) formData.append("image", image);

            const response = await fetch("/notes/create", {
                method: "POST",
                headers: { "Authorization": token },
                body: formData
            });
            const data = await response.json();
            alert(data.msg);
            if (data.msg === "Note created successfully") {
                navigate("/dashboard");
            }
        } catch (error) {
            console.log(error);
            alert("Something went wrong");
        }
    };

    const list = Array.isArray(notes) ? notes : [];

    return (
        <div className="page page-create">
            <div className="create-layout">
                {/* Left: notes that already exist */}
                <aside className="pane">
                    <div className="pane-head">
                        <span>Your notes</span>
                        <small>{list.length}</small>
                    </div>
                    <div className="pane-list">
                        {list.length === 0 ? (
                            <p className="pane-empty">No notes yet. Your first one starts on the right.</p>
                        ) : (
                            list.map((note, index) => (
                                <Link
                                    key={note._id}
                                    to={`/note/${note._id}`}
                                    className={`mini tone-${index % 6}`}
                                >
                                    <strong>{note.title || "Untitled"}</strong>
                                    <span>{note.description}</span>
                                </Link>
                            ))
                        )}
                    </div>
                </aside>

                {/* Right: the note being created */}
                <section className="pane editor-pane">
                    <div className="pane-head">
                        <span>New note</span>
                    </div>
                    <form className="editor-form" onSubmit={handleCreate}>
                        <input
                            className="title-input"
                            type="text"
                            placeholder="Enter note title"
                            aria-label="Note title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="body-box">
                            {preview && (
                                <div className="body-img">
                                    <div className="img-wrap">
                                        <img src={preview} alt="Selected preview" />
                                        <button type="button" className="img-remove" onClick={removeImage} aria-label="Remove image">×</button>
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
                                {!preview && (
                                    <label className="upload-btn">
                                        <input key={inputKey} type="file" accept="image/*" onChange={handleImage} />
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                            <rect x="3" y="3" width="18" height="18" rx="3" />
                                            <circle cx="8.5" cy="8.5" r="1.5" />
                                            <path d="M21 15l-5-5L5 21" />
                                        </svg>
                                        Add image
                                    </label>
                                )}
                            </div>
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary">Create Note</button>
                            <Link to="/dashboard" className="btn btn-ghost">Cancel</Link>
                        </div>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default CreateNote;