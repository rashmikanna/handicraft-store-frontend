import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8000/api/orders/seller', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access')}`,
      }
    })
    .then(response => {
      setOrders(response.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError('Failed to load orders.');
      setLoading(false);
    });
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading orders...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  if (!orders.length) return <p style={{ textAlign: 'center' }}>No orders found.</p>;

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Your Orders</h1>
      {orders.map((order, index) => (
        <div key={order.order_id} style={styles.orderCard}>
          <div style={styles.orderHeader}>
            <div style={styles.orderNumberBadge}>{index + 1}</div>
            <span style={styles.statusBadge}>{order.status}</span>
          </div>

          <div style={styles.orderMeta}>
            <p><strong>Order ID:</strong> {order.order_id}</p>
            <p><strong>Buyer ID:</strong> {order.buyer_id}</p>
            <p><strong>Placed on:</strong> {new Date(order.placed_on).toLocaleString()}</p>
            <p><strong>Shipping Address:</strong> {order.shipping_address}</p>
            <p><strong>Payment Method:</strong> {order.payment_method}</p>
          </div>

          <h3 style={{ marginTop: 20, marginBottom: 10 }}>Your Products in this order:</h3>

          {order.items && order.items.length > 0 ? (
            <ul style={styles.itemsList}>
              {order.items.map((item, idx) => (
                <li key={idx} style={styles.item}>
                  <img
                    src={item.image || 'https://via.placeholder.com/60'}
                    alt={item.product_name}
                    style={styles.itemImage}
                  />
                  <div>
                    <strong>{item.product_name}</strong><br />
                    Qty: {item.quantity} &nbsp;|&nbsp; Price: ₹{Number(item.price).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontStyle: 'italic', color: '#666' }}>No products from you in this order.</p>
          )}
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: 900,
    margin: 'auto',
    padding: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f9f9f9',
    minHeight: '80vh',
  },
  pageTitle: {
    textAlign: 'center',
    marginBottom: 30,
    color: '#8B0000', // Dark red
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    boxShadow: '0 2px 8px rgba(139, 0, 0, 0.15)', // softer red shadow
    padding: 20,
    marginBottom: 25,
    cursor: 'default',
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #ddd',
    paddingBottom: 10,
  },
  orderNumberBadge: {
    backgroundColor: '#B22222', // Firebrick red
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    userSelect: 'none',
  },
  statusBadge: {
    backgroundColor: '#B22222', // Firebrick red
    color: '#fff',
    padding: '6px 14px',
    borderRadius: 20,
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
  },
  orderMeta: {
    marginTop: 12,
    color: '#555',
    fontSize: 14,
    lineHeight: 1.5,
  },
  itemsList: {
    listStyle: 'none',
    padding: 0,
    marginTop: 0,
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: 15,
    fontSize: 16,
    color: '#222',
  },
  itemImage: {
    width: 60,
    height: 60,
    objectFit: 'cover',
    borderRadius: 6,
    marginRight: 15,
    border: '1px solid #ddd',
  }
};

export default SellerOrders;
