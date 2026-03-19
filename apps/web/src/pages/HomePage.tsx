import hospitalConfig from '@/config/hospital.config.json';
import doctorsConfig from '@/config/doctors.config.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Brain, Bone, Baby, Microscope, Stethoscope, ArrowRight, Shield, Clock, Award, Star, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, any> = { Heart, Brain, Bone, Baby, Microscope, Stethoscope };

const HeroSection = () => (
  <section className="relative h-[80vh] flex items-center bg-slate-50 overflow-hidden">
    <div className="container relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
          {hospitalConfig.name} <br/>
          <span className="text-primary font-serif italic text-4xl md:text-5xl">Where Care Meets Excellence</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-lg">{hospitalConfig.tagline}</p>
        <div className="flex flex-wrap gap-4 pt-4">
          <Link to="/doctors"><Button size="lg" className="h-12 px-8">Book Appointment</Button></Link>
          <Link to="/contact"><Button size="lg" variant="outline" className="h-12 px-8">Emergency Contact</Button></Link>
        </div>
      </div>
      <div className="hidden md:block relative">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl"></div>
        <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000" alt="Hospital" className="rounded-2xl shadow-2xl relative z-10 w-full object-cover h-[500px]" />
      </div>
    </div>
  </section>
);

const StatsSection = () => (
  <section className="py-12 bg-primary text-white">
    <div className="container grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {hospitalConfig.stats.map((stat, i) => (
        <div key={i} className="space-y-2">
          <div className="text-3xl md:text-5xl font-bold">{stat.value}</div>
          <div className="text-sm md:text-base opacity-80 uppercase tracking-widest">{stat.label}</div>
        </div>
      ))}
    </div>
  </section>
);

