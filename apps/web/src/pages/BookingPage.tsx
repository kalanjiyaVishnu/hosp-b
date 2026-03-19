import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bookingSchema } from 'shared';
import doctorsConfig from '@/config/doctors.config.json';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import apiClient from '@/services/apiClient';
import { useQuery } from '@tanstack/react-query';
import { format, addDays, isSameDay } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Stethoscope, CheckCircle, ShieldCheck, MapPin, CreditCard, ChevronRight, ChevronLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const BookingPage = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlot, setSelectedSlot] = useState('');
  const [bookingId, setBookingId] = useState('');

  const doc = doctorsConfig.doctors.find(d => d.id === doctorId);
  if (!doc) return <div className="p-24 text-center text-red-500 font-bold">Doctor Profile Not Found</div>;

  const { data: slots, isLoading: loadingSlots } = useQuery({
    queryKey: ['slots', doctorId, format(selectedDate, 'yyyy-MM-dd')],
    queryFn: async () => {
      const { data } = await apiClient.get(`/doctors/${doctorId}/slots?date=${format(selectedDate, 'yyyy-MM-dd')}`);
      return data.data;
    },
    enabled: !!doctorId && !!selectedDate
  });

  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: { doctorId, slotDate: '', slotTime: '', reason: '', notes: '' }
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await apiClient.post('/bookings', { 
        ...data, 
        slotDate: format(selectedDate, 'yyyy-MM-dd'), 
        slotTime: selectedSlot 
      });
      setBookingId(res.data.data.id);
      setStep(5);
    } catch (err: any) {
      toast({ title: "Booking Failed", description: err.response?.data?.message || 'Error creating appointment', variant: "destructive" });
    }
  };

  const nextStep = () => { 
    if (step === 1 && selectedDate) setStep(2); 
    else if (step === 2 && selectedSlot) setStep(3); 
    else if (step === 3) setStep(4);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="py-24 bg-slate-50 min-h-[90vh]">
      <div className="container max-w-4xl mx-auto space-y-8 px-4">
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center max-w-md mx-auto h-2 mb-16 relative">
           <div className="absolute inset-0 bg-slate-200 rounded-full" />
           <div className="absolute inset-0 bg-primary rounded-full transition-all duration-500" style={{ width: `${(step-1) * 25}%` }} />
           {[1, 2, 3, 4, 5].map(s => (
             <div key={s} className={`w-8 h-8 rounded-full z-10 flex items-center justify-center text-[10px] font-black tracking-tighter transition-all duration-300 ${step >= s ? 'bg-primary text-white shadow-lg' : 'bg-white text-slate-400 border-2 border-slate-100'}`}>
                {step > s ? <CheckCircle className="h-4 w-4" /> : s}
             </div>
           ))}
        </div>

        {step === 1 && (
          <Card className="shadow-2xl border-none overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <CardHeader className="text-center p-10 bg-white border-b border-slate-50 italic">
               <CardTitle className="text-3xl font-black font-serif">Pick a Date</CardTitle>
               <CardDescription className="text-slate-400 uppercase tracking-widest font-bold text-xs">Step 1: Scheduling your clinical visit</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                     <h4 className="font-bold flex items-center text-primary uppercase tracking-widest text-[10px]"><CalendarIcon className="mr-2 h-4 w-4" /> Available Days</h4>
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[0, 1, 2, 3, 4, 5, 6].map(i => {
                           const d = addDays(new Date(), i);
                           const dayName = format(d, 'EEEE');
                           const isAvailable = doc.availableDays.includes(dayName);
                           return (
                             <button key={i} disabled={!isAvailable} onClick={() => setSelectedDate(d)} className={`p-4 rounded-2xl border-2 text-center transition-all ${isSameDay(d, selectedDate) ? 'bg-primary text-white border-primary shadow-xl ring-8 ring-primary/5 -translate-y-1 scale-105' : isAvailable ? 'bg-white hover:border-primary/50 text-slate-700' : 'bg-slate-50 text-slate-300 opacity-50 cursor-not-allowed border-slate-100'}`}>
                                <span className="block text-[10px] uppercase font-black tracking-tighter">{format(d, 'EEE')}</span>
                                <span className="block text-2xl font-black">{format(d, 'd')}</span>
                             </button>
                           );
                        })}
                     </div>
                  </div>
                  <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 space-y-6">
                     <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-white border shadow-sm p-1"><img src={doc.photo} alt={doc.name} className="w-full h-full object-cover rounded-xl" /></div>
                        <div><h4 className="font-extrabold text-xl text-slate-800">{doc.name}</h4><p className="text-xs font-bold text-primary italic uppercase tracking-widest">{doc.specialization}</p></div>
                     </div>
                     <div className="bg-white p-4 rounded-xl text-center space-y-1"><h6 className="text-[10px] font-black uppercase text-slate-400">Selected Reservation Date</h6><p className="font-black text-slate-900">{format(selectedDate, 'EEEE, dd MMMM yyyy')}</p></div>
                  </div>
               </div>
               <Button size="lg" className="w-full h-16 text-lg font-black tracking-widest uppercase transition-all hover:shadow-2xl hover:scale-[1.01]" onClick={nextStep} disabled={!selectedDate}>Select Time Slot <ChevronRight className="ml-2 h-6 w-6" /></Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-2xl border-none overflow-hidden animate-in fade-in slide-in-from-right-4">
            <CardHeader className="text-center p-10 bg-white border-b border-slate-50 italic">
               <CardTitle className="text-3xl font-black font-serif">Choose Your Slot</CardTitle>
               <CardDescription className="text-slate-400 uppercase tracking-widest font-bold text-xs">For {format(selectedDate, 'PPP')}</CardDescription>
            </CardHeader>
            <CardContent className="p-10 flex flex-col items-center">
              {loadingSlots ? (
                <div className="p-20 text-slate-400 italic">Reading clinic schedules...</div>
              ) : slots === undefined ? (
                <div className="p-16 text-center space-y-4 bg-red-50 rounded-3xl border border-dashed border-red-100">
                   <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-sm italic font-serif text-2xl">!</div>
                   <div className="space-y-1">
                      <p className="font-bold text-red-800 italic">Schedule sync failed.</p>
                      <p className="text-xs text-red-500 font-medium tracking-tight">Please ensure the specialist and date are correctly identified. Try refreshing the page.</p>
                   </div>
                </div>
              ) : slots && slots.length > 0 ? (
                <div className="w-full">
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {slots.map((s: any) => (
                      <button key={s.time} disabled={!s.available} onClick={() => setSelectedSlot(s.time)} className={`p-4 text-xs font-black tracking-widest border-2 rounded-xl transition-all ${selectedSlot === s.time ? 'bg-primary text-white border-primary shadow-xl -translate-y-1' : s.available ? 'bg-white hover:border-primary text-slate-800' : 'bg-slate-50 text-slate-300 cursor-not-allowed opacity-50 border-slate-100'}`}>{s.time}</button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-16 text-center space-y-4 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                   <Clock className="h-12 w-12 mx-auto text-slate-300" />
                   <div className="space-y-1">
                      <p className="font-bold text-slate-600 italic">No schedules found for this specialist on the selected date.</p>
                      <p className="text-xs text-slate-400">Please choose another date or another specialist.</p>
                   </div>
                </div>
              )}
              <div className="flex gap-6 mt-16 w-full max-w-lg">
                 <Button variant="outline" className="flex-1 h-16 font-black uppercase tracking-widest border-2" onClick={prevStep}><ChevronLeft className="mr-2 h-6 w-6" /> Back</Button>
                 <Button className="flex-1 h-16 font-black uppercase tracking-widest shadow-xl" onClick={nextStep} disabled={!selectedSlot}>Fill Details <ChevronRight className="ml-2 h-6 w-6" /></Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="shadow-2xl border-none overflow-hidden animate-in fade-in slide-in-from-right-4">
            <CardHeader className="text-center p-10 bg-white border-b border-slate-50 italic">
               <CardTitle className="text-3xl font-black font-serif">Patient Intake Details</CardTitle>
               <CardDescription className="text-slate-400 uppercase tracking-widest font-bold text-xs">Briefly explain your medical concern</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <div className="max-w-xl mx-auto space-y-8">
                <div className="space-y-4">
                  <div className="space-y-3"><Label className="text-xs font-black uppercase tracking-widest text-slate-400">Primary Medical Concern</Label><Input id="reason" className="h-14 bg-slate-50 border-2" placeholder="e.g. Chronic Back Pain, Post-op Checkup" {...register('reason')} />{errors.reason && <p className="text-xs text-red-500 font-bold">{errors.reason.message as string}</p>}</div>
                  <div className="space-y-3"><Label className="text-xs font-black uppercase tracking-widest text-slate-400">Additional Notes (Optional)</Label><Textarea id="notes" className="bg-slate-50 border-2 h-40 pt-4" placeholder="Mention any specific health history or recent symptoms..." {...register('notes')} /></div>
                </div>
                <div className="flex gap-6"><Button variant="outline" className="flex-1 h-16 font-black uppercase tracking-widest border-2" onClick={prevStep}><ChevronLeft className="mr-2 h-6 w-6" /> Back</Button><Button className="flex-1 h-16 font-black uppercase tracking-widest" onClick={nextStep}>Review Summary <ChevronRight className="ml-2 h-6 w-6" /></Button></div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 4 && (
          <Card className="shadow-2xl border-none overflow-hidden animate-in fade-in slide-in-from-right-4">
            <CardHeader className="text-center p-10 bg-white border-b border-slate-50 italic">
               <CardTitle className="text-3xl font-black font-serif">Review & Confirm</CardTitle>
               <CardDescription className="text-slate-400 uppercase tracking-widest font-bold text-xs">Final verify your appointment details</CardDescription>
            </CardHeader>
            <CardContent className="p-10 space-y-12">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <SummaryItem label="Specialist" value={doc.name} icon={Stethoscope} />
                  <SummaryItem label="Date & Time" value={`${format(selectedDate, 'PPP')} @ ${selectedSlot}`} icon={Clock} />
                  <SummaryItem label="Facility" value="MediCare General" icon={MapPin} />
               </div>
               <div className="p-8 bg-slate-50 rounded-3xl space-y-4 border border-slate-100 font-medium">
                  <h6 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Consultation Reason</h6>
                  <p className="text-slate-800 leading-relaxed italic">"{getValues('reason')}"</p>
               </div>
               <div className="flex items-center gap-4 p-6 bg-primary/5 rounded-2xl text-primary border border-primary/20">
                  <ShieldCheck className="h-10 w-10 flex-shrink-0" /><p className="text-xs font-bold leading-relaxed">By confirming, you agree to our terms of service. You will receive an instant notification once your slot is medically approved by the consultant.</p>
               </div>
               <div className="flex gap-6"><Button variant="outline" className="flex-1 h-16 font-black uppercase tracking-widest border-2" onClick={prevStep}><ChevronLeft className="mr-2 h-6 w-6" /> Back</Button><Button className="flex-1 h-16 font-black uppercase tracking-widest shadow-2xl" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>{isSubmitting ? 'Securing Slot...' : 'Confirm Appointment'}</Button></div>
            </CardContent>
          </Card>
        )}

        {step === 5 && (
          <Card className="shadow-2xl border-none overflow-hidden text-center py-20 px-10 animate-in zoom-in-95 duration-500">
            <CardContent className="space-y-8 flex flex-col items-center">
              <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4 border-8 border-green-50 shadow-inner scale-125"><CheckCircle className="h-12 w-12" /></div>
              <h2 className="text-4xl font-black font-serif">Ticket Secured!</h2>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-1 mb-8"><span className="text-[10px] uppercase font-black tracking-widest text-slate-400">Booking Reservation ID</span><div className="text-xl font-black font-mono tracking-widest text-primary">{bookingId.toUpperCase()}</div></div>
              <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto italic">Your appointment is currently <strong>Pending Approval</strong>. Our medical staff will review the request shortly. Check your email for details.</p>
              <div className="pt-12 flex flex-col md:flex-row gap-4 w-full max-w-md"><Button variant="outline" className="flex-1 h-14 font-black uppercase tracking-widest border-2" onClick={() => navigate('/profile')}>My Dashboard</Button><Button className="flex-1 h-14 font-black uppercase tracking-widest shadow-xl" onClick={() => navigate('/')}>Return Home</Button></div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

const SummaryItem = ({ icon: Icon, label, value }: any) => (
  <div className="p-8 bg-white border-2 border-slate-100 rounded-3xl space-y-4 hover:border-primary transition-colors hover:shadow-lg group">
    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all"><Icon className="h-6 w-6" /></div>
    <div className="space-y-1"><h6 className="text-[10px] font-black uppercase tracking-tight text-slate-400">{label}</h6><p className="font-extrabold text-slate-900 leading-tight">{value}</p></div>
  </div>
);

export default BookingPage;
