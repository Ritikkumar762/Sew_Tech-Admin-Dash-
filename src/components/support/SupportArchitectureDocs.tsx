'use client';
import { useState } from 'react';

export function SupportArchitectureDocs() {
  const [activeSubSection, setActiveSubSection] = useState<'api' | 'fsm' | 'sla' | 'rbac' | 'outbox'>('api');
  const [searchQuery, setSearchQuery] = useState('');

  const TICKET_APIS = [
    { method: 'POST', path: '/api/v1/support/tickets', name: 'Create Support Ticket', perm: 'CAN_CREATE_TICKET', desc: 'Generates TKT-YYYYMMDD-XXXX number, sets SLA dates based on priority & enqueues TicketCreated outbox event.' },
    { method: 'GET', path: '/api/v1/support/tickets', name: 'List Support Tickets', perm: 'Role Scoped', desc: 'Lists tickets with Page, PageSize, Search, Category, Priority, Status, Assigned To & User ID filters.' },
    { method: 'GET', path: '/api/v1/support/tickets/{id}', name: 'Get Ticket Details', perm: 'CAN_VIEW_TICKET', desc: 'Fetches detailed info, ticket messages, attachments & assignee.' },
    { method: 'PATCH', path: '/api/v1/support/tickets/{id}', name: 'Update Ticket', perm: 'CAN_UPDATE_TICKET', desc: 'Updates ticket fields with Optimistic Locking version check.' },
    { method: 'POST', path: '/api/v1/support/tickets/{id}/assign', name: 'Assign Ticket', perm: 'CAN_ASSIGN_TICKET', desc: 'Assigns to Agent, Team, or Queue. Auto-updates status to Assigned.' },
    { method: 'PATCH', path: '/api/v1/support/tickets/{id}/status', name: 'Change Ticket Status', perm: 'CAN_CHANGE_STATUS', desc: 'Validates state transition via workflow_engine.py & logs status history.' },
    { method: 'PATCH', path: '/api/v1/support/tickets/{id}/priority', name: 'Change Priority', perm: 'CAN_CHANGE_PRIORITY', desc: 'Dynamically recalculates SLA due dates based on priority change.' },
    { method: 'POST', path: '/api/v1/support/tickets/{id}/reply', name: 'Add Reply / Note', perm: 'CAN_REPLY', desc: 'Posts message. Supports internal_note=True (Agent-only) or False (Customer visible).' },
    { method: 'POST', path: '/api/v1/support/tickets/{id}/close', name: 'Close Ticket', perm: 'CAN_CLOSE_TICKET', desc: 'Moves ticket to Closed status and triggers resolution outbox event.' },
    { method: 'POST', path: '/api/v1/support/tickets/{id}/reopen', name: 'Reopen Ticket', perm: 'CAN_REOPEN_TICKET', desc: 'Reopens closed ticket (Closed -> Reopened state transition).' },
    { method: 'GET', path: '/api/v1/support/tickets/{id}/timeline', name: 'Unified Timeline', perm: 'CAN_VIEW_TIMELINE', desc: 'Chronological timeline combining ticket activities & discussion notes.' },
    { method: 'POST', path: '/api/v1/support/tickets/{id}/attachments', name: 'Upload Attachment', perm: 'CAN_ATTACH_FILE', desc: 'Uploads images or document attachments for the ticket.' },
  ];

  const DISPUTE_APIS = [
    { method: 'POST', path: '/api/v1/support/disputes', name: 'Create Dispute', perm: 'CAN_CREATE_DISPUTE', desc: 'Generates Dispute number (STMxxxxxx), saves Order ID, Mechanic ID, Txn ID & Evidence.' },
    { method: 'GET', path: '/api/v1/support/disputes', name: 'List Disputes', perm: 'CAN_VIEW_DISPUTES', desc: 'Lists disputes with filters (Ongoing, Resolved, Module Spares / Mechanics).' },
    { method: 'GET', path: '/api/v1/support/disputes/{id}', name: 'Get Dispute Details', perm: 'CAN_VIEW_DISPUTE', desc: 'Fetches dispute reason, evidence photos, line items & refund breakdown.' },
    { method: 'PATCH', path: '/api/v1/support/disputes/{id}', name: 'Update Dispute', perm: 'CAN_UPDATE_DISPUTE', desc: 'Updates dispute metadata and escalation notes.' },
    { method: 'POST', path: '/api/v1/support/disputes/{id}/action', name: 'Execute Action (ActionExecutor)', perm: 'CAN_RESOLVE_DISPUTE', desc: 'Single point resolution logic: Approve, Reject, Escalate, Close.' },
    { method: 'POST', path: '/api/v1/support/disputes/{id}/modal-action', name: 'Modal Resolution Action', perm: 'CAN_RESOLVE_DISPUTE', desc: 'Processes Remarks, Reschedule Date/Time, and Partial Refund inputs.' },
    { method: 'POST', path: '/api/v1/support/disputes/{id}/refund/initiate', name: 'Initiate Refund', perm: 'CAN_INITIATE_REFUND', desc: 'Requires dispute.status == "Approved" & amount <= dispute.amount boundary check. Creates SupportRefundRecord (PENDING).' },
    { method: 'POST', path: '/api/v1/support/disputes/{id}/refund/complete', name: 'Complete Refund', perm: 'CAN_COMPLETE_REFUND', desc: 'Verifies refund.dispute_id == dispute.id. Links gateway reference, marks refund COMPLETED & dispute Refund Completed.' },
    { method: 'POST', path: '/api/v1/support/disputes/{id}/cancel', name: 'Cancel Dispute', perm: 'CAN_CREATE_DISPUTE', desc: 'Owner-only cancellation. Blocks non-owners and terminal disputes (Rejected, Refund Completed, Closed).' },
    { method: 'GET', path: '/api/v1/support/disputes/{id}/timeline', name: 'Audit Timeline', perm: 'CAN_VIEW_TIMELINE', desc: 'Returns dispute FSM state transition audit trail.' },
    { method: 'POST', path: '/api/v1/support/disputes/{id}/evidence', name: 'Upload Evidence', perm: 'CAN_UPLOAD_EVIDENCE', desc: 'Uploads evidence documents or images for Evidence Pending status.' },
  ];

  const ANALYTICS_APIS = [
    { method: 'GET', path: '/api/v1/support/analytics/dashboard', name: 'Dashboard KPI Metrics', perm: 'CAN_VIEW_ANALYTICS', desc: 'Total Tickets, Open Tickets, Resolved Tickets, Escalated Disputes, SLA rate, Avg resolution time.' },
    { method: 'GET', path: '/api/v1/support/outbox/status', name: 'Background Outbox Worker Status', perm: 'ADMIN_ONLY', desc: 'Checks process_outbox_events queue status, PENDING events, and failure retry count.' },
  ];

  const filteredTickets = TICKET_APIS.filter(api => 
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    api.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
    api.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDisputes = DISPUTE_APIS.filter(api => 
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    api.path.toLowerCase().includes(searchQuery.toLowerCase()) || 
    api.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAnalytics = ANALYTICS_APIS.filter(api => 
    api.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    api.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Sub Navbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '0.75rem 1rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'api', label: '⚡ Admin API Catalog (25 APIs)' },
            { id: 'fsm', label: '🔄 FSM State Lifecycles' },
            { id: 'sla', label: '⏱️ SLA & Priorities' },
            { id: 'rbac', label: '🔐 RBAC Permission Matrix' },
            { id: 'outbox', label: '⚙️ Outbox Background Worker' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSubSection(tab.id as any)}
              style={{
                padding: '0.5rem 0.9rem',
                fontSize: '0.8rem',
                fontWeight: 700,
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                background: activeSubSection === tab.id ? '#111827' : '#f3f4f6',
                color: activeSubSection === tab.id ? '#fff' : '#4b5563',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeSubSection === 'api' && (
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Search API route or method..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                fontSize: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                outline: 'none',
                width: '100%'
              }}
            />
            <svg style={{ position: 'absolute', left: '0.6rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </div>
        )}
      </div>

      {/* SECTION 1: API CATALOG */}
      {activeSubSection === 'api' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Tickets Section */}
          <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                🎫 Support Ticket Admin APIs
                <span style={{ background: '#dbeafe', color: '#1d4ed8', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>Route: /api/v1/support/tickets</span>
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.6rem 0.8rem', width: '80px' }}>Method</th>
                    <th style={{ padding: '0.6rem 0.8rem', width: '260px' }}>Endpoint Path</th>
                    <th style={{ padding: '0.6rem 0.8rem', width: '180px' }}>API Name</th>
                    <th style={{ padding: '0.6rem 0.8rem', width: '160px' }}>Required Permission</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Flow & Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map((api, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        <span style={{
                          background: api.method === 'POST' ? '#dcfce7' : api.method === 'PATCH' ? '#fef3c7' : '#e0f2fe',
                          color: api.method === 'POST' ? '#15803d' : api.method === 'PATCH' ? '#b45309' : '#0369a1',
                          fontWeight: 800, padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem'
                        }}>{api.method}</span>
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'monospace', fontWeight: 600, color: '#1e293b' }}>{api.path}</td>
                      <td style={{ padding: '0.6rem 0.8rem', fontWeight: 700, color: '#0f172a' }}>{api.name}</td>
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        <span style={{ border: '1px dashed #94a3b8', color: '#475569', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>{api.perm}</span>
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>{api.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Dispute Section */}
          <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#111827', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                ⚖️ Dispute & Refund Resolution Admin APIs
                <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>Route: /api/v1/support/disputes</span>
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.6rem 0.8rem', width: '80px' }}>Method</th>
                    <th style={{ padding: '0.6rem 0.8rem', width: '280px' }}>Endpoint Path</th>
                    <th style={{ padding: '0.6rem 0.8rem', width: '180px' }}>API Name</th>
                    <th style={{ padding: '0.6rem 0.8rem', width: '170px' }}>Required Permission</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Flow & Resolution Engine Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDisputes.map((api, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        <span style={{
                          background: api.method === 'POST' ? '#dcfce7' : api.method === 'PATCH' ? '#fef3c7' : '#e0f2fe',
                          color: api.method === 'POST' ? '#15803d' : api.method === 'PATCH' ? '#b45309' : '#0369a1',
                          fontWeight: 800, padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem'
                        }}>{api.method}</span>
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'monospace', fontWeight: 600, color: '#1e293b' }}>{api.path}</td>
                      <td style={{ padding: '0.6rem 0.8rem', fontWeight: 700, color: '#0f172a' }}>{api.name}</td>
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        <span style={{ border: '1px dashed #94a3b8', color: '#475569', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '10px', fontWeight: 600 }}>{api.perm}</span>
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>{api.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics & Outbox Section */}
          <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 1rem 0', color: '#111827' }}>
              📊 Analytics & Background System APIs
            </h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <th style={{ padding: '0.6rem 0.8rem', width: '80px' }}>Method</th>
                    <th style={{ padding: '0.6rem 0.8rem', width: '280px' }}>Endpoint Path</th>
                    <th style={{ padding: '0.6rem 0.8rem', width: '200px' }}>API Name</th>
                    <th style={{ padding: '0.6rem 0.8rem' }}>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnalytics.map((api, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.6rem 0.8rem' }}>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem' }}>{api.method}</span>
                      </td>
                      <td style={{ padding: '0.6rem 0.8rem', fontFamily: 'monospace', fontWeight: 600, color: '#1e293b' }}>{api.path}</td>
                      <td style={{ padding: '0.6rem 0.8rem', fontWeight: 700, color: '#0f172a' }}>{api.name}</td>
                      <td style={{ padding: '0.6rem 0.8rem', color: '#475569' }}>{api.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* SECTION 2: FSM STATE MACHINES */}
      {activeSubSection === 'fsm' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Support Ticket FSM Card */}
          <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#111827' }}>
              🎫 Support Ticket Finite State Machine (workflow_engine.py)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 1.25rem 0' }}>
              Strict state transition engine enforcing valid lifecycle paths for support tickets.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              {[
                { name: 'Open', color: '#3b82f6', bg: '#eff6ff' },
                { name: 'Assigned', color: '#8b5cf6', bg: '#f5f3ff' },
                { name: 'In Progress', color: '#d97706', bg: '#fffbeb' },
                { name: 'Waiting Customer / Internal', color: '#0284c7', bg: '#f0f9ff' },
                { name: 'Resolved', color: '#16a34a', bg: '#f0fdf4' },
                { name: 'Closed', color: '#475569', bg: '#f8fafc' },
              ].map((st, i, arr) => (
                <div key={st.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}`, padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem' }}>
                    {st.name}
                  </div>
                  {i < arr.length - 1 && <span style={{ color: '#94a3b8', fontWeight: 'bold' }}>➡️</span>}
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1rem', background: '#eff6ff', borderLeft: '4px solid #3b82f6', padding: '0.75rem 1rem', borderRadius: '0 0.5rem 0.5rem 0', fontSize: '0.75rem', color: '#1e40af' }}>
              <strong>Reopen Flow:</strong> Tickets in <code>Closed</code> state can transition back to <code>Reopened</code> only if the user possesses <code>CAN_REOPEN_TICKET</code> permission.
            </div>
          </div>

          {/* Dispute FSM Card */}
          <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#111827' }}>
              ⚖️ Dispute & Refund Finite State Machine (workflow_engine.py)
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 1.25rem 0' }}>
              Order & Booking Dispute state flow integrated with <code>ActionExecutor</code> & financial refund records.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', background: '#fafaf9', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e7e5e4' }}>
              {[
                { name: 'Created', color: '#3b82f6', bg: '#eff6ff' },
                { name: 'Under Review', color: '#8b5cf6', bg: '#f5f3ff' },
                { name: 'Evidence Pending', color: '#d97706', bg: '#fffbeb' },
                { name: 'Escalated', color: '#dc2626', bg: '#fef2f2' },
                { name: 'Approved / Rejected', color: '#059669', bg: '#ecfdf5' },
                { name: 'Refund Initiated', color: '#2563eb', bg: '#eff6ff' },
                { name: 'Refund Completed', color: '#16a34a', bg: '#f0fdf4' },
                { name: 'Closed', color: '#475569', bg: '#f8fafc' },
              ].map((st, i, arr) => (
                <div key={st.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}`, padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem' }}>
                    {st.name}
                  </div>
                  {i < arr.length - 1 && <span style={{ color: '#a8a29e', fontWeight: 'bold' }}>➡️</span>}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* SECTION 3: SLA MATRIX */}
      {activeSubSection === 'sla' && (
        <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#111827' }}>
            ⏱️ Priority SLA Calculations & Due Dates Policy
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 1.25rem 0' }}>
            When a ticket or dispute priority is set or changed, SLA response & resolution deadlines are dynamically calculated.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem', width: '140px' }}>Priority Level</th>
                <th style={{ padding: '0.75rem', width: '180px' }}>First Response Target</th>
                <th style={{ padding: '0.75rem', width: '180px' }}>Full Resolution Target</th>
                <th style={{ padding: '0.75rem' }}>Escalation & Notification Rule</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#dc2626' }}>🔴 Critical</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>1 Hour</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>4 Hours</td>
                <td style={{ padding: '0.75rem', color: '#475569' }}>Auto-notifies Support Manager & triggers immediate high-priority SMS/Email.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#ea580c' }}>🟠 High</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>2 Hours</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>8 Hours</td>
                <td style={{ padding: '0.75rem', color: '#475569' }}>Assigned to dedicated agent queue within 15 minutes.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#d97706' }}>🟡 Medium</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>4 Hours</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>24 Hours</td>
                <td style={{ padding: '0.75rem', color: '#475569' }}>Standard ticket queue assignment.</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#16a34a' }}>🟢 Low</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>8 Hours</td>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>48 Hours</td>
                <td style={{ padding: '0.75rem', color: '#475569' }}>Low priority inquiry handling.</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* SECTION 4: RBAC MATRIX */}
      {activeSubSection === 'rbac' && (
        <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#111827' }}>
            🔐 Role-Based Access Control (RBAC) Matrix (permissions.py)
          </h3>
          <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0 0 1.25rem 0' }}>
            Access permissions enforced across tickets, dispute actions, internal notes, and refund disbursements.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.75rem' }}>Role</th>
                <th style={{ padding: '0.75rem' }}>Ticket Rights</th>
                <th style={{ padding: '0.75rem' }}>Dispute Rights</th>
                <th style={{ padding: '0.75rem' }}>Internal Notes</th>
                <th style={{ padding: '0.75rem' }}>Refund Rights</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Customer</td>
                <td style={{ padding: '0.75rem' }}>View Own, Create, Close, Reopen</td>
                <td style={{ padding: '0.75rem' }}>View Own, Create</td>
                <td style={{ padding: '0.75rem', color: '#ef4444' }}>❌ Forbidden</td>
                <td style={{ padding: '0.75rem', color: '#ef4444' }}>❌ No</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Seller</td>
                <td style={{ padding: '0.75rem' }}>View Own, Create, Close, Reopen</td>
                <td style={{ padding: '0.75rem' }}>View Own, Create</td>
                <td style={{ padding: '0.75rem', color: '#ef4444' }}>❌ Forbidden</td>
                <td style={{ padding: '0.75rem', color: '#ef4444' }}>❌ No</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Mechanic</td>
                <td style={{ padding: '0.75rem' }}>View Own, Create, Close</td>
                <td style={{ padding: '0.75rem' }}>View Own, Create</td>
                <td style={{ padding: '0.75rem', color: '#ef4444' }}>❌ Forbidden</td>
                <td style={{ padding: '0.75rem', color: '#ef4444' }}>❌ No</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Support Agent</td>
                <td style={{ padding: '0.75rem' }}>View All, Create, Update, Assign</td>
                <td style={{ padding: '0.75rem' }}>View All, Escalate</td>
                <td style={{ padding: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✅ Read & Post</td>
                <td style={{ padding: '0.75rem', color: '#ef4444' }}>❌ No</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Support Manager</td>
                <td style={{ padding: '0.75rem' }}>Full Ticket Control</td>
                <td style={{ padding: '0.75rem' }}>Resolve, Reject, Escalate</td>
                <td style={{ padding: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✅ Full Control</td>
                <td style={{ padding: '0.75rem', color: '#2563eb', fontWeight: 700 }}>🟡 Initiate Refund</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Finance</td>
                <td style={{ padding: '0.75rem' }}>View Tickets</td>
                <td style={{ padding: '0.75rem' }}>View Disputes</td>
                <td style={{ padding: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✅ Read Notes</td>
                <td style={{ padding: '0.75rem', color: '#16a34a', fontWeight: 700 }}>✅ Initiate & Complete</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#0f172a' }}>Admin / Super Admin</td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#16a34a' }}>Full Access</td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#16a34a' }}>Full Access</td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#16a34a' }}>Full Access</td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: '#16a34a' }}>Full Access</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* SECTION 5: OUTBOX WORKER */}
      {activeSubSection === 'outbox' && (
        <div style={{ background: '#fff', borderRadius: '0.75rem', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#111827' }}>
                ⚙️ Background Outbox Worker (outbox_worker.py)
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>
                Transactional Outbox Pattern for reliable asynchronous notification & event publishing.
              </p>
            </div>
            <span style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '4px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>
              🟢 Worker Running
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Batch Size</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>20 Events</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Outbox Queue</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#2563eb', marginTop: '2px' }}>SupportOutbox</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Max Retries</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>5 Retries</div>
            </div>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Status States</div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginTop: '6px' }}>PENDING ➡️ PROCESSED ➡️ FAILED</div>
            </div>
          </div>

          <div style={{ background: '#0f172a', color: '#38bdf8', padding: '1rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.75rem', lineHeight: '1.5' }}>
            <div>[INFO] OutboxWorker initialized. Polling table `support_outbox`...</div>
            <div>[EXEC] process_outbox_events() - Batch 20 pending events retrieved.</div>
            <div>[EVENT] TicketCreated (TKT-20260725-0914) -&gt; Dispatched email to customer &amp; assigned agent.</div>
            <div>[EVENT] DisputeCreated (STM834849) -&gt; Outbox record status updated to PROCESSED.</div>
            <div>[STATUS] Queue clear. 0 FAILED records. Retry counter reset.</div>
          </div>
        </div>
      )}

    </div>
  );
}
