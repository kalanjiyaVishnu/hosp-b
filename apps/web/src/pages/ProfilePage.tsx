import { useAuthStore } from '@/stores/authStore';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Calendar, User, CheckCircle2, XCircle, Clock, MapPin, Phone, History, Stethoscope } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: bookings } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: async () => {
      const { data } = await apiClient.get('/bookings/my');
      return data.data;
    }
  });

  const { data: currentBooking } = useQuery({
    queryKey: ['current-booking'],
    queryFn: async () => {
      const { data } = await apiClient.get('/bookings/current');
      return data.data;
    }
  });

  const { data: notifications } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data } = await apiClient.get('/notifications');
      return data.data;
    }
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiClient.delete(`/bookings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['current-booking'] });
      toast({ title: "Booking Cancelled", description: "Your appointment has been cancelled." });
    }
  });

  const statusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED': return <Badge variant="default" className="bg-green-500 font-bold tracking-widest text-[10px] uppercase">Approved</Badge>;
      case 'PENDING': return <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 font-bold tracking-widest text-[10px] uppercase">Pending</Badge>;
      case 'REJECTED': return <Badge variant="destructive" className="font-bold tracking-widest text-[10px] uppercase">Rejected</Badge>;
      case 'COMPLETED': return <Badge variant="outline" className="border-green-500 text-green-500 font-bold tracking-widest text-[10px] uppercase">Completed</Badge>;
      case 'CANCELLED': return <Badge variant="outline" className="font-bold tracking-widest text-[10px] uppercase text-slate-400">Cancelled</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="container space-y-12 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <Card className="w-full md:w-80 shadow-sm overflow-hidden border-none bg-white">
            <CardHeader className="text-center p-8 bg-primary rounded-t-xl text-white">
              <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center text-4xl font-bold border-4 border-white/10 ring-8 ring-white/5">{user?.name[0].toUpperCase()}</div>
              <CardTitle className="font-serif">{user?.name}</CardTitle>
              <CardDescription className="text-white/70 italic capitalize font-bold text-xs tracking-widest">{user?.role}</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 space-y-4 px-6 pb-8">
              <InfoRow icon={User} label="Email Address" value={user?.email} />
              <InfoRow icon={Phone} label="Phone Number" value={user?.phone || 'Not provided'} />
              <InfoRow icon={Calendar} label="Member Since" value="Mar 2024" />
              <div className="pt-4"><Button variant="outline" className="w-full h-11 text-xs font-black uppercase tracking-widest border-2">Edit Profile Settings</Button></div>
            </CardContent>
          </Card>

          <div className="flex-grow space-y-8">
            <Tabs defaultValue="bookings" className="w-full">
              <TabsList className="grid w-full grid-cols-4 h-14 bg-white rounded-xl shadow-sm border p-1.5 mb-8">
                <TabsTrigger value="overview" className="rounded-lg font-bold">Overview</TabsTrigger>
                <TabsTrigger value="bookings" className="rounded-lg font-bold">Bookings</TabsTrigger>
                <TabsTrigger value="current" className="rounded-lg font-bold">Current Slot</TabsTrigger>
                <TabsTrigger value="notifications" className="rounded-lg font-bold relative">
                   Notifications
                   {notifications?.some((n: any) => !n.read) && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                 <h3 className="text-2xl font-bold font-serif">Hello, {user?.name.split(' ')[0]}!</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card><CardContent className="pt-6"><h5 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Total Visits</h5><div className="text-3xl font-black">{bookings?.length || 0}</div></CardContent></Card>
                    <Card><CardContent className="pt-6"><h5 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Next Appointment</h5><div className="text-xl font-bold text-primary">{currentBooking ? format(new Date(currentBooking.slotDate), 'dd MMM') : 'None'}</div></CardContent></Card>
                 </div>
                 <h4 className="font-bold pt-4">Medical Quick Links</h4>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <DashboardLink icon={Calendar} label="Book Slot" to="/doctors" />
                    <DashboardLink icon={History} label="History" to="#" />
                    <DashboardLink icon={Stethoscope} label="Records" to="#" />
                    <DashboardLink icon={MapPin} label="Find Center" to="/contact" />
                 </div>
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6">
                <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold font-serif">My Bookings</h3><Link to="/doctors"><Button size="sm">Request New</Button></Link></div>
                {bookings?.length === 0 ? <Card className="p-16 text-center bg-transparent border-dashed border-2"><p className="text-slate-400">No appointments scheduled yet.</p></Card> : bookings?.map((b: any) => (
                  <Card key={b.id} className="hover:shadow-md transition-shadow group overflow-hidden">
                    <CardContent className="p-6 flex flex-col md:flex-row gap-6 items-center">
                      <div className="w-14 h-14 rounded-xl bg-primary/5 flex flex-col items-center justify-center text-primary font-black group-hover:bg-primary group-hover:text-white transition-colors"><div className="text-sm uppercase">{format(new Date(b.slotDate), 'MMM')}</div><div className="text-xl">{format(new Date(b.slotDate), 'dd')}</div></div>
                      <div className="flex-grow text-center md:text-left">
                        <h4 className="font-bold text-lg">{b.doctor.name}</h4>
                        <p className="text-sm text-slate-500 font-medium">{b.doctor.specialization} &bull; {b.slotTime}</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Reason: {b.reason}</p>
                      </div>
                      <div className="flex flex-col items-end gap-3 min-w-[120px]">
                        {statusBadge(b.status)}
                        {b.status === 'PENDING' && <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 p-2 font-black" onClick={() => cancelMutation.mutate(b.id)}>Cancel Request</Button>}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="current" className="space-y-6">
                 <h3 className="text-2xl font-bold font-serif">Active Appointment</h3>
                 {currentBooking ? (
                   <Card className="border-l-8 border-l-primary overflow-hidden shadow-xl">
                      <CardContent className="p-10 space-y-8">
                         <div className="flex justify-between items-start">
                            <div className="space-y-2">
                               <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none font-black text-[10px] tracking-widest uppercase py-1 px-3">Active Ticket</Badge>
                               <h2 className="text-3xl font-black">{currentBooking.doctor.name}</h2>
                               <p className="text-slate-500 font-medium text-lg">{currentBooking.doctor.specialization}</p>
                            </div>
                            <div className="text-right"><div className="text-sm font-black uppercase text-slate-400">Scheduled For</div><div className="text-2xl font-black text-primary">{format(new Date(currentBooking.slotDate), 'PPPP')}</div><div className="text-4xl font-black italic mt-1">{currentBooking.slotTime}</div></div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-slate-100">
                            <div className="space-y-2"><h6 className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Status Description</h6><div className="flex items-center gap-3">{currentBooking.status === 'APPROVED' ? <CheckCircle2 className="h-6 w-6 text-green-500" /> : <Clock className="h-6 w-6 text-yellow-500" />}<span className="font-bold text-lg">{currentBooking.status === 'APPROVED' ? 'Your appointment is confirmed!' : 'Awaiting clinical approval.'}</span></div></div>
                            <div className="space-y-2"><h6 className="text-[10px] font-black uppercase text-slate-400 tracking-tighter">Doctor Fee</h6><div className="text-2xl font-black">₹{currentBooking.doctor.consultationFee}</div></div>
                         </div>
                         <div className="pt-8 flex gap-4"><Button className="flex-1 h-14 font-black">Get Directions</Button><Button variant="outline" className="flex-1 h-14 font-black">Reschedule Appointment</Button></div>
                      </CardContent>
                   </Card>
                 ) : (
                   <Card className="p-20 text-center border-dashed border-2 bg-white/50"><h4 className="text-xl font-bold text-slate-300">No active bookings found.</h4><Link to="/doctors" className="mt-4 block"><Button>Book Now</Button></Link></Card>
                 )}
              </TabsContent>

              <TabsContent value="notifications" className="space-y-4">
                <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-bold font-serif">Inbox</h3><Button variant="ghost" size="sm" className="text-xs font-bold font-black" onClick={() => apiClient.patch('/notifications/read-all').then(() => queryClient.invalidateQueries({queryKey: ['notifications']}))}>Clear Unread</Button></div>
                {notifications?.map((n: any) => (
                  <div key={n.id} className={`p-6 rounded-2xl border-2 flex gap-4 items-start translate-y-0 hover:-translate-y-1 transition-all ${n.read ? 'bg-white border-slate-100' : 'bg-white border-primary/20 shadow-md shadow-primary/5'}`}>
                    <div className={`mt-1.5 h-3 w-3 rounded-full flex-shrink-0 ${n.read ? 'bg-slate-300' : 'bg-primary animate-pulse'}`} />
                    <div className="space-y-1 flex-grow">
                      <div className="flex justify-between items-start"><h4 className="font-black text-sm uppercase tracking-tight">{n.title}</h4><span className="text-[10px] font-bold text-slate-400">{formatDistanceToNow(new Date(n.createdAt))} ago</span></div>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">{n.message}</p>
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon: Icon, label, value }: any) => (
  <div className="flex items-center gap-4">
    <div className="p-2 rounded-lg bg-slate-50 text-primary border border-slate-100"><Icon className="h-4 w-4" /></div>
    <div className="space-y-0.5"><p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{label}</p><p className="text-sm font-bold truncate max-w-[180px] text-slate-800">{value}</p></div>
  </div>
);

const DashboardLink = ({ icon: Icon, label, to }: any) => (
  <Link to={to} className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-primary transition-all flex flex-col items-center gap-3 group text-center">
    <div className="p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors"><Icon className="h-6 w-6" /></div>
    <span className="text-xs font-black uppercase tracking-tight text-slate-600">{label}</span>
  </Link>
);

export default ProfilePage;
