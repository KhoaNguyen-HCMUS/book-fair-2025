import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import './historyOrders.scss';

function HistoryOrders() {
  return (
    <div className='historyOrders'>
      <h1>History Orders</h1>
      {/* Add your order history display here */}
    </div>
  );
}

export default HistoryOrders;