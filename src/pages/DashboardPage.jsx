import React from 'react';
import { TrendingUp, Users, Receipt, AlertTriangle } from 'lucide-react';
import StatCard from '../components/StatCard';
import RevenueChart from '../components/RevenueChart';
import RecentTransactions from '../components/RecentTransactions';
import TaxDistribution from '../components/TaxDistribution';

function DashboardPage() {
  return (
    <div>
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Monitor tax collection, compliance status, and system health</p>
      </div>

      <div className="grid-4">
        <StatCard
          title="Total Revenue"
          value="₦2.14B"
          change="+12.5%"
          icon={<TrendingUp size={24} />}
          color="var(--primary)"
        />
        <StatCard
          title="Active Taxpayers"
          value="14,205"
          change="+3.2%"
          icon={<Users size={24} />}
          color="#3498db"
        />
        <StatCard
          title="Pending Filings"
          value="1,847"
          change="-8.1%"
          icon={<Receipt size={24} />}
          color="var(--warning)"
        />
        <StatCard
          title="Overdue Returns"
          value="342"
          change="+2.4%"
          icon={<AlertTriangle size={24} />}
          color="var(--danger)"
        />
      </div>

      <div className="grid-2" style={{ marginTop: '24px' }}>
        <RevenueChart />
        <TaxDistribution />
      </div>

      <RecentTransactions />
    </div>
  );
}

export default DashboardPage;