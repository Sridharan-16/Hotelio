import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaPlus, FaChevronRight, FaLock, FaBell, FaCog, FaMapMarkerAlt, FaGlobe, FaCreditCard } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('My Profile');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: '',
    dateOfBirth: '',
    nationality: '',
    maritalStatus: '',
    anniversaryDate: '',
    city: '',
    state: '',
    mobileNumber: '',
    email: '',
    passportNumber: '',
    expiryDate: '',
    issuingCountry: '',
    panCardNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const nameParts = (user.name || '').split(' ');
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth || '',
        nationality: user.nationality || '',
        maritalStatus: user.maritalStatus || '',
        anniversaryDate: user.anniversaryDate || '',
        city: user.city || '',
        state: user.state || '',
        mobileNumber: user.phone || '',
        email: user.email || '',
        passportNumber: user.passportNumber || '',
        expiryDate: user.expiryDate || '',
        issuingCountry: user.issuingCountry || '',
        panCardNumber: user.panCardNumber || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedData = {
        ...formData,
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        phone: formData.mobileNumber
      };
      
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(updatedData)
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data.user);
        toast.success('Profile updated successfully!');
        setIsEditing(false);
      } else {
        toast.error(data.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBookingDetails = () => {
    navigate('/my-bookings');
  };

  const menuItems = [
    { name: 'My Profile', icon: <FaUser />, section: 'My Profile' },
    { name: 'My Bookings', icon: <FaCreditCard />, section: 'My Bookings' },
    { name: 'Account Settings', icon: <FaCog />, section: 'Account Settings' },
    { name: 'Security', icon: <FaLock />, section: 'Security' },
    { name: 'Notifications', icon: <FaBell />, section: 'Notifications' }
  ];

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading">Please login to view your profile</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <aside className="profile-sidebar">
        <div className="sidebar-header">
          <h2>MY ACCOUNT</h2>
        </div>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <a
              key={item.section}
              href="#"
              className={`nav-item ${activeSection === item.section ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                setActiveSection(item.section);
                if (item.section === 'My Bookings') {
                  handleBookingDetails();
                }
              }}
            >
              {item.icon}
              <span style={{ marginLeft: '10px' }}>{item.name}</span>
            </a>
          ))}
        </nav>
      </aside>

      <main className="profile-main">
        <div className="profile-header">
          <h1>My Profile</h1>
          <button 
            className={`save-btn ${isEditing ? 'save' : 'edit'}`}
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            disabled={loading}
          >
            {isEditing ? 'SAVE' : 'EDIT'}
          </button>
        </div>

        <div className="profile-content">
          <section className="profile-section">
            <h3>General Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>First & Middle Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.firstName || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.lastName || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>Gender</label>
                {isEditing ? (
                  <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                ) : (
                  <span>{formData.gender || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.dateOfBirth || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>Nationality</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="nationality"
                    value={formData.nationality}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.nationality || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>Marital Status</label>
                {isEditing ? (
                  <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="single">Single</option>
                    <option value="married">Married</option>
                    <option value="divorced">Divorced</option>
                    <option value="widowed">Widowed</option>
                  </select>
                ) : (
                  <span>{formData.maritalStatus || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>Anniversary Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="anniversaryDate"
                    value={formData.anniversaryDate}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.anniversaryDate || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>City</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.city || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>State</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.state || '-'}</span>
                )}
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h3>Contact Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Mobile Number</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.mobileNumber || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>Email ID</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.email || 'Add Email ID'}</span>
                )}
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h3>Documents Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Passport Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="passportNumber"
                    value={formData.passportNumber}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.passportNumber || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                {isEditing ? (
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.expiryDate || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>Issuing Country</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="issuingCountry"
                    value={formData.issuingCountry}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.issuingCountry || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>PAN Card Number</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="panCardNumber"
                    value={formData.panCardNumber}
                    onChange={handleChange}
                  />
                ) : (
                  <span>{formData.panCardNumber || '-'}</span>
                )}
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h3>Your Preferences</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Domestic Trip Protection Plan</label>
                {isEditing ? (
                  <select name="domesticPlan" value={formData.domesticPlan || ''} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                ) : (
                  <span>{formData.domesticPlan || '-'}</span>
                )}
              </div>
              <div className="form-group">
                <label>International Travel Insurance Plan</label>
                {isEditing ? (
                  <select name="internationalPlan" value={formData.internationalPlan || ''} onChange={handleChange}>
                    <option value="">Select</option>
                    <option value="basic">Basic</option>
                    <option value="standard">Standard</option>
                    <option value="premium">Premium</option>
                  </select>
                ) : (
                  <span>{formData.internationalPlan || '-'}</span>
                )}
              </div>
            </div>
          </section>

          <section className="profile-section">
            <h3>Frequent Flyer Details</h3>
            <button className="add-button" onClick={() => toast.info('Add frequent flyer details coming soon!')}>
              <FaPlus /> Add
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Profile;
