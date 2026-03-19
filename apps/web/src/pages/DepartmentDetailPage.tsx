import { useParams, Link } from 'react-router-dom';
import hospitalConfig from '@/config/hospital.config.json';
import doctorsConfig from '@/config/doctors.config.json';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Stethoscope, Clock, CheckCircle2 } from 'lucide-react';

const DepartmentDetailPage = () => {
  const { id } = useParams();
  const department = hospitalConfig.departments.find(d => d.id === id);
  const deptDoctors = doctorsConfig.doctors.filter(doc => doc.department === id);

  if (!department) return <div>Department not found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary/5 py-12">
        <div className="container space-y-4">
          <Link to="/departments" className="inline-flex items-center text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Departments</Link>
          <h1 className="text-4xl font-bold">{department.name}</h1>
          <p className="text-slate-600 max-w-2xl">{department.description}</p>
        </div>
      </section>

      <section className="py-16">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Services & Specializations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Emergency Care', 'Inpatient Facility', 'Surgical Suites', 'Diagnostic Imaging', 'Therapeutic Care', 'Support Services'].map((s, i) => (
                  <div key={i} className="flex items-center p-4 bg-slate-50 rounded-lg"><CheckCircle2 className="mr-3 h-5 w-5 text-primary" /> <span className="font-medium">{s}</span></div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Our Specialists in {department.name}</h2>
              <div className="grid grid-cols-1 gap-4">
                {deptDoctors.map((doc, i) => (
                  <Card key={i} className="flex flex-col md:flex-row gap-6 p-6 items-center">
                    <img src={doc.photo} alt={doc.name} className="w-24 h-24 rounded-full bg-slate-200 object-cover" />
                    <div className="flex-grow space-y-1 text-center md:text-left">
                      <h4 className="text-lg font-bold">{doc.name}</h4>
                      <p className="text-sm text-primary font-medium">{doc.specialization}</p>
                      <p className="text-sm text-slate-500">{doc.qualifications.join(', ')}</p>
                    </div>
                    <Link to={`/doctors/${doc.id}`}><Button>View Profile</Button></Link>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="bg-slate-900 text-white">
              <CardHeader><CardTitle className="text-xl">Available 24/7</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-slate-400">For any emergency cases related to {department.name}, please contact our emergency helpline.</p>
                <div className="flex items-center gap-3 text-secondary text-2xl font-bold"><Clock /> 108</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DepartmentDetailPage;
