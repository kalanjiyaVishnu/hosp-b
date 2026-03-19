import hospitalConfig from '@/config/hospital.config.json';
import doctorsConfig from '@/config/doctors.config.json';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stethoscope, Calendar, GraduationCap, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

const DoctorsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');

  const filteredDoctors = doctorsConfig.doctors.filter(doc => (
    (selectedDept === 'all' || doc.department === selectedDept) &&
    (doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || doc.specialization.toLowerCase().includes(searchTerm.toLowerCase()))
  ));

  return (
    <div className="flex flex-col">
      <section className="bg-slate-900 py-16 text-white text-center">
        <div className="container space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold font-serif">Meet Our Specialists</h1>
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row gap-4">
            <Input placeholder="Search doctor by name..." className="h-10 bg-slate-800 border-slate-700 text-white" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <select className="h-10 px-4 rounded-md bg-slate-800 border-slate-700 border text-white text-sm" value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}>
              <option value="all">All Departments</option>
              {hospitalConfig.departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white"><div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">{filteredDoctors.map((doc, i) => (
            <Card key={i} className="hover:shadow-lg transition-all border-slate-100 p-6 space-y-4">
              <img src={doc.photo} alt={doc.name} className="w-24 h-24 rounded-full bg-slate-200 object-cover" />
              <div className="space-y-1"><h3 className="text-xl font-bold">{doc.name}</h3><p className="text-sm text-secondary font-medium">{doc.specialization}</p></div>
              <div className="text-sm text-slate-500 space-y-1"><div className="flex items-center"><GraduationCap className="h-4 w-4 mr-2" /> {doc.qualifications.join(', ')}</div><div className="flex items-center"><Calendar className="h-4 w-4 mr-2" /> {doc.availableDays.join(', ')}</div></div>
              <div className="pt-4 border-t flex items-center justify-between"><div className="text-lg font-bold">₹{doc.consultationFee}</div><Link to={`/doctors/${doc.id}`}><Button size="sm">View Profile</Button></Link></div>
            </Card>))}</div></section>
    </div>
  );
};
export default DoctorsPage;
