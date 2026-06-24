'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import RequestDetailAudio from './RequestDetailAudio';
import RequestDetailHandwritten from './RequestDetailHandwritten';

interface RequestDetail {
  id: string;
  customerName: string;
  phone: string;
  requestType: 'Audio' | 'Handwritten';
}

const MOCK_REQUEST_DETAILS: Record<string, RequestDetail> = {
  'sth-rh-2051': { id: 'sth-rh-2051', customerName: 'Aditya Bhargav', phone: '+919876543210', requestType: 'Audio' },
  'sth-rh-2052': { id: 'sth-rh-2052', customerName: 'Aditya Bhargav', phone: '+919876543210', requestType: 'Handwritten' }
};

export default function SparesRequestDetailPageWrapper() {
  const params = useParams();
  const requestId = (params.id as string)?.toLowerCase();

  const request = MOCK_REQUEST_DETAILS[requestId] || MOCK_REQUEST_DETAILS['sth-rh-2051'];

  return (
    <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(8px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
      {request.requestType === 'Audio' ? (
        <RequestDetailAudio request={request} />
      ) : (
        <RequestDetailHandwritten request={request} />
      )}
    </div>
  );
}
