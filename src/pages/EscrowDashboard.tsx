import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useStudentPayments, useTeacherPayments, PaymentWithDetails } from '@/hooks/usePayments';
import { useAuth } from '@/contexts/AuthContext';
import { formatCurrency, ESCROW_HOLD_HOURS } from '@/lib/stripe';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowLeft, 
  FileText,
  MessageSquare,
  Upload,
  Filter,
  Search,
  MoreHorizontal,
  Lock,
  Unlock,
  RefreshCw
} from 'lucide-react';
import { toast } from 'sonner';

// Extended dispute types
type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed';
type DisputeReason = 'service_not_received' | 'unsatisfactory_service' | 'billing_error' | 'unauthorized_charge' | 'other';

interface Dispute {
  id: string;
  payment_id: string;
  status: DisputeStatus;
  reason: DisputeReason;
  description: string;
  evidence: DisputeEvidence[];
  created_at: string;
  resolved_at?: string;
  resolution?: 'favor_client' | 'favor_consultant' | 'split' | 'refunded';
}

interface DisputeEvidence {
  id: string;
  type: 'document' | 'message' | 'screenshot' | 'other';
  url: string;
  description: string;
  submitted_by: 'client' | 'consultant' | 'admin';
  submitted_at: string;
}

// Mock disputes data
const MOCK_DISPUTES: Dispute[] = [
  {
    id: 'disp_001',
    payment_id: 'pay_001',
    status: 'under_review',
    reason: 'service_not_received',
    description: 'Consultant did not attend the scheduled session',
    evidence: [
      {
        id: 'evid_001',
        type: 'message',
        url: '',
        description: 'No response from consultant at scheduled time',
        submitted_by: 'client',
        submitted_at: '2024-01-15T10:00:00Z',
      }
    ],
    created_at: '2024-01-15T10:00:00Z',
  }
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500', icon: Clock },
  held: { label: 'In Escrow', color: 'bg-blue-500', icon: Lock },
  completed: { label: 'Completed', color: 'bg-green-500', icon: CheckCircle },
  refunded: { label: 'Refunded', color: 'bg-gray-500', icon: XCircle },
  disputed: { label: 'Disputed', color: 'bg-red-500', icon: AlertTriangle },
};

const disputeStatusConfig = {
  open: { label: 'Open', color: 'bg-yellow-500' },
  under_review: { label: 'Under Review', color: 'bg-blue-500' },
  resolved: { label: 'Resolved', color: 'bg-green-500' },
  closed: { label: 'Closed', color: 'bg-gray-500' },
};

const disputeReasonLabels: Record<DisputeReason, string> = {
  service_not_received: 'Service Not Received',
  unsatisfactory_service: 'Unsatisfactory Service',
  billing_error: 'Billing Error',
  unauthorized_charge: 'Unauthorized Charge',
  other: 'Other',
};

export default function EscrowDashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const studentPayments = useStudentPayments();
  const teacherPayments = useTeacherPayments();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [newDisputeReason, setNewDisputeReason] = useState<DisputeReason>('service_not_received');
  const [newDisputeDescription, setNewDisputeDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAdmin = profile?.role === 'admin';
  const isTeacher = profile?.role === 'teacher';
  const payments = isTeacher ? teacherPayments.data : studentPayments.data;
  const isLoading = isTeacher ? teacherPayments.isLoading : studentPayments.isLoading;

  // Filter payments
  const filteredPayments = payments?.filter(payment => {
    if (statusFilter !== 'all' && payment.status !== statusFilter) return false;
    if (searchQuery) {
      const search = searchQuery.toLowerCase();
      return (
        payment.id.toLowerCase().includes(search) ||
        payment.teacher?.full_name?.toLowerCase().includes(search) ||
        payment.student?.full_name?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  // Calculate statistics
  const stats = {
    totalEscrow: payments?.reduce((sum, p) => sum + (p.status === 'held' ? p.amount_cents : 0), 0) ?? 0,
    totalCompleted: payments?.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount_cents : 0), 0) ?? 0,
    totalRefunded: payments?.reduce((sum, p) => sum + (p.status === 'refunded' ? p.amount_cents : 0), 0) ?? 0,
    inEscrowCount: payments?.filter(p => p.status === 'held').length ?? 0,
    disputedCount: payments?.filter(p => p.status === 'disputed').length ?? 0,
  };

  const handleCreateDispute = async (paymentId: string) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newDispute: Dispute = {
        id: `disp_${Date.now()}`,
        payment_id: paymentId,
        status: 'open',
        reason: newDisputeReason,
        description: newDisputeDescription,
        evidence: [],
        created_at: new Date().toISOString(),
      };
      
      MOCK_DISPUTES.push(newDispute);
      toast.success('Dispute created successfully');
      setShowDisputeModal(false);
      setNewDisputeDescription('');
    } catch (error) {
      toast.error('Failed to create dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEvidence = async (disputeId: string, evidence: Omit<DisputeEvidence, 'id' | 'submitted_at'>) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const dispute = MOCK_DISPUTES.find(d => d.id === disputeId);
      if (dispute) {
        dispute.evidence.push({
          ...evidence,
          id: `evid_${Date.now()}`,
          submitted_at: new Date().toISOString(),
        });
        toast.success('Evidence submitted successfully');
        setShowEvidenceModal(false);
      }
    } catch (error) {
      toast.error('Failed to submit evidence');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolveDispute = async (disputeId: string, resolution: Dispute['resolution']) => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const dispute = MOCK_DISPUTES.find(d => d.id === disputeId);
      if (dispute) {
        dispute.status = 'resolved';
        dispute.resolved_at = new Date().toISOString();
        dispute.resolution = resolution;
        toast.success(`Dispute resolved: ${resolution}`);
        setSelectedDispute(null);
      }
    } catch (error) {
      toast.error('Failed to resolve dispute');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: PaymentWithDetails['status']) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} text-white flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const getTimeUntilRelease = (createdAt: string) => {
    const created = new Date(createdAt);
    const release = new Date(created.getTime() + ESCROW_HOLD_HOURS * 60 * 60 * 1000);
    const now = new Date();
    const diff = release.getTime() - now.getTime();
    
    if (diff <= 0) return 'Ready for release';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Shield className="w-8 h-8 text-primary" />
                Escrow Management
              </h1>
              <p className="text-muted-foreground">
                Track payments, manage disputes, and monitor escrow releases
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-sm">
            {isAdmin ? 'Admin View' : isTeacher ? 'Consultant View' : 'Client View'}
          </Badge>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Currently in Escrow</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-500" />
                {formatCurrency(stats.totalEscrow)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{stats.inEscrowCount} transactions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed Releases</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                {formatCurrency(stats.totalCompleted)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Successfully released</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Refunded</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <XCircle className="w-5 h-5 text-gray-500" />
                {formatCurrency(stats.totalRefunded)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Canceled or disputed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Active Disputes</CardDescription>
              <CardTitle className="text-2xl flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                {stats.disputedCount}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Awaiting resolution</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            {isAdmin && <TabsTrigger value="admin">Admin Review</TabsTrigger>}
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Recent Escrow Activity</CardTitle>
                <CardDescription>Latest payment and release activity</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : filteredPayments?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No escrow transactions found
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>{isTeacher ? 'Client' : 'Consultant'}</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Time Remaining</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments?.slice(0, 5).map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                          <TableCell>
                            {isTeacher ? payment.student?.full_name : payment.teacher?.full_name}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(payment.amount_cents)}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>
                            {payment.status === 'held' && (
                              <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {getTimeUntilRelease(payment.created_at)}
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {!isTeacher && payment.status === 'held' && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => {
                                  setSelectedDispute(MOCK_DISPUTES.find(d => d.payment_id === payment.id) || null);
                                  setShowDisputeModal(true);
                                }}
                              >
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Dispute
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>View and filter all escrow transactions</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search transactions..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-40">
                        <Filter className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="held">In Escrow</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="refunded">Refunded</SelectItem>
                        <SelectItem value="disputed">Disputed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading...</div>
                ) : filteredPayments?.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions found matching your criteria
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{isTeacher ? 'Client' : 'Consultant'}</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Platform Fee</TableHead>
                        <TableHead>Net Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Released</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPayments?.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell className="font-mono text-xs">{payment.id.slice(0, 12)}...</TableCell>
                          <TableCell>
                            {isTeacher ? payment.student?.full_name : payment.teacher?.full_name}
                          </TableCell>
                          <TableCell>{formatCurrency(payment.amount_cents)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatCurrency(payment.platform_fee_cents)}
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(payment.teacher_amount_cents)}
                          </TableCell>
                          <TableCell>{getStatusBadge(payment.status)}</TableCell>
                          <TableCell>{new Date(payment.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {payment.escrow_released_at 
                              ? new Date(payment.escrow_released_at).toLocaleDateString()
                              : '-'
                            }
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Tab */}
          <TabsContent value="disputes">
            <Card>
              <CardHeader>
                <CardTitle>Dispute Management</CardTitle>
                <CardDescription>View and manage payment disputes</CardDescription>
              </CardHeader>
              <CardContent>
                {MOCK_DISPUTES.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <p>No active disputes</p>
                    <p className="text-sm">All transactions are proceeding smoothly</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {MOCK_DISPUTES.map((dispute) => (
                      <Card key={dispute.id} className="border-l-4 border-l-yellow-500">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{dispute.id}</span>
                              <Badge className={`${disputeStatusConfig[dispute.status].color} text-white`}>
                                {disputeStatusConfig[dispute.status].label}
                              </Badge>
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {new Date(dispute.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <p><strong>Reason:</strong> {disputeReasonLabels[dispute.reason]}</p>
                            <p><strong>Description:</strong> {dispute.description}</p>
                            <p><strong>Evidence:</strong> {dispute.evidence.length} items submitted</p>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedDispute(dispute);
                              setShowEvidenceModal(true);
                            }}
                          >
                            <FileText className="w-4 h-4 mr-1" />
                            View Evidence
                          </Button>
                          {!isAdmin && dispute.status !== 'resolved' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedDispute(dispute);
                                setShowEvidenceModal(true);
                              }}
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              Submit Evidence
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Admin Review Tab */}
          {isAdmin && (
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle>Admin Review Panel</CardTitle>
                  <CardDescription>Review and resolve disputes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_DISPUTES.filter(d => d.status === 'open' || d.status === 'under_review').map((dispute) => (
                      <Card key={dispute.id} className="border-l-4 border-l-red-500">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <span className="font-mono">{dispute.id}</span>
                            <Badge className="bg-red-500 text-white">Requires Action</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4">{dispute.description}</p>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline"
                              onClick={() => handleResolveDispute(dispute.id, 'favor_client')}
                              disabled={isSubmitting}
                            >
                              <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                              Favor Client
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleResolveDispute(dispute.id, 'favor_consultant')}
                              disabled={isSubmitting}
                            >
                              <CheckCircle className="w-4 h-4 mr-1 text-blue-500" />
                              Favor Consultant
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleResolveDispute(dispute.id, 'split')}
                              disabled={isSubmitting}
                            >
                              <RefreshCw className="w-4 h-4 mr-1 text-yellow-500" />
                              Split 50/50
                            </Button>
                            <Button 
                              variant="outline"
                              onClick={() => handleResolveDispute(dispute.id, 'refunded')}
                              disabled={isSubmitting}
                            >
                              <Unlock className="w-4 h-4 mr-1 text-gray-500" />
                              Full Refund
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>

        {/* Create Dispute Modal */}
        <Dialog open={showDisputeModal} onOpenChange={setShowDisputeModal}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Raise a Dispute</DialogTitle>
              <DialogDescription>
                Please provide details about the issue with this transaction
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Reason for Dispute</Label>
                <Select value={newDisputeReason} onValueChange={(v) => setNewDisputeReason(v as DisputeReason)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="service_not_received">Service Not Received</SelectItem>
                    <SelectItem value="unsatisfactory_service">Unsatisfactory Service</SelectItem>
                    <SelectItem value="billing_error">Billing Error</SelectItem>
                    <SelectItem value="unauthorized_charge">Unauthorized Charge</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Please describe the issue in detail..."
                  value={newDisputeDescription}
                  onChange={(e) => setNewDisputeDescription(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowDisputeModal(false)}>
                Cancel
              </Button>
              <Button 
                onClick={() => selectedDispute && handleCreateDispute(selectedDispute.payment_id)}
                disabled={!newDisputeDescription || isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Dispute'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Evidence Modal */}
        <Dialog open={showEvidenceModal} onOpenChange={setShowEvidenceModal}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Dispute Evidence</DialogTitle>
              <DialogDescription>
                Review submitted evidence or add new evidence
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {selectedDispute?.evidence.map((evidence) => (
                <Card key={evidence.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className="mb-2">{evidence.type}</Badge>
                        <p>{evidence.description}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Submitted by {evidence.submitted_by} on{' '}
                          {new Date(evidence.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {!isAdmin && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Submit New Evidence</h4>
                  <div className="space-y-2">
                    <Textarea placeholder="Describe your evidence..." />
                    <Button className="w-full" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload File
                    </Button>
                  </div>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setShowEvidenceModal(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
