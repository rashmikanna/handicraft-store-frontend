import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function SellerProductForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        available: true,
        images: []
    });
    const [error, setError] = useState(null);

    // Load categories and product data
    useEffect(() => {
        fetch('http://127.0.0.1:8000/products/categories/')
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(console.error);

        if (isEdit) {
            fetch(`http://127.0.0.1:8000/products/seller/products/${id}/`)
                .then(res => res.json())
                .then(data => setForm({ ...form, ...data }))
                .catch(setError);
        }
    }, [id, isEdit]);

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (!file) return;
        const fd = new FormData();
        fd.append('image', file);
        fetch('http://127.0.0.1:8000/products/upload-image/', {
            method: 'POST',
            body: fd
        })
            .then(res => res.json())
            .then(data => setForm(prev => ({ ...prev, images: [...prev.images, data.image_url] })))
            .catch(err => console.error('Upload error', err));
    }

    function handleSubmit(e) {
        e.preventDefault();
        const url = isEdit
            ? `http://127.0.0.1:8000/products/seller/products/${id}/`
            : 'http://127.0.0.1:8000/products/seller/products/';
        const method = isEdit ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })
            .then(res => { if (!res.ok) throw new Error(res.statusText); return res.json(); })
            .then(() => navigate('/seller'))
            .catch(err => setError(err));
    }

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto p-6 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800">
                {isEdit ? 'Edit Product' : 'Add Product'}
            </h2>
            {error && <p className="text-red-600">Error: {error.message}</p>}

            <div>
                <label className="block text-gray-700 mb-1">Name</label>
                <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-1">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={1}
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-1">Price</label>
                <input
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-1">Stock</label>
                <input
                    name="stock"
                    type="number"
                    value={form.stock}
                    onChange={handleChange}
                    required
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label className="block text-gray-700 mb-1">Category</label>
                <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">Select category</option>
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-gray-700 mb-1">Images</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                />
                <div className="mt-2 flex flex-wrap gap-2">
                    {form.images.map((url, idx) => (
                        <img key={idx} src={url} alt="Product" className="h-16 w-16 object-cover rounded" />
                    ))}
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <input
                    name="available"
                    type="checkbox"
                    checked={form.available}
                    onChange={handleChange}
                    className="h-5 w-5 text-blue-600"
                />
                <label className="text-gray-700">Available</label>
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
            >
                {isEdit ? 'Update' : 'Create'} Product
            </button>
        </form>
    );
}
