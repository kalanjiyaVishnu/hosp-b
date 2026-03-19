import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/services/apiClient';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { Check, X, Clock, Calendar, Filter, CheckCircle2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Booking } from 'shared';

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { data: bookings, isLoading } = useQuery<Booking[]>({ 
    queryKey: ['all-bookings'], 
    queryFn: async () => { 
      const { data } = await apiClient.get('/bookings'); 
      return data.data; 
    } 
  });

  const approveMutation = useMutation({
    mutationFn: async (id: string) => { 
      return apiClient.patch(`/bookings/${id}/approve`); 
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
      toast({ title: "Booking Approved", description: "The patient has been notified via email." });
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string, reason: string }) => { 
      return apiClient.patch(`/bookings/${id}/reject`, { reason }); 
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
      toast({ title: "Booking Rejected", variant: "destructive" });
    }
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => { 
      return apiClient.patch(`/bookings/${id}/complete`); 
    },
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: ['all-bookings'] });
      toast({ title: "Booking Completed" });
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-700';
      case 'PENDING': return 'bg-yellow-100 text-yellow-700';
      case 'REJECTED': return 'bg-red-100 text-red-700';
      case 'COMPLETED': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  if (isLoading) return <div className="p-24 text-center">Loading dashboard...</div>;

  const pendingBookings = bookings?.filter((b) => b.status === 'PENDING') || [];
  const approvedBookings = bookings?.filter((b) => b.status === 'APPROVED') || [];
  const completedBookings = bookings?.filter((b) => b.status === 'COMPLETED') || [];

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold font-serif">Hospital Dashboard</h1>
            <p className="text-slate-500 text-sm">Manage appointments, doctors, and patient flow.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline"><Calendar className="mr-2 h-4 w-4" /> Today</Button>
            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-sm">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Requests</div>
              <div className="text-3xl font-black mt-2">{bookings?.length || 0}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-l-4 border-l-yellow-400">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Pending</div>
              <div className="text-3xl font-black mt-2 text-yellow-600">{pendingBookings.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-l-4 border-l-green-500">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Approved</div>
              <div className="text-3xl font-black mt-2 text-green-600">{approvedBookings.length}</div>
            </CardContent>
          </Card>
          <Card className="shadow-sm border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Completed</div>
              <div className="text-3xl font-black mt-2 text-blue-600">{completedBookings.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-8 bg-white border">
            <TabsTrigger value="all">All Bookings</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <BookingTable 
              bookings={bookings} 
              onApprove={(id: string) => approveMutation.mutate(id)} 
              onReject={(id: string) => rejectMutation.mutate({ id, reason: 'N/A' })}
              onComplete={(id: string) => completeMutation.mutate(id)}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
          <TabsContent value="pending">
            <BookingTable 
              bookings={pendingBookings} 
              onApprove={(id: string) => approveMutation.mutate(id)} 
              onReject={(id: string) => rejectMutation.mutate({ id, reason: 'N/A' })}
              onComplete={(id: string) => completeMutation.mutate(id)}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
          <TabsContent value="approved">
            <BookingTable 
              bookings={approvedBookings} 
              onApprove={(id: string) => approveMutation.mutate(id)} 
              onReject={(id: string) => rejectMutation.mutate({ id, reason: 'N/A' })}
              onComplete={(id: string) => completeMutation.mutate(id)}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
          <TabsContent value="completed">
            <BookingTable 
              bookings={completedBookings} 
              onApprove={(id: string) => approveMutation.mutate(id)} 
              onReject={(id: string) => rejectMutation.mutate({ id, reason: 'N/A' })}
              onComplete={(id: string) => completeMutation.mutate(id)}
              getStatusColor={getStatusColor}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface BookingTableProps {
  bookings: Booking[] | undefined;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onComplete: (id: string) => void;
  getStatusColor: (status: string) => string;
}

const BookingTable = ({ bookings, onApprove, onReject, onComplete, getStatusColor }: BookingTableProps) => (
  <Card className="shadow-lg border-slate-100 overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-widest font-bold">
          <tr>
            <th className="px-6 py-4">Patient</th>
            <th className="px-6 py-4">Specialist</th>
            <th className="px-6 py-4">Date & Time</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {bookings?.length === 0 ? (
            <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400">No records found.</td></tr>
          ) : bookings?.map((b) => (
            <tr key={b.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-6 font-bold text-slate-800">
                {b.patient?.name || 'N/A'}
                <div className="text-[10px] text-slate-500 font-normal uppercase mt-1">{b.reason}</div>
              </td>
              <td className="px-6 py-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3 font-bold text-primary text-xs">{b.doctor?.name[4]}</div>
                  {b.doctor?.name}
                </div>
              </td>
              <td className="px-6 py-6 text-slate-500 font-medium">{format(new Date(b.slotDate), 'dd MMM yyyy')} <span className="mx-2 text-slate-200">|</span> {b.slotTime}</td>
              <td className="px-6 py-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase ${getStatusColor(b.status)}`}>{b.status}</span>
              </td>
              <td className="px-6 py-6 flex justify-center gap-2">
                {b.status === 'PENDING' && (
                  <>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => onApprove(b.id)}><Check className="h-4 w-4" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => onReject(b.id)}><X className="h-4 w-4" /></Button>
                  </>
                )}
                {b.status === 'APPROVED' && (
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-blue-600 hover:bg-blue-50" onClick={() => onComplete(b.id)}><CheckCircle2 className="h-4 w-4" /></Button>
                )}
                <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-400"><Clock className="h-4 w-4" /></Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

export default AdminDashboard;
