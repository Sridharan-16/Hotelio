import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaCrown, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaArrowLeft } from 'react-icons/fa';
import './RequestOwnerAccess.css';

const RequestOwnerAccess = () => {
  const { user, hasOwnerRequest, getOwnerRequestStatus, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    if (hasOwnerRequest()) {
      setRequestStatus(getOwnerRequestStatus());
    }
  }, [hasOwnerRequest, getOwnerRequestStatus]);

  const handleRequestAccess = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/request-owner-access', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Owner access request submitted successfully!');
        setRequestStatus('pending');
        
        // Update user context with new request status
        const updatedUser = {
          ...user,
          ownerRequest: {
            requested: true,
            requestedAt: new Date().toISOString(),
            status: 'pending',
            reviewedAt: null,
            reviewedBy: null,
            rejectionReason: null
          }
        };
        updateUser(updatedUser);
      } else {
        toast.error(data.message || 'Failed to submit request');
      }
    } catch (error) {
      console.error('Request owner access error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (requestStatus) {
      case 'approved':
        return <FaCheckCircle className="status-icon approved" />;
      case 'rejected':
        return <FaTimesCircle className="status-icon rejected" />;
      case 'pending':
      default:
        return <FaHourglassHalf className="status-icon pending" />;
    }
  };

  const getStatusMessage = () => {
    switch (requestStatus) {
      case 'approved':
        return 'Your owner access has been approved! You can now access the owner dashboard.';
      case 'rejected':
        return 'Your owner access request has been rejected. Please contact support for more information.';
      case 'pending':
      default:
        return 'Your request is currently pending review by our admin team.';
    }
  };

  const getStatusColor = () => {
    switch (requestStatus) {
      case 'approved':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      case 'pending':
      default:
        return '#FF9800';
    }
  };

  if (hasOwnerRequest()) {
    return (
      <div className="request-owner-access-container">
        <div className="request-owner-access-card">
          <div className="request-header">
            <button 
              className="back-button"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft />
              <span>Back to Profile</span>
            </button>
            <div className="request-title">
              <FaCrown className="crown-icon" />
              <h2>Owner Access Request</h2>
            </div>
          </div>

          <div className="request-status-container">
            <div className="status-display">
              {getStatusIcon()}
              <div className="status-content">
                <h3 style={{ color: getStatusColor() }}>
                  Status: {requestStatus ? requestStatus.charAt(0).toUpperCase() + requestStatus.slice(1) : 'Pending'}
                </h3>
                <p>{getStatusMessage()}</p>
              </div>
            </div>

            {requestStatus === 'approved' && (
              <div className="approved-actions">
                <a href="/owner-dashboard" className="btn btn-primary">
                  Go to Owner Dashboard
                </a>
              </div>
            )}

            {requestStatus === 'rejected' && user?.ownerRequest?.rejectionReason && (
              <div className="rejection-reason">
                <h4>Reason for rejection:</h4>
                <p>{user.ownerRequest.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="request-owner-access-container">
      <div className="request-owner-access-card">
        <div className="request-header">
          <button 
            className="back-button"
            onClick={() => window.history.back()}
          >
            <FaArrowLeft />
            <span>Back to Profile</span>
          </button>
          <div className="request-title">
            <FaCrown className="crown-icon" />
            <h2>Request Owner Access</h2>
          </div>
        </div>

        <div className="request-content">
          <div className="request-info">
            <h3>Become a Hotel Owner</h3>
            <p>
              Request owner access to add and manage your own hotels on our platform. 
              As a hotel owner, you'll be able to:
            </p>
            <ul className="benefits-list">
              <li>Add new hotels to the platform</li>
              <li>Manage hotel details and room information</li>
              <li>Update pricing and availability</li>
              <li>Monitor booking requests</li>
              <li>Control hotel visibility and status</li>
            </ul>
          </div>

          <div className="request-process">
            <h4>Approval Process</h4>
            <ol className="process-steps">
              <li>Submit your owner access request</li>
              <li>Admin team reviews your request</li>
              <li>You'll receive approval or rejection notification</li>
              <li>Approved owners get access to the owner dashboard</li>
            </ol>
          </div>

          <div className="request-actions">
            <button
              className="btn btn-primary request-btn"
              onClick={handleRequestAccess}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="spinner-small"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FaCrown />
                  <span>Request Owner Access</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestOwnerAccess;
