import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaShieldAlt, FaCheck, FaTimes, FaSearch, FaFilter, FaUser, FaClock, FaBan } from 'react-icons/fa';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rejectionModal, setRejectionModal] = useState({ isOpen: false, userId: null, reason: '' });

  useEffect(() => {
    fetchOwnerRequests();
  }, [filter, currentPage, searchTerm]);

  const fetchOwnerRequests = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
      });

      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await fetch(`/api/auth/owner-requests?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setRequests(data.requests || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        toast.error(data.message || 'Failed to fetch requests');
      }
    } catch (error) {
      console.error('Fetch owner requests error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    setActionLoading(userId);
    try {
      const response = await fetch(`/api/auth/approve-owner-request/${userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Owner request approved successfully!');
        fetchOwnerRequests();
      } else {
        toast.error(data.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Approve request error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionModal.reason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setActionLoading(rejectionModal.userId);
    try {
      const response = await fetch(`/api/auth/reject-owner-request/${rejectionModal.userId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rejectionReason: rejectionModal.reason
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Owner request rejected successfully!');
        setRejectionModal({ isOpen: false, userId: null, reason: '' });
        fetchOwnerRequests();
      } else {
        toast.error(data.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Reject request error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: '#FF9800', icon: <FaClock />, text: 'Pending' },
      approved: { color: '#4CAF50', icon: <FaCheck />, text: 'Approved' },
      rejected: { color: '#F44336', icon: <FaTimes />, text: 'Rejected' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <span className="status-badge" style={{ backgroundColor: config.color }}>
        {config.icon}
        <span>{config.text}</span>
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = searchTerm === '' || 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const openRejectionModal = (userId) => {
    setRejectionModal({ isOpen: true, userId, reason: '' });
  };

  const closeRejectionModal = () => {
    setRejectionModal({ isOpen: false, userId: null, reason: '' });
  };

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-header">
        <div className="header-content">
          <div className="header-title">
            <FaShieldAlt className="admin-icon" />
            <div>
              <h1>Admin Dashboard</h1>
              <p>Manage owner access requests</p>
            </div>
          </div>
          <div className="admin-info">
            <span className="admin-badge">Admin</span>
            <span>{user?.name}</span>
          </div>
        </div>
      </div>

      <div className="admin-dashboard-content">
        <div className="controls-section">
          <div className="search-filter-container">
            <div className="search-box">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-buttons">
              <button
                className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                onClick={() => setFilter('all')}
              >
                <FaFilter />
                All Requests
              </button>
              <button
                className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
                onClick={() => setFilter('pending')}
              >
                <FaClock />
                Pending
              </button>
              <button
                className={`filter-btn ${filter === 'approved' ? 'active' : ''}`}
                onClick={() => setFilter('approved')}
              >
                <FaCheck />
                Approved
              </button>
              <button
                className={`filter-btn ${filter === 'rejected' ? 'active' : ''}`}
                onClick={() => setFilter('rejected')}
              >
                <FaTimes />
                Rejected
              </button>
            </div>
          </div>
        </div>

        <div className="requests-table-container">
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="empty-state">
              <FaUser className="empty-icon" />
              <h3>No requests found</h3>
              <p>No owner access requests match your current filters.</p>
            </div>
          ) : (
            <div className="requests-table">
              <div className="table-header">
                <div className="table-row">
                  <div className="table-cell">User</div>
                  <div className="table-cell">Request Date</div>
                  <div className="table-cell">Status</div>
                  <div className="table-cell">Actions</div>
                </div>
              </div>
              
              <div className="table-body">
                {filteredRequests.map((request) => (
                  <div key={request._id} className="table-row">
                    <div className="table-cell user-info">
                      <div className="user-avatar">
                        <FaUser />
                      </div>
                      <div className="user-details">
                        <div className="user-name">{request.name}</div>
                        <div className="user-email">{request.email}</div>
                      </div>
                    </div>
                    
                    <div className="table-cell">
                      <span className="date-text">
                        {formatDate(request.ownerRequest?.requestedAt)}
                      </span>
                    </div>
                    
                    <div className="table-cell">
                      {getStatusBadge(request.ownerRequest?.status)}
                    </div>
                    
                    <div className="table-cell actions-cell">
                      {request.ownerRequest?.status === 'pending' && (
                        <div className="action-buttons">
                          <button
                            className="action-btn approve-btn"
                            onClick={() => handleApprove(request._id)}
                            disabled={actionLoading === request._id}
                          >
                            {actionLoading === request._id ? (
                              <div className="btn-spinner"></div>
                            ) : (
                              <FaCheck />
                            )}
                            Approve
                          </button>
                          
                          <button
                            className="action-btn reject-btn"
                            onClick={() => openRejectionModal(request._id)}
                            disabled={actionLoading === request._id}
                          >
                            <FaTimes />
                            Reject
                          </button>
                        </div>
                      )}
                      
                      {request.ownerRequest?.status === 'rejected' && (
                        <div className="rejection-info">
                          <FaBan className="rejection-icon" />
                          <span className="rejection-reason">
                            {request.ownerRequest?.rejectionReason || 'No reason provided'}
                          </span>
                        </div>
                      )}
                      
                      {request.ownerRequest?.status === 'approved' && (
                        <div className="approved-info">
                          <FaCheck className="approved-icon" />
                          <span>Approved on {formatDate(request.ownerRequest?.reviewedAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            
            <span className="page-info">
              Page {currentPage} of {totalPages}
            </span>
            
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Rejection Modal */}
      {rejectionModal.isOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Reject Owner Request</h3>
              <button className="modal-close" onClick={closeRejectionModal}>
                <FaTimes />
              </button>
            </div>
            
            <div className="modal-body">
              <label htmlFor="rejection-reason">Rejection Reason *</label>
              <textarea
                id="rejection-reason"
                value={rejectionModal.reason}
                onChange={(e) => setRejectionModal(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Please provide a reason for rejecting this request..."
                rows="4"
                className="rejection-textarea"
              />
            </div>
            
            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={closeRejectionModal}
                disabled={actionLoading === rejectionModal.userId}
              >
                Cancel
              </button>
              
              <button
                className="btn btn-danger"
                onClick={handleReject}
                disabled={actionLoading === rejectionModal.userId}
              >
                {actionLoading === rejectionModal.userId ? (
                  <>
                    <div className="btn-spinner"></div>
                    Rejecting...
                  </>
                ) : (
                  <>
                    <FaTimes />
                    Reject Request
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
