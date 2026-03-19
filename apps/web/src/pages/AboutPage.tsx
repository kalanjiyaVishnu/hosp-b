import hospitalConfig from '@/config/hospital.config.json';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Users, History, ShieldAlert } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="flex flex-col">
      <section className="bg-slate-900 py-24 text-white text-center">
        <div className="container space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">About {hospitalConfig.name}</h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">{hospitalConfig.tagline}</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <img src="https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&q=80&w=800" alt="Hospital interior" className="rounded-2xl shadow-xl" />
          <div className="space-y-8">
            <h2 className="text-3xl font-bold">A Legacy of Care Since {hospitalConfig.established}</h2>
            <p className="text-slate-600">Established in {hospitalConfig.established}, over the last 25 years, {hospitalConfig.name} has grown to become a beacon of hope and healing. Our commitment to excellence is reflected in our state-of-the-art facilities and our team of world-renowned specialists.</p>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Target className="h-8 w-8 text-primary" />
                <h4 className="font-bold">Our Mission</h4>
                <p className="text-sm text-slate-500">To provide compassionate, comprehensive, and patient-centered healthcare.</p>
              </div>
              <div className="space-y-2">
                <Users className="h-8 w-8 text-secondary" />
                <h4 className="font-bold">Our Vision</h4>
                <p className="text-sm text-slate-500">To be the most trusted healthcare provider globally through innovation and ethics.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50">
        <div className="container space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Excellence', 'Compassion', 'Integrity', 'Innovation'].map((v, i) => (
              <Card key={i} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <h3 className="text-xl font-bold text-primary">{v}</h3>
                  <p className="text-sm text-slate-500">Adhering to the highest standards of medical ethics and clinical behavior.</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
