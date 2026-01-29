import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaHotel, FaPlus, FaEdit, FaTrash, FaEye, FaToggleOn, FaToggleOff, FaSearch, FaFilter } from 'react-icons/fa';
import './OwnerDashboard.css';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    contact: {
      phone: '',
      email: ''
    },
    rooms: [{
      type: 'Single',
      price: 0,
      capacity: 1,
      available: 1,
      amenities: []
    }]
  });

  useEffect(() => {
    fetchMyHotels();
  }, [statusFilter]);

  const fetchMyHotels = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: 1,
        limit: 50,
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/hotels/my-hotels?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setHotels(data.hotels || []);
      } else {
        toast.error(data.message || 'Failed to fetch hotels');
      }
    } catch (error) {
      console.error('Fetch hotels error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (hotelId) => {
    setActionLoading(hotelId);
    try {
      const response = await fetch(`/api/hotels/${hotelId}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        fetchMyHotels();
      } else {
        toast.error(data.message || 'Failed to toggle hotel status');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm('Are you sure you want to delete this hotel? This action cannot be undone.')) {
      return;
    }

    setActionLoading(hotelId);
    try {
      const response = await fetch(`/api/hotels/${hotelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        fetchMyHotels();
      } else {
        toast.error(data.message || 'Failed to delete hotel');
      }
    } catch (error) {
      console.error('Delete hotel error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleAddHotel = async (e) => {
    e.preventDefault();
    setActionLoading('add');
    
    try {
      const response = await fetch('/api/hotels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Hotel added successfully!');
        setShowAddModal(false);
        resetFormData();
        fetchMyHotels();
      } else {
        toast.error(data.message || 'Failed to add hotel');
      }
    } catch (error) {
      console.error('Add hotel error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditHotel = async (e) => {
    e.preventDefault();
    setActionLoading('edit');
    
    try {
      const response = await fetch(`/api/hotels/${selectedHotel._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Hotel updated successfully!');
        setShowEditModal(false);
        setSelectedHotel(null);
        resetFormData();
        fetchMyHotels();
      } else {
        toast.error(data.message || 'Failed to update hotel');
      }
    } catch (error) {
      console.error('Edit hotel error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (hotel) => {
    setSelectedHotel(hotel);
    setFormData({
      name: hotel.name,
      description: hotel.description,
      address: hotel.address,
      contact: hotel.contact,
      rooms: hotel.rooms || [{
        type: 'Single',
        price: 0,
        capacity: 1,
        available: 1,
        amenities: []
      }]
    });
    setShowEditModal(true);
  };

  const resetFormData = () => {
    setFormData({
      name: '',
      description: '',
      address: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      contact: {
        phone: '',
        email: ''
      },
      rooms: [{
        type: 'Single',
        price: 0,
        capacity: 1,
        available: 1,
        amenities: []
      }]
    });
  };

  const handleInputChange = (e, section = null) => {
    const { name, value } = e.target;
    
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [name]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = searchTerm === '' || 
      hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hotel.address.city.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (isActive) => (
    <span className={`status-badge ${isActive ? 'active' : 'inactive'}`}>
      {isActive ? <FaToggleOn /> : <FaToggleOff />}
      <span>{isActive ? 'Active' : 'Inactive'}</span>
    </span>
  );

  return (
    <div className="owner-dashboard-container">
      <div className="owner-dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <FaHotel className="owner-icon" />
            <div>
              <h1>Owner Dashboard</h1>
              <p>Manage your hotels</p>
            </div>
          </div>
          <div className="header-actions">
            <button
              className="btn btn-primary"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus />
              Add Hotel
            </button>
          </div>
        </div>
      </div>

      <div className="owner-dashboard-content">
        <div className="controls-section">
          <div className="search-filter-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-buttons">
              <button
                className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
                onClick={() => setStatusFilter('all')}
              >
                <FaFilter />
                All Hotels
              </button>
              <button
                className={`filter-btn ${statusFilter === 'active' ? 'active' : ''}`}
                onClick={() => setStatusFilter('active')}
              >
                <FaToggleOn />
                Active
              </button>
              <button
                className={`filter-btn ${statusFilter === 'inactive' ? 'active' : ''}`}
                onClick={() => setStatusFilter('inactive')}
              >
                <FaToggleOff />
                Inactive
              </button>
            </div>
          </div>
        </div>

        <div className="hotels-grid-container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading your hotels...</p>
            </div>
          ) : filteredHotels.length === 0 ? (
            <div className="empty-state">
              <FaHotel className="empty-icon" />
              <h3>No hotels found</h3>
              <p>
                {searchTerm || statusFilter !== 'all' 
                  ? 'No hotels match your current filters.' 
                  : 'Start by adding your first hotel to the platform.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowAddModal(true)}
                >
                  <FaPlus />
                  Add Your First Hotel
                </button>
              )}
            </div>
          ) : (
            <div className="hotels-grid">
              {filteredHotels.map((hotel) => (
                <div key={hotel._id} className="hotel-card">
                  <div className="hotel-image">
                    {hotel.images && hotel.images.length > 0 ? (
                      <img src={hotel.images[0].url} alt={hotel.name} />
                    ) : (
                      <div className="placeholder-image">
                        <FaHotel />
                      </div>
                    )}
                    {getStatusBadge(hotel.isActive)}
                  </div>
                  
                  <div className="hotel-content">
                    <div className="hotel-header">
                      <h3>{hotel.name}</h3>
                      <div className="hotel-rating">
                        <span className="rating-stars">{'★'.repeat(Math.floor(hotel.rating || 0))}</span>
                        <span className="rating-value">{hotel.rating || '0.0'}</span>
                      </div>
                    </div>
                    
                    <div className="hotel-location">
                      <span>{hotel.address.city}, {hotel.address.state}</span>
                    </div>
                    
                    <div className="hotel-description">
                      <p>{hotel.description.substring(0, 100)}...</p>
                    </div>
                    
                    <div className="hotel-rooms">
                      <span>{hotel.rooms?.length || 0} room types</span>
                      <span>From ${Math.min(...(hotel.rooms?.map(r => r.price) || [0]))}/night</span>
                    </div>
                    
                    <div className="hotel-actions">
                      <button
                        className="action-btn view-btn"
                        onClick={() => window.open(`/hotels/${hotel._id}`, '_blank')}
                      >
                        <FaEye />
                        View
                      </button>
                      
                      <button
                        className="action-btn edit-btn"
                        onClick={() => openEditModal(hotel)}
                      >
                        <FaEdit />
                        Edit
                      </button>
                      
                      <button
                        className={`action-btn toggle-btn ${hotel.isActive ? 'active' : 'inactive'}`}
                        onClick={() => handleToggleStatus(hotel._id)}
                        disabled={actionLoading === hotel._id}
                      >
                        {actionLoading === hotel._id ? (
                          <div className="btn-spinner"></div>
                        ) : hotel.isActive ? (
                          <FaToggleOn />
                        ) : (
                          <FaToggleOff />
                        )}
                        {hotel.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDeleteHotel(hotel._id)}
                        disabled={actionLoading === hotel._id}
                      >
                        {actionLoading === hotel._id ? (
                          <div className="btn-spinner"></div>
                        ) : (
                          <FaTrash />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Hotel Modal */}
      {showAddModal && (
        <HotelModal
          title="Add New Hotel"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleAddHotel}
          onClose={() => {
            setShowAddModal(false);
            resetFormData();
          }}
          loading={actionLoading === 'add'}
        />
      )}

      {/* Edit Hotel Modal */}
      {showEditModal && (
        <HotelModal
          title="Edit Hotel"
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleEditHotel}
          onClose={() => {
            setShowEditModal(false);
            setSelectedHotel(null);
            resetFormData();
          }}
          loading={actionLoading === 'edit'}
        />
      )}
    </div>
  );
};

// Hotel Modal Component
const HotelModal = ({ title, formData, setFormData, onSubmit, onClose, loading }) => {
  return (
    <div className="modal-overlay">
      <div className="modal hotel-modal">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="modal-body">
          <div className="form-section">
            <h4>Basic Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Hotel Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group full-width">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows="3"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h4>Address</h4>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Street Address *</label>
                <input
                  type="text"
                  name="street"
                  value={formData.address.street}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, street: e.target.value }
                  }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>City *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.address.city}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value }
                  }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>State *</label>
                <input
                  type="text"
                  name="state"
                  value={formData.address.state}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value }
                  }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Zip Code *</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, zipCode: e.target.value }
                  }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.address.country}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    address: { ...prev.address, country: e.target.value }
                  }))}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h4>Contact Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.contact.phone}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contact: { ...prev.contact, phone: e.target.value }
                  }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.contact.email}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    contact: { ...prev.contact, email: e.target.value }
                  }))}
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <div className="btn-spinner"></div>
                  {title.includes('Add') ? 'Adding...' : 'Updating...'}
                </>
              ) : (
                title.includes('Add') ? 'Add Hotel' : 'Update Hotel'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OwnerDashboard;