const DepartmentsSection = () => (
  <section className="py-24 bg-white">
    <div className="container space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold font-serif">Medical Specialities</h2>
        <p className="text-slate-500 max-w-2xl mx-auto">World-class healthcare across multiple disciplines.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {hospitalConfig.departments.map((dept, i) => {
          const IconComp = iconMap[dept.icon] || Stethoscope;
          return (
            <Card key={i} className="group hover:border-primary transition-all duration-300">
              <CardContent className="p-8 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                  <IconComp className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">{dept.name}</h3>
                <p className="text-sm text-slate-500 line-clamp-2">{dept.description}</p>
                <Link to={`/departments/${dept.id}`} className="text-primary text-sm font-semibold inline-flex items-center hover:underline">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  </section>
);

const DoctorsSection = () => (
  <section className="py-24 bg-slate-50">
    <div className="container space-y-12">
      <div className="flex justify-between items-end">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold font-serif">Our Expert Doctors</h2>
          <p className="text-slate-500">Meet our highly qualified medical professionals.</p>
        </div>
        <Link to="/doctors"><Button variant="outline">View All Specialists</Button></Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {doctorsConfig.doctors.slice(0, 4).map((doc, i) => (
          <Card key={i} className="group overflow-hidden">
            <div className="relative h-64 overflow-hidden bg-slate-200">
               <img src={doc.photo} alt={doc.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <CardContent className="p-6 text-center space-y-2">
              <h4 className="font-bold text-lg">{doc.name}</h4>
              <p className="text-xs text-primary font-black uppercase tracking-widest">{doc.specialization}</p>
              <p className="text-xs text-slate-400 italic">{doc.qualifications.join(", ")}</p>
              <div className="pt-4"><Link to={`/doctors/${doc.id}`}><Button variant="secondary" size="sm" className="w-full">View Profile</Button></Link></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const FeaturesSection = () => (
  <section className="py-24 bg-white">
    <div className="container grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
      <div className="space-y-8">
        <h2 className="text-4xl font-bold leading-tight font-serif">Why Choose MediCare?</h2>
        <div className="space-y-6">
          <FeatureItem icon={Shield} title="Patient First Protocol" desc="We maintain international standards for safety and sanitization." />
          <FeatureItem icon={Clock} title="24/7 Emergency Support" desc="Immediate care available with our state-of-the-art trauma center." />
          <FeatureItem icon={Award} title="Digital Health Records" desc="Access your medical history and reports online anytime." />
        </div>
      </div>
      <div className="relative">
        <img src="https://images.unsplash.com/photo-1505751172157-c728583b71fb?auto=format&fit=crop&q=80&w=600" alt="Hospital View" className="rounded-2xl shadow-xl" />
        <div className="absolute -bottom-6 -left-6 bg-primary text-white p-6 rounded-xl shadow-xl space-y-1">
          <div className="text-3xl font-black">25+</div>
          <div className="text-xs uppercase tracking-widest opacity-80">Years Excellence</div>
        </div>
      </div>
    </div>
  </section>
);

const FeatureItem = ({ icon: Icon, title, desc }: any) => (
  <div className="flex gap-4">
    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary shadow-sm"><Icon className="h-6 w-6" /></div>
    <div className="space-y-1"><h4 className="font-bold">{title}</h4><p className="text-sm text-slate-500 leading-relaxed">{desc}</p></div>
  </div>
);

const FacilitiesSection = () => (
  <section className="py-24 bg-slate-900 text-white overflow-hidden">
    <div className="container space-y-12">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold font-serif">Our Facilities</h2>
        <p className="text-slate-400">Advanced medical infrastructure for comprehensive care.</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {hospitalConfig.facilities.map((f, i) => (
          <div key={i} className="p-8 border border-white/10 rounded-xl text-center hover:bg-white/5 transition-colors">
            <h5 className="font-bold text-sm tracking-widest uppercase">{f}</h5>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const TestimonialsSection = () => (
  <section className="py-24 bg-white">
    <div className="container space-y-12">
      <h2 className="text-4xl font-bold text-center font-serif">Patient Experiences</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {hospitalConfig.testimonials?.map((t: any, i: number) => (
          <Card key={i} className="border-none bg-slate-50 p-8">
            <CardContent className="p-0 space-y-4 italic text-slate-600">
              <div className="flex gap-1 text-yellow-500 mb-4">{Array(t.rating).fill(0).map((_, idx) => <Star key={idx} className="h-4 w-4 fill-current" />)}</div>
              "{t.comment}"
              <div className="flex items-center gap-4 pt-4 not-italic">
                <div className="w-10 h-10 rounded-full bg-slate-200" />
                <div><h5 className="font-bold text-slate-900">{t.name}</h5><p className="text-xs text-slate-400">{t.role}</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  </section>
);

const ContactSection = () => (
  <section className="py-24 bg-slate-50">
    <div className="container">
       <div className="bg-white rounded-3xl p-8 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-16 shadow-lg border border-slate-100">
          <div className="space-y-8">
            <h2 className="text-4xl font-bold font-serif">Get in Touch</h2>
            <div className="space-y-6">
               <ContactInfo icon={Phone} title="Emergency No." detail={hospitalConfig.contact.emergency} primary />
               <ContactInfo icon={Phone} title="General Inquiry" detail={hospitalConfig.contact.phone} />
               <ContactInfo icon={Mail} title="Email Address" detail={hospitalConfig.contact.email} />
               <ContactInfo icon={MapPin} title="Our Location" detail={`${hospitalConfig.address.street}, ${hospitalConfig.address.city}`} />
            </div>
          </div>
          <div className="bg-slate-50 rounded-2xl p-8 space-y-6">
             <h4 className="font-bold text-xl">Send a Message</h4>
             <div className="grid grid-cols-2 gap-4"><input className="p-3 border rounded-lg bg-white" placeholder="Name" /><input className="p-3 border rounded-lg bg-white" placeholder="Email" /></div>
             <input className="w-full p-3 border rounded-lg bg-white" placeholder="Subject" />
             <textarea className="w-full p-3 border rounded-lg bg-white h-32" placeholder="Message" />
             <Button className="w-full h-12">Submit Message</Button>
          </div>
       </div>
    </div>
  </section>
);

const ContactInfo = ({ icon: Icon, title, detail, primary }: any) => (
  <div className="flex items-start gap-4">
    <div className={`p-3 rounded-lg ${primary ? 'bg-red-100 text-red-600' : 'bg-primary/5 text-primary'}`}><Icon className="h-5 w-5" /></div>
    <div><h6 className="text-xs font-bold uppercase tracking-widest text-slate-400">{title}</h6><p className="text-lg font-bold text-slate-900">{detail}</p></div>
  </div>
);

const HomePage = () => {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <StatsSection />
      <DepartmentsSection />
      <DoctorsSection />
      <FeaturesSection />
      <FacilitiesSection />
      <TestimonialsSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
