"use client";
import { useState, useEffect } from "react";

export default function BookCard({ book, onRefresh }: any) {


	const [loading, setLoading] = useState(false);
	const [editing, setEditing] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	const [editForm, setEditForm] = useState({
		title: book.title,
		author: book.author,
		genre: book.genre || "",
		publisher: book.publisher || "",
		location: book.location || "",
		total: book.copies.total,
		avail: book.copies.avail,
		reserved: book.copies.reserved,
	});

	async function handleUpdate() {
		setLoading(true);
		setMessage("");
		setError("");
		const res = await fetch(`/api/books/${book._id}`, {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				title: editForm.title,
				author: editForm.author,
				genre: editForm.genre,
				publisher: editForm.publisher,
				location: editForm.location,
				copies: {
					total: Number(editForm.total),
					avail: Number(editForm.avail),
					reserved: Number(editForm.reserved),
				},
			}),
		});

		setLoading(false);

		const data = await res.json()
		if (res.ok) {
			setMessage("Book updated successfully!");
			setEditing(false);
			onRefresh?.();
		} else {
			setError(data.error || "Failed to update book.");
		}
	}

	async function handleDelete() {
		if (!confirm("Delete this book?")) return;

		setMessage("");
		setError("");

		const res = await fetch(`/api/books/${book._id}`, {
			method: "DELETE",
		});

		const data = await res.json();

		if (res.ok) {
			setMessage("Book deleted successfully!");
			onRefresh?.();
		} else {
			setError(data.error || "Failed to delete book.");
		}
	}

	useEffect(() => {
		if (message || error) {
			const timer = setTimeout(() => {
				setMessage("");
				setError("");
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, [message, error]);

	return (
		<div className="bg-white shadow-md rounded-xl p-6">

			{message && <p className="text-green-500">{message}</p>}
			{error && <p className="text-red-500">{error}</p>}

			{editing ? (
				<div className="grid gap-3">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Title
						</label>
						<input
							value={editForm.title}
							onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
							className="w-full p-2 rounded-lg bg-gray-200 text-gray-900"
						/>	
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Author
						</label>
						<input
							value={editForm.author}
							onChange={(e) => setEditForm({ ...editForm, author: e.target.value })}
							className="w-full p-2 rounded-lg bg-gray-200 text-gray-900"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">	
							Genre
						</label>
						<input
							value={editForm.genre}
							onChange={(e) => setEditForm({ ...editForm, genre: e.target.value })}
							className="w-full p-2 rounded-lg bg-gray-200 text-gray-900"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Publisher
						</label>
						<input
							value={editForm.publisher}
							onChange={(e) => setEditForm({ ...editForm, publisher: e.target.value })}
							className="w-full p-2 rounded-lg bg-gray-200 text-gray-900"
						/>
					</div>
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Location
						</label>
						<input
							value={editForm.location}
							onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
							className="w-full p-2 rounded-lg bg-gray-200 text-gray-900"
						/>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Total Copies
							</label>
							<input
								type="number"
								value={editForm.total}
								onChange={(e) => setEditForm({ ...editForm, total: Number(e.target.value) })}
								className="w-full p-2 rounded-lg bg-gray-200 text-gray-900"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Available Copies
							</label>
							<input
								type="number"
								value={editForm.avail}
								onChange={(e) => setEditForm({ ...editForm, avail: Number(e.target.value) })}
								className="w-full p-2 rounded-lg bg-gray-200 text-gray-900"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-1">
								Reserved Copies
							</label>
							<input
								type="number"
								value={editForm.reserved}
								onChange={(e) => setEditForm({ ...editForm, reserved: Number(e.target.value) })}
								className="w-full p-2 rounded-lg bg-gray-200 text-gray-900"
							/>
						</div>
					</div>	

					<div className="flex gap-3">
						<button
							onClick={handleUpdate}
							className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
						>
							{loading ? "Saving..." : "Save Changes"}
						</button>
						
						<button
							onClick={() => {
								setEditing(false);
								setEditForm({
									title: book.title,
									author: book.author,
									genre: book.genre || "",
									publisher: book.publisher || "",
									location: book.location || "",
									total: book.copies.total,
									avail: book.copies.avail,
									reserved: book.copies.reserved,
								});
							}}
							className="p-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-900 transition cursor-pointer"
						>
							Cancel
						</button>
					</div>
				</div>
			) : (
				<div className="flex justify-between items-start">
					<div>
						<h2 className="text-lg font-bold text-gray-900">{book.title}</h2>
						<p className="text-gray-600">by {book.author}</p>
						<p className="text-gray-500 text-sm mt-1">ISBN: {book.ISBN}</p>
						{book.genre && (<p className="text-gray-500 text-sm">Genre: {book.genre}</p>)}
						{book.location && (<p className="text-gray-500 text-sm">Location: {book.location}</p>)}
					</div>
					<div className="text-right">
						<p className="text-sm text-gray-600">Total: {book.copies.total}</p>
						<p className="text-sm text-green-600 font-semibold">	
							Available: {book.copies.avail}
						</p>
						<p className="text-sm text-yellow-600">
							Reserved: {book.copies.reserved}
						</p>
						<div className="flex gap-2 mt-4 justify-end">
							<button
								onClick={() => setEditing(true)}
								className="p-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white"
							>
								Edit
							</button>
							<button
								onClick={handleDelete}
								className="p-2 px-4 rounded-lg bg-red-500 hover:bg-red-600 text-white"
							>
								Delete
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
			