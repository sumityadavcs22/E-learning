import React, { useEffect, useState } from 'react';

const Profile = ({ popup = false, onClose }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000/api/users/profile', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer <token>', // if using JWT
            },
        })
            .then(res => res.json())
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return <div style={{ textAlign: 'center', marginTop: 60 }}>Loading...</div>;
    }

    if (!user) {
        return <div style={{ textAlign: 'center', marginTop: 60, color: 'red' }}>Failed to load profile.</div>;
    }

    const content = (
        <div style={popup ? styles.profileCardPopup : styles.profileCard}>
            <div style={styles.header}>
                <img src={user.avatar || 'https://i.pravatar.cc/150?img=3'} alt="Avatar" style={styles.avatar} />
                <div>
                    <h2 style={styles.name}>{user.name}</h2>
                    <p style={styles.location}><span role="img" aria-label="location">📍</span> {user.location || 'Unknown'}</p>
                    <p style={styles.role}><span role="img" aria-label="role">👤</span> {user.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : 'Student'}</p>
                </div>
            </div>
            <p style={styles.email}>{user.email}</p>
            <p style={styles.bio}>{user.bio || ''}</p>
            <div style={styles.meta}>
                <span style={styles.joined}><span role="img" aria-label="calendar">📅</span> Joined {user.joined || ''}</span>
            </div>
            <div style={styles.interestsSection}>
                <h4 style={styles.interestsTitle}>Interests</h4>
                <div style={styles.interests}>
                    {(user.interests || []).map((interest, idx) => (
                        <span key={idx} style={styles.interestBadge}>{interest}</span>
                    ))}
                </div>
            </div>
            <button style={styles.editBtn}>Edit Profile</button>
            {/* Example: Show admin-only UI */}
            {user.role === "admin" && (
                <div style={{ marginTop: 20, color: "#6366f1", fontWeight: 600 }}>
                    Admin Portal Access
                </div>
            )}
        </div>
    );

    if (popup) {
        return (
            <div style={styles.overlay}>
                <div style={styles.sidePop}>
                    <button style={styles.closeBtn} onClick={onClose}>&times;</button>
                    {content}
                </div>
            </div>
        );
    }

    // Default: full page
    return (
        <div style={styles.container}>
            {content}
        </div>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: 'rgba(0,0,0,0.3)',
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'stretch',
    },
    sidePop: {
        background: 'white',
        width: '400px',
        maxWidth: '90vw',
        height: '100%',
        boxShadow: '-2px 0 16px rgba(60,60,120,0.15)',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        animation: 'slideIn 0.3s',
    },
    closeBtn: {
        position: 'absolute',
        top: 18,
        right: 18,
        background: 'transparent',
        border: 'none',
        fontSize: '2rem',
        color: '#6366f1',
        cursor: 'pointer',
        zIndex: 10,
    },
    container: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: '40px',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
        minHeight: '100vh',
        padding: '40px 0',
    },
    profileCard: {
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '18px',
        boxShadow: '0 8px 32px rgba(60,60,120,0.15)',
        padding: '40px 32px 32px 32px',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%',
        position: 'relative',
        transition: 'box-shadow 0.3s',
    },
    profileCardPopup: {
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '18px',
        boxShadow: '0 8px 32px rgba(60,60,120,0.10)',
        padding: '40px 32px 32px 32px',
        textAlign: 'center',
        maxWidth: '340px',
        width: '100%',
        position: 'relative',
        transition: 'box-shadow 0.3s',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        gap: '18px',
        marginBottom: '18px',
    },
    avatar: {
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        border: '4px solid #6366f1',
        boxShadow: '0 2px 8px rgba(99,102,241,0.15)',
        objectFit: 'cover',
    },
    name: {
        margin: 0,
        fontSize: '1.7em',
        fontWeight: 700,
        color: '#3730a3',
    },
    location: {
        color: '#6366f1',
        fontSize: '1em',
        marginTop: '4px',
    },
    email: {
        color: '#64748b',
        fontSize: '1em',
        marginBottom: '10px',
        marginTop: '0',
    },
    bio: {
        color: '#334155',
        fontSize: '1.08em',
        marginBottom: '18px',
    },
    meta: {
        marginBottom: '18px',
        color: '#a5b4fc',
        fontSize: '0.98em',
    },
    joined: {
        background: '#eef2ff',
        borderRadius: '8px',
        padding: '4px 12px',
        color: '#6366f1',
    },
    interestsSection: {
        marginBottom: '22px',
    },
    interestsTitle: {
        margin: '0 0 8px 0',
        color: '#6366f1',
        fontSize: '1.1em',
        fontWeight: 600,
    },
    interests: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: 'center',
    },
    interestBadge: {
        background: 'linear-gradient(90deg, #6366f1 60%, #818cf8 100%)',
        color: '#fff',
        borderRadius: '16px',
        padding: '5px 14px',
        fontSize: '0.95em',
        fontWeight: 500,
        boxShadow: '0 1px 4px rgba(99,102,241,0.08)',
    },
    editBtn: {
        marginTop: '10px',
        background: 'linear-gradient(90deg, #6366f1 60%, #818cf8 100%)',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        padding: '10px 28px',
        fontSize: '1em',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(99,102,241,0.12)',
        transition: 'background 0.2s',
    },
    role: {
        color: '#6366f1',
        fontSize: '1em',
        marginTop: '4px',
        fontWeight: 600,
    },
};

export default Profile;