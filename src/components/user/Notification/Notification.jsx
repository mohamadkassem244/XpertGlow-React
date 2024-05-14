import React from 'react';
import './Notification.css';

function Notification ({ message, onClose }){
  return (
    <div className="notification">
      <div className="notification_message">{message}</div>
      <div className="notification_close_container">
        <button className="notification_close" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  );
};

export default Notification;
