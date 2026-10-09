'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { store } from '@/lib/data-provider';
import { Report, ReportStatus } from '@/types/database';
import { ShieldAlert, CheckCircle, Ban, AlertCircle, Clock } from 'lucide-react';

export default function AdminModerationPage() {
  const router = useRouter();
  const [reports, setReports] = useState<Report[]>([]);
  const [currentUser, setCurrentUser] = useState(store.getCurrentUser());

  const loadReports = () => {
    setReports(store.getReports());
  };

  useEffect(() => {
    const user = store.getCurrentUser();
    setCurrentUser(user);
    loadReports();
  }, []);

  const handleUpdateReport = (reportId: string, status: ReportStatus) => {
    store.updateReportStatus(reportId, status, `Admin review completed by ${currentUser.display_name}`);
    loadReports();
  };

  const pendingCount = reports.filter((r) => r.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-navy-950 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            Admin Moderation & Safety Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Review community incident reports, enforce safety guidelines, and moderate reported records.
          </p>
        </div>
        <Badge variant="danger" size="md">
          {pendingCount} Pending Incident Reports
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-sm font-bold text-navy-950">Active Incident Reports</h2>
        </CardHeader>
        <CardBody className="p-5">
          {reports.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">No incident reports submitted.</p>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge variant="navy" size="sm">Type: {report.target_type}</Badge>
                        <span className="text-xs font-bold text-navy-950">Reason: {report.reason}</span>
                      </div>
                      <span className="text-[11px] text-slate-400 mt-1 block">
                        Reported by: {report.reporter?.display_name || 'Member'} • {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <Badge
                      variant={
                        report.status === 'pending'
                          ? 'warning'
                          : report.status === 'action_taken'
                          ? 'danger'
                          : 'success'
                      }
                      size="sm"
                    >
                      {report.status}
                    </Badge>
                  </div>

                  {report.details && (
                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      Details: {report.details}
                    </p>
                  )}

                  {report.admin_notes && (
                    <p className="text-[11px] text-slate-500 italic">
                      Admin Note: {report.admin_notes}
                    </p>
                  )}

                  {report.status === 'pending' && (
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateReport(report.id, 'dismissed')}
                        className="text-xs"
                      >
                        Dismiss Report
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleUpdateReport(report.id, 'action_taken')}
                        className="text-xs"
                      >
                        Take Moderation Action
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
