
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import ApprovalListComponent from '@/components/admin/ApprovalList';

const ApprovalList: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden md:ml-[250px] transition-all duration-300">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <ApprovalListComponent />
        </main>
      </div>
    </div>
  );
};

export default ApprovalList;
