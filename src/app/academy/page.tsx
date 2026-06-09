import PageHeader from '@/components/ui/PageHeader';

export default function AcademyPage() {
  const courses = [
    { id: 'c1', title: 'Basic Sewing Machine Repair', instructor: 'Ramesh Kumar', enrollments: 340, status: 'Published', category: 'Beginner' },
    { id: 'c2', title: 'Industrial Machine Servicing', instructor: 'Vijay Pandey', enrollments: 210, status: 'Published', category: 'Advanced' },
    { id: 'c3', title: 'Overlock Machine Mastery', instructor: 'Ajay Nair', enrollments: 98, status: 'Draft', category: 'Intermediate' },
  ];

  return (
    <div>
      <PageHeader title="Sewtech Academy" subtitle="Manage courses and training for mechanics and users" actions={<button className="btn btn-dark">+ Create Course</button>} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="card"><div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Total Courses</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{courses.length}</div></div>
        <div className="card"><div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981' }}>Published</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{courses.filter(c => c.status === 'Published').length}</div></div>
        <div className="card"><div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6b7280' }}>Total Enrollments</div><div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{courses.reduce((s, c) => s + c.enrollments, 0)}</div></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1rem' }}>
        {courses.map(c => (
          <div key={c.id} className="card" style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span style={{ background: '#e0e7ff', color: '#6366f1', padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>{c.category}</span>
              <span style={{ background: c.status === 'Published' ? '#dcfce7' : '#f1f5f9', color: c.status === 'Published' ? '#15803d' : '#475569', padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 600 }}>{c.status}</span>
            </div>
            <h3 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '1rem' }}>{c.title}</h3>
            <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.75rem' }}>by {c.instructor}</p>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#6366f1' }}>👥 {c.enrollments} enrolled</div>
          </div>
        ))}
      </div>
    </div>
  );
}
