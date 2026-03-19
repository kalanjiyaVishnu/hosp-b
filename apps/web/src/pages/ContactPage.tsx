import hospitalConfig from '@/config/hospital.config.json';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="flex flex-col">
      <section className="bg-primary py-24 text-white text-center">
        <div className="container">
          <h1 className="text-4xl md:text-6xl font-bold">Contact Us</h1>
          <p className="mt-4 text-xl opacity-80">We are here to help you 24/7</p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container grid grid-cols-1 md:grid-cols-2 gap-16">
          <div className="space-y-12">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Get In Touch</h2>
              <p className="text-slate-600">Have questions about our services or need to book an appointment? Reach out to us through any of the channels below.</p>
            </div>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary"><MapPin /></div>
                <div><h4 className="font-bold">Address</h4><p className="text-sm text-slate-500">{hospitalConfig.address.street}, {hospitalConfig.address.city}, {hospitalConfig.address.state} - {hospitalConfig.address.zip}</p></div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary"><Phone /></div>
                <div><h4 className="font-bold">Phone</h4><p className="text-sm text-slate-500">{hospitalConfig.contact.phone}</p><p className="text-sm text-secondary font-bold">Emergency: {hospitalConfig.contact.emergency}</p></div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/5 flex items-center justify-center text-primary"><Mail /></div>
                <div><h4 className="font-bold">Email</h4><p className="text-sm text-slate-500">{hospitalConfig.contact.email}</p></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-8 rounded-2xl border">
            <form className="space-y-6">
              <div className="space-y-2"><Label htmlFor="name">Full Name</Label><Input id="name" placeholder="John Doe" /></div>
              <div className="space-y-2"><Label htmlFor="email">Email Address</Label><Input id="email" type="email" placeholder="john@example.com" /></div>
              <div className="space-y-2"><Label htmlFor="subject">Subject</Label><Input id="subject" placeholder="Appointment Inquiry" /></div>
              <div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" placeholder="How can we help you?" className="h-32" /></div>
              <Button className="w-full h-12">Send Message</Button>
            </form>
          </div>
        </div>
      </section>

      <div className="h-[400px] w-full bg-slate-200">
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.48884635697!2d80.2424803148229!3d13.0601!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a526610dd430e37%3A0xcb3294c7ba66270b!2sChennai%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1647690000000!5m2!1sen!2sin" width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"></iframe>
      </div>
    </div>
  );
};

export default ContactPage;
