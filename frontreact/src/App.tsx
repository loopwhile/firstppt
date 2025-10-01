import React, { useState } from 'react';
import { Layout } from './components/Common/Layout';
import { Login } from './components/Common/Login';
import { Register } from './components/Common/Register';
import { HQDashboard } from './components/HQ/Dashboard';
import { StoreDashboard } from './components/Store/Dashboard';
import { StoreManagement } from './components/HQ/StoreManagement';
import { MenuManagement } from './components/HQ/MenuManagement';
import { HQInventoryManagement } from './components/HQ/InventoryManagement';
import { StaffManagement } from './components/HQ/StaffManagement';
import { NoticeManagement } from './components/HQ/NoticeManagement';
import { LogisticsManagement } from './components/HQ/LogisticsManagement';
import { HQReports } from './components/HQ/Reports';
import { StoreMenuManagement } from './components/Store/MenuManagement';
import { OrderSystem } from './components/Store/OrderSystem';
import { OrderList } from './components/Store/OrderList';
import { KitchenDisplay } from './components/Store/KitchenDisplay';
import { InventoryManagement } from './components/Store/InventoryManagement';
import { InventoryStatus } from './components/Store/InventoryStatus';
import { InventoryOrders } from './components/Store/InventoryOrders';
import { InventoryNewOrder } from './components/Store/InventoryNewOrder';
import { FinanceManagement } from './components/Store/FinanceManagement';
import { StoreStaffManagement } from './components/Store/StaffManagement';
import { StaffList } from './components/Store/StaffList';
import { StaffSchedule } from './components/Store/StaffSchedule';
import { StaffPayroll } from './components/Store/StaffPayroll';
import { StaffWorkReports } from './components/Store/StaffWorkReports';
import { NoticeEducation } from './components/Store/NoticeEducation';
import { StoreReports } from './components/Store/Reports';
import { ReportsSales } from './components/Store/ReportsSales';
import { ReportsOrders } from './components/Store/ReportsOrders';
import { ReportsMaterials } from './components/Store/ReportsMaterials';
import { ReportsMembers } from './components/Store/ReportsMembers';
import { DailyClosing } from './components/Store/DailyClosing';
import { ChannelRevenue } from './components/Store/ChannelRevenue';
import { toast } from 'sonner';
import { Toaster } from './components/ui/sonner';
import { ErrorBoundary } from './components/Common/ErrorBoundary';
import { OrderProvider } from './components/Common/OrderContext';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [userType, setUserType] = useState<'HQ' | 'Store'>('HQ');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const handleLogin = (type: 'HQ' | 'Store') => {
    setUserType(type);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
    setShowRegister(false);
  };

  const handleRegister = (type: 'HQ' | 'Store', userData: any) => {
    // 실제 구현에서는 여기서 서버에 회원가입 요청을 보냄
    console.log('회원가입 데이터:', userData);
    
    // 회원가입 후 자동 로그인
    setUserType(type);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
    setShowRegister(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserType('HQ');
    setCurrentPage('dashboard');
    setShowRegister(false);
    toast.success('로그아웃되었습니다.');
  };

  const handlePageChange = (page: string) => {
    setCurrentPage(page);
  };

  const renderContent = () => {
    if (currentPage === 'dashboard') {
      return userType === 'HQ' ? (
        <ErrorBoundary>
          <HQDashboard />
        </ErrorBoundary>
      ) : (
        <ErrorBoundary>
          <StoreDashboard />
        </ErrorBoundary>
      );
    }
    
    // HQ 페이지들
    if (userType === 'HQ') {
      switch (currentPage) {
        case 'stores':
          return <ErrorBoundary><StoreManagement /></ErrorBoundary>;
        case 'menu':
          return <ErrorBoundary><MenuManagement /></ErrorBoundary>;
        case 'inventory':
          return <ErrorBoundary><HQInventoryManagement /></ErrorBoundary>;
        case 'staff':
          return <ErrorBoundary><StaffManagement /></ErrorBoundary>;
        case 'logistics':
          return <ErrorBoundary><LogisticsManagement /></ErrorBoundary>;
        case 'notice':
          return <ErrorBoundary><NoticeManagement /></ErrorBoundary>;
        case 'reports':
          return <ErrorBoundary><HQReports /></ErrorBoundary>;
        default:
          break;
      }
    }
    
    // Store 페이지들
    if (userType === 'Store') {
      switch (currentPage) {
        case 'menu':
          return <ErrorBoundary><StoreMenuManagement /></ErrorBoundary>;
        case 'orders':
        case 'order-pos':
          return <ErrorBoundary><OrderSystem /></ErrorBoundary>;
        case 'order-list':
          return <ErrorBoundary><OrderList /></ErrorBoundary>;
        case 'order-kitchen':
          return <ErrorBoundary><KitchenDisplay /></ErrorBoundary>;
        case 'inventory':
        case 'inventory-status':
          return <ErrorBoundary><InventoryStatus /></ErrorBoundary>;
        case 'inventory-orders':
          return <ErrorBoundary><InventoryOrders /></ErrorBoundary>;
        case 'inventory-new-order':
          return <ErrorBoundary><InventoryNewOrder /></ErrorBoundary>;
        case 'finance':
          return <ErrorBoundary><FinanceManagement /></ErrorBoundary>;
        case 'daily-closing':
          return <ErrorBoundary><DailyClosing /></ErrorBoundary>;
        case 'channel-revenue':
          return <ErrorBoundary><ChannelRevenue /></ErrorBoundary>;
        case 'staff':
        case 'staff-list':
          return <ErrorBoundary><StaffList /></ErrorBoundary>;
        case 'staff-schedule':
          return <ErrorBoundary><StaffSchedule /></ErrorBoundary>;
        case 'staff-payroll':
          return <ErrorBoundary><StaffPayroll /></ErrorBoundary>;
        case 'staff-reports':
          return <ErrorBoundary><StaffWorkReports /></ErrorBoundary>;
        case 'notice':
          return <ErrorBoundary><NoticeEducation /></ErrorBoundary>;
        case 'reports':
          return <ErrorBoundary><StoreReports /></ErrorBoundary>;
        case 'reports-sales':
          return <ErrorBoundary><ReportsSales /></ErrorBoundary>;
        case 'reports-orders':
          return <ErrorBoundary><ReportsOrders /></ErrorBoundary>;
        case 'reports-materials':
          return <ErrorBoundary><ReportsMaterials /></ErrorBoundary>;
        case 'reports-members':
          return <ErrorBoundary><ReportsMembers /></ErrorBoundary>;
        default:
          break;
      }
    }
    
    // 임시 컨텐츠 - 추후 각 기능별 컴포넌트로 교체
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {currentPage} 페이지
          </h2>
          <p className="text-dark-gray">
            {userType === 'HQ' ? '본사' : '가맹점'} {currentPage} 기능이 곧 추가됩니다.
          </p>
        </div>
      </div>
    );
  };

  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <>
          <Register
            onRegisterSuccess={() => {
              // 회원가입 완료 후 로그인 화면으로
              setShowRegister(false);
            }}
            onBackToLogin={() => setShowRegister(false)}
          />
          <Toaster />
        </>
      );
    }
    return (
      <>
        <Login
          onLogin={(type) => {
            setIsLoggedIn(true);
            setUserType(type); // 'HQ' | 'Store' 저장
          }}
          onRegister={() => setShowRegister(true)}
        />
        <Toaster />
      </>
    );
  }

  return (
    <OrderProvider>
      <Layout 
        userType={userType} 
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onLogout={handleLogout}
      >
        {renderContent()}
      </Layout>
      <Toaster />
    </OrderProvider>
  );
}