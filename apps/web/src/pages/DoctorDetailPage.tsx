import { useParams, Link } from 'react-router-dom';
import doctorsConfig from '@/config/doctors.config.json';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stethoscope, GraduationCap, MapPin, Calendar, Clock, ArrowLeft } from 'lucide-react';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const doc = doctorsConfig.doctors.find(d => d.id === id);

  if (!doc) return <div>Doctor not found</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <section className="bg-primary/5 py-12">
        <div className="container space-y-4">
          <Link to="/doctors" className="inline-flex items-center text-primary hover:underline"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Doctors</Link>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <img src={doc.photo} alt={doc.name} className="w-56 h-56 rounded-2xl bg-slate-200 object-cover shadow-lg" />
            <div className="flex-grow space-y-4 text-center md:text-left">
              <div className="space-y-1">
                <Badge variant="secondary" className="mb-2 uppercase tracking-wider">{doc.department}</Badge>
                <h1 className="text-4xl font-bold">{doc.name}</h1>
                <p className="text-xl text-primary font-medium">{doc.specialization}</p>
              </div>
              <div className="flex flex-wrap gap-6 justify-center md:justify-start text-slate-500">
                <div className="flex items-center"><GraduationCap className="h-4 w-4 mr-2" /> {doc.qualifications.join(', ')}</div>
                <div className="flex items-center"><Stethoscope className="h-4 w-4 mr-2" /> {doc.experience} Years Experience</div>
                <div className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> Main Campus</div>
              </div>
              <div className="pt-4 flex flex-wrap gap-4 justify-center md:justify-start">
                <Link to={`/book/${doc.id}`}><Button size="lg" className="h-12 px-8">Book Appointment</Button></Link>
                <Button size="lg" variant="outline" className="h-12 px-8">Questions?</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-serif">Biography</h2>
              <p className="text-slate-600 leading-relaxed text-lg">{doc.bio}</p>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-6">
                <h3 className="font-bold flex items-center"><Calendar className="mr-2 h-5 w-5 text-primary" /> Working Hours</h3>
                <div className="space-y-3">
                  {doc.availableDays.map((day, i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b last:border-0 border-slate-100">
                      <span className="font-semibold text-slate-700">{day}</span>
                      <span className="text-slate-500">9:00 AM - 6:00 PM</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex justify-between items-center"><span className="text-sm font-semibold">Consultation Fee:</span> <span className="text-xl font-bold text-primary">₹{doc.consultationFee}</span></div>
                  <div className="flex justify-between items-center"><span className="text-sm font-semibold">Duration:</span> <span className="text-sm text-slate-500">{doc.slotDuration} Min</span></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DoctorDetailPage;
