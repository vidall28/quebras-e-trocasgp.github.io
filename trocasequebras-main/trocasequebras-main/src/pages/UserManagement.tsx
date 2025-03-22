
import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import UserManagementComponent from '@/components/admin/UserManagement';

const UserManagement: React.FC = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      
      <div className="flex flex-col flex-1 overflow-hidden md:ml-[250px] transition-all duration-300">
        <Header />
        
        <main className="flex-1 overflow-y-auto">
          <UserManagementComponent />
        </main>
      </div>
    </div>
  );
};

export default UserManagement;
