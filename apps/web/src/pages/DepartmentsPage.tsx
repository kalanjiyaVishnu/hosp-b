import hospitalConfig from '@/config/hospital.config.json';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Brain, Bone, Baby, Microscope, Stethoscope, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const iconMap: Record<string, any> = { Heart, Brain, Bone, Baby, Microscope, Stethoscope };

const DepartmentsPage = () => {
  return (
    <div className="flex flex-col">
      <section className="bg-slate-900 py-24 text-white text-center">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-bold font-serif">Our Specialized Departments</h1>
          <p className="mt-4 text-xl text-slate-400">Advanced medical care with leading-edge technology</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {hospitalConfig.departments.map((dept, i) => {
            const IconComp = iconMap[dept.icon] || Stethoscope;
            return (
              <Card key={i} className="group hover:shadow-lg transition-all border-slate-100">
                <CardHeader>
                  <div className="mb-4 w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary"><IconComp /></div>
                  <CardTitle className="text-2xl font-bold">{dept.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-slate-500 line-clamp-3">{dept.description}</p>
                  <ul className="space-y-2 text-sm text-slate-600">
                    <li className="flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-secondary" /> 24/7 Specialist Availability</li>
                    <li className="flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-secondary" /> Advanced Diagnostic Lab</li>
                    <li className="flex items-center"><ArrowRight className="h-3 w-3 mr-2 text-secondary" /> Personalized Treatment Plans</li>
                  </ul>
                  <Link to={`/departments/${dept.id}`}>
                    <Button variant="outline" className="w-full mt-4">View Department <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default DepartmentsPage;
