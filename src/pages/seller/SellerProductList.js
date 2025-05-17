// src/pages/seller/SellerProductList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function SellerProductList() {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://127.0.0.1:8000/products/seller/products/')
            .then(res => {
                if (!res.ok) throw new Error(`Status ${res.status}`);
                return res.json();
            })
            .then(data => setProducts(data))
            .catch(err => setError(err));
    }, []);

    if (error) return <p className="text-red-600">Error: {error.message}</p>;
    if (!products.length) return <p>No products yet.</p>;

    return (
        <div className="p-4">
            <h1 className="text-2xl mb-4">My Products</h1>
            <Link
                to="/seller/new"
                className="inline-block mb-4 px-3 py-1 bg-green-600 text-white rounded"
            >
                + Add New Product
            </Link>
            <ul className="space-y-3">
                {products.map(p => (
                    <li
                        key={p.id}
                        className="flex justify-between items-center p-3 border rounded"
                    >
                        <div>
                            <h2 className="font-semibold">{p.name}</h2>
                            <p>Price: ${p.price} | Stock: {p.stock}</p>
                        </div>
                        <div className="space-x-2">
                            <Link
                                to={`/seller/${p.id}/edit`}
                                className="px-2 py-1 bg-blue-500 text-white rounded"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => {
                                    if (!window.confirm('Delete this product?')) return;
                                    fetch(
                                        `http://127.0.0.1:8000/products/seller/products/${p.id}/`,
                                        { method: 'DELETE' }
                                    ).then(() => setProducts(ps => ps.filter(x => x.id !== p.id)));
                                }}
                                className="px-2 py-1 bg-red-500 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
