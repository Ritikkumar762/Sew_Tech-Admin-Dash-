import PageHeader from '@/components/ui/PageHeader';

const sections = [
  { title: 'General', settings: [{ label: 'Platform Name', value: 'Sewtech Mart', type: 'text' }, { label: 'Support Email', value: 'support@sewtech.in', type: 'text' }, { label: 'Currency', value: 'INR (₹)', type: 'select' }] },
  { title: 'Notifications', settings: [{ label: 'Email Alerts', value: 'Enabled', type: 'toggle' }, { label: 'SMS Alerts', value: 'Enabled', type: 'toggle' }, { label: 'Push Notifications', value: 'Disabled', type: 'toggle' }] },
  { title: 'Security', settings: [{ label: 'Two-Factor Auth', value: 'Disabled', type: 'toggle' }, { label: 'Session Timeout', value: '30 minutes', type: 'select' }] },
];

export default function SettingsPage() {
  return (
    <div>
      <PageHeader title="System & Settings" subtitle="Configure platform-wide settings" actions={<button className="btn btn-dark">Save Changes</button>} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sections.map(section => (
          <div key={section.title} className="card">
            <h2 style={{ fontWeight: 700, marginBottom: '1rem', fontSize: '1rem' }}>{section.title}</h2>
            {section.settings.map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.875rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontWeight: 500 }}>{s.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  {s.type === 'toggle' ? (
                    <div style={{ width: '44px', height: '24px', borderRadius: '99px', background: s.value === 'Enabled' ? '#6366f1' : '#e5e7eb', cursor: 'pointer', position: 'relative' }}>
                      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'white', position: 'absolute', top: '3px', left: s.value === 'Enabled' ? '23px' : '3px', transition: 'left 0.2s' }} />
                    </div>
                  ) : null}
                  <span style={{ fontSize: '0.875rem', color: '#374151', fontWeight: 500 }}>{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
