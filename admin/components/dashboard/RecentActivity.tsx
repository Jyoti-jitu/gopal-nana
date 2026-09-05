import React from "react";
import { Activity, ShieldAlert, CheckCircle, FileUp, Edit3 } from "lucide-react";

export interface ActivityItem {
  id: string;
  timestamp: string;
  user_email: string;
  user_name?: string;
  action: string;
  entity: string;
  entity_id?: string;
  details?: any;
}

export function RecentActivity({ items = [] }: { items?: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-navy-200 bg-white p-6 shadow-sm text-center">
        <Activity className="mx-auto h-8 w-8 text-navy-400" />
        <p className="mt-2 text-sm font-medium text-navy-600">No system audit activity recorded yet.</p>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    switch (action.toUpperCase()) {
      case "PUBLISH":
        return <CheckCircle className="h-4 w-4 text-emerald-600" />;
      case "UPLOAD":
        return <FileUp className="h-4 w-4 text-blue-600" />;
      case "DELETE":
        return <ShieldAlert className="h-4 w-4 text-red-600" />;
      default:
        return <Edit3 className="h-4 w-4 text-amber-600" />;
    }
  };

  return (
    <div className="rounded-lg border border-navy-200 bg-white shadow-sm overflow-hidden">
      <div className="border-b border-navy-100 bg-navy-50/50 px-6 py-4">
        <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">Recent System Activity</h3>
      </div>
      <div className="divide-y divide-navy-100 max-h-80 overflow-y-auto">
        {items.map((item) => (
          <div key={item.id} className="flex items-start space-x-3 p-4 hover:bg-navy-50/30 transition-colors">
            <div className="mt-0.5 rounded-full bg-navy-100 p-1.5 flex-shrink-0">
              {getActionIcon(item.action)}
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-navy-900 leading-snug">
                <span className="font-bold">{item.user_name || item.user_email}</span> {item.action.toLowerCase()}{" "}
                <span className="text-navy-700 font-semibold">{item.entity}</span>
              </p>
              <p className="text-[10px] font-medium text-navy-400 mt-0.5">
                {new Date(item.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
