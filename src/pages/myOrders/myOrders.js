import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import './myOrders.scss';

function MyOrders() {
  const userID = localStorage.getItem('userID');

  return (
    <div className='myOrders'>
      <h1>my Orders</h1>
    </div>
  );
}

export default MyOrders;
