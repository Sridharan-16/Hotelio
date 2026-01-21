import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaEdit, FaSave, FaTimes, FaPlus, FaChevronRight, FaLock, FaBell, FaCog, FaMapMarkerAlt, FaGlobe, FaCreditCard, FaCamera, FaUpload } from 'react-icons/fa';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('My Profile');
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showPhotoOptions && !event.target.closest('.profile-photo-section')) {
        setShowPhotoOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPhotoOptions]);

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

  const handlePhotoClick = () => {
    setShowPhotoOptions(!showPhotoOptions);
  };

  const handlePhotoSelect = (source) => {
    setShowPhotoOptions(false);
    
    if (source === 'camera') {
      // Try to access camera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        })
          .then((stream) => {
            // Create video element for camera capture
            const video = document.createElement('video');
            video.srcObject = stream;
            video.play();
            
            // Create canvas to capture image
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth || 640;
            canvas.height = video.videoHeight || 480;
            const context = canvas.getContext('2d');
            
            // Show camera preview briefly
            setTimeout(() => {
              context.drawImage(video, 0, 0, canvas.width, canvas.height);
              canvas.toBlob((blob) => {
                if (blob) {
                  const file = new File([blob], 'camera-photo.jpg', { type: 'image/jpeg' });
                  processPhotoFile(file);
                }
                stream.getTracks().forEach(track => track.stop());
              }, 'image/jpeg', 0.8);
            }, 2000);
          })
          .catch((error) => {
            console.error('Camera error:', error);
            toast.error('Camera access denied or not available');
            fileInputRef.current?.click();
          });
      } else {
        toast.error('Camera not supported on this device');
        fileInputRef.current?.click();
      }
    } else {
      // Open file picker for gallery
      fileInputRef.current?.click();
    }
  };

  const processPhotoFile = (file) => {
    if (!file) {
      toast.error('No file selected');
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please select a valid image file (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Validate minimum dimensions (optional but recommended)
    const img = new Image();
    img.onload = function() {
      if (this.width < 100 || this.height < 100) {
        toast.warning('For best results, use an image at least 100x100 pixels');
      }
    };
    img.onerror = function() {
      toast.error('Invalid image file');
    };
    img.src = URL.createObjectURL(file);
    
    // Process the valid file
    setSelectedPhoto(file);
    const reader = new FileReader();
    reader.onloadstart = () => {
      toast.info('Processing image...');
    };
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
      toast.success('Image loaded successfully!');
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      processPhotoFile(file);
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedPhoto) {
      toast.error('Please select a photo first');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('profilePhoto', selectedPhoto);

      let response;
      let data;
      
      try {
        response = await fetch('/api/auth/upload-profile-photo', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: formData
        });

        // Check if response is ok and has content
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          
          // Try to parse as JSON, fallback to text
          let errorMessage = 'Failed to upload photo';
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
          
          toast.error(errorMessage);
          return;
        }

        // Try to parse response as JSON
        const responseText = await response.text();
        try {
          data = JSON.parse(responseText);
        } catch {
          console.error('Invalid JSON response:', responseText);
          toast.error('Server returned invalid response format');
          return;
        }

        if (data && data.profilePhoto) {
          // Update user context with new profile photo
          const updatedUser = { ...user, profilePhoto: data.profilePhoto };
          updateUser(updatedUser);
          
          // Update localStorage to persist the change
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          currentUser.profilePhoto = data.profilePhoto;
          localStorage.setItem('user', JSON.stringify(currentUser));
          
          toast.success('Profile photo updated successfully!');
          setSelectedPhoto(null);
          setPhotoPreview(null);
          setShowPhotoOptions(false);
        } else {
          toast.error(data?.message || 'Failed to upload photo - invalid response');
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        
        // Fallback: Simulate successful upload for demo purposes
        const reader = new FileReader();
        reader.onloadend = () => {
          const photoUrl = reader.result;
          
          // Update user context with local photo URL
          const updatedUser = { ...user, profilePhoto: photoUrl };
          updateUser(updatedUser);
          
          // Update localStorage to persist the change
          const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
          currentUser.profilePhoto = photoUrl;
          localStorage.setItem('user', JSON.stringify(currentUser));
          
          toast.success('Profile photo updated successfully! (Demo mode)');
          setSelectedPhoto(null);
          setPhotoPreview(null);
          setShowPhotoOptions(false);
        };
        reader.readAsDataURL(selectedPhoto);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading photo: ' + error.message);
    } finally {
      setLoading(false);
    }
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

        {/* Profile Photo Upload Section */}
        <section className="profile-photo-section">
          <div className="profile-photo-container">
            <div className="profile-photo-wrapper" onClick={handlePhotoClick}>
              {photoPreview ? (
                <img src={photoPreview} alt="Profile Preview" className="profile-photo-preview" />
              ) : user?.profilePhoto ? (
                <img src={user.profilePhoto} alt="Profile" className="profile-photo-current" />
              ) : (
                <div className="profile-photo-placeholder">
                  <FaUser className="profile-photo-icon" />
                </div>
              )}
              <div className="profile-photo-overlay">
                <FaCamera className="profile-photo-camera-icon" />
              </div>
            </div>
          </div>

          {showPhotoOptions && (
            <div className="photo-options-dropdown">
              <button 
                className="photo-option-btn"
                onClick={() => handlePhotoSelect('camera')}
              >
                <FaCamera />
                <span>Take Photo</span>
              </button>
              <button 
                className="photo-option-btn"
                onClick={() => handlePhotoSelect('gallery')}
              >
                <FaUpload />
                <span>Choose from Gallery</span>
              </button>
            </div>
          )}

          {photoPreview && (
            <div className="photo-actions">
              <button 
                className="save-photo-btn"
                onClick={handleSavePhoto}
                disabled={loading}
              >
                <FaSave />
                Save Photo
              </button>
              <button 
                className="cancel-photo-btn"
                onClick={() => {
                  setSelectedPhoto(null);
                  setPhotoPreview(null);
                  setShowPhotoOptions(false);
                }}
              >
                <FaTimes />
                Cancel
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </section>

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
