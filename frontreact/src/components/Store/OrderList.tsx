import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { DownloadToggle } from '../Common/DownloadToggle';
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  CreditCard,
  Package,
  MapPin,
  Eye,
  RefreshCw,
  Download,
  Trash2,
  Edit,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertCircle,
  Car,
  Store,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  options?: string[];
}

interface Order {
  id: string;
  items: OrderItem[];
  total: number;
  originalTotal: number;
  discount: number;
  status: 'pending' | 'preparing' | 'cooking' | 'ready' | 'completed' | 'cancelled';
  orderTime: Date;
  customer?: string;
  paymentMethod: string;
  orderType: '방문' | '포장' | '배달';
  customerPhone?: string;
  deliveryAddress?: string;
  cancelReason?: string;
}

// 샘플 주문 데이터
const sampleOrders: Order[] = [
  {
    id: '#0001',
    items: [
      { id: 1, name: '치킨버거세트', price: 12500, quantity: 2, image: '🍔' },
      { id: 5, name: '햄치즈토스트', price: 4500, quantity: 1, image: '🥪' }
    ],
    total: 28500,
    originalTotal: 29500,
    discount: 1000,
    status: 'completed',
    orderTime: new Date(Date.now() - 3600000),
    customer: '김고객',
    paymentMethod: '카드결제',
    orderType: '방문',
    customerPhone: '010-1234-5678'
  },
  {
    id: '#0002',
    items: [
      { id: 2, name: '불고기버거세트', price: 13000, quantity: 1, image: '🍔' },
      { id: 9, name: '아메리카노', price: 3000, quantity: 2, image: '☕' }
    ],
    total: 19000,
    originalTotal: 19000,
    discount: 0,
    status: 'ready',
    orderTime: new Date(Date.now() - 1800000),
    customer: '이고객',
    paymentMethod: '현금결제',
    orderType: '포장',
    customerPhone: '010-9876-5432'
  },
  {
    id: '#0003',
    items: [
      { id: 4, name: '치즈버거세트', price: 11500, quantity: 1, image: '🍔' },
      { id: 7, name: '참치토스트', price: 4800, quantity: 1, image: '🥪' }
    ],
    total: 16300,
    originalTotal: 16300,
    discount: 0,
    status: 'cooking',
    orderTime: new Date(Date.now() - 900000),
    paymentMethod: '상품권결제',
    orderType: '배달',
    deliveryAddress: '서울시 강남구 테헤란로 123'
  },
  {
    id: '#0004',
    items: [
      { id: 6, name: '베이컨토스트', price: 5000, quantity: 3, image: '🥪' }
    ],
    total: 15000,
    originalTotal: 15000,
    discount: 0,
    status: 'preparing',
    orderTime: new Date(Date.now() - 300000),
    customer: '박고객',
    paymentMethod: '카드결제',
    orderType: '방문',
    customerPhone: '010-5555-1234'
  },
  {
    id: '#0005',
    items: [
      { id: 1, name: '치킨버거세트', price: 12500, quantity: 1, image: '🍔' }
    ],
    total: 12500,
    originalTotal: 12500,
    discount: 0,
    status: 'cancelled',
    orderTime: new Date(Date.now() - 7200000),
    customer: '최고객',
    paymentMethod: '카드결제',
    orderType: '포장',
    customerPhone: '010-7777-8888',
    cancelReason: '고객 변심'
  }
];

export function OrderList() {
  // localStorage에서 주문 데이터 가져오기
  const getOrdersFromStorage = () => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
      if (storedOrders.length > 0) {
        // Date 문자열을 Date 객체로 변환
        return storedOrders.map((order: any) => ({
          ...order,
          orderTime: new Date(order.orderTime)
        }));
      }
      return sampleOrders;
    } catch (error) {
      console.error('주문 데이터 로드 오류:', error);
      return sampleOrders;
    }
  };

  // 주문번호 내림차순으로 정렬
  const initialOrders = getOrdersFromStorage().sort((a: Order, b: Order) => b.id.localeCompare(a.id));
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('today');
  const [currentTab, setCurrentTab] = useState('all');

  // localStorage 변경 감지 및 주문 데이터 업데이트
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedOrders = getOrdersFromStorage().sort((a: Order, b: Order) => b.id.localeCompare(a.id));
      setOrders(updatedOrders);
    };

    // storage 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);

    // 컴포넌트가 포커스될 때마다 데이터 새로고침
    const handleFocus = () => {
      const updatedOrders = getOrdersFromStorage().sort((a: Order, b: Order) => b.id.localeCompare(a.id));
      setOrders(updatedOrders);
    };

    window.addEventListener('focus', handleFocus);

    // 정기적으로 데이터 업데이트 (1초마다)
    const interval = setInterval(handleFocus, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  // 필터링 로직
  useEffect(() => {
    let filtered = orders;

    // 검색어 필터
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone?.includes(searchTerm) ||
        order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // 결제 방법 필터
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.paymentMethod === paymentFilter);
    }

    // 주문 유형 필터
    if (orderTypeFilter !== 'all') {
      filtered = filtered.filter(order => order.orderType === orderTypeFilter);
    }

    // 날짜 필터
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (dateFilter === 'today') {
      filtered = filtered.filter(order => order.orderTime >= today);
    } else if (dateFilter === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(order => order.orderTime >= weekAgo);
    } else if (dateFilter === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(order => order.orderTime >= monthAgo);
    }

    // 주문번호 내림차순으로 정렬
    filtered.sort((a, b) => b.id.localeCompare(a.id));
    
    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, paymentFilter, orderTypeFilter, dateFilter]);

  // 탭별 주문 수 계산
  const getOrderCountByStatus = (status: string) => {
    if (status === 'all') return orders.length;
    return orders.filter(order => order.status === status).length;
  };

  // 상태별 배지 스타일
  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: '대기중', className: 'bg-yellow-100 text-yellow-800' },
      preparing: { label: '준비중', className: 'bg-blue-100 text-blue-800' },
      cooking: { label: '조리중', className: 'bg-orange-100 text-orange-800' },
      ready: { label: '완료', className: 'bg-green-100 text-green-800' },
      completed: { label: '픽업완료', className: 'bg-gray-100 text-gray-800' },
      cancelled: { label: '취소', className: 'bg-red-100 text-red-800' }
    };

    const config = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  // 주문 유형 아이콘
  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case '방문': return <Store className="w-4 h-4" />;
      case '포장': return <ShoppingBag className="w-4 h-4" />;
      case '배달': return <Car className="w-4 h-4" />;
      default: return <Store className="w-4 h-4" />;
    }
  };

  // 주문 상태 변경
  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus as Order['status'] }
          : order
      )
    );
    toast.success(`주문 ${orderId} 상태가 ${newStatus}로 변경되었습니다.`);
  };

  // 주문 취소
  const cancelOrder = (orderId: string, reason: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled', cancelReason: reason }
          : order
      )
    );
    toast.success(`주문 ${orderId}가 취소되었습니다.`);
  };

  // 시간 포맷팅
  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 날짜 포맷팅
  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('ko-KR');
  };

  // 날짜시간 포맷팅
  const formatDateTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleString('ko-KR');
  };

  // 상태 텍스트 변환
  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '주문접수';
      case 'preparing': return '준비중';
      case 'cooking': return '조리중';
      case 'ready': return '완료';
      case 'completed': return '픽업완료';
      case 'cancelled': return '취소';
      default: return '알수없음';
    }
  };

  // 다운로드 기능
  const handleDownload = async (format: 'excel' | 'pdf') => {
    try {
      // 파일 생성 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 데이터가 없는 경우 처리
      if (!filteredOrders || filteredOrders.length === 0) {
        throw new Error('다운로드할 주문 데이터가 없습니다.');
      }
      
      // 실제 구현에서는 여기서 데이터를 엑셀/PDF로 변환
      const exportData = filteredOrders.map(order => ({
        주문번호: order.id || '-',
        고객명: order.customer || '-',
        연락처: order.customerPhone || '-',
        주문시간: order.orderTime ? formatDateTime(order.orderTime) : '-',
        주문유형: order.orderType || '-',
        결제방법: order.paymentMethod || '-',
        주문상태: getStatusText(order.status),
        총금액: order.total ? `${order.total.toLocaleString()}원` : '0원',
        할인금액: order.discount ? `${order.discount.toLocaleString()}원` : '0원',
        메뉴: order.items ? order.items.map(item => `${item.name || '메뉴'} x${item.quantity || 1}`).join(', ') : '-'
      }));

      // 실제로는 xlsx, jsPDF 등의 라이브러리 사용
      if (format === 'excel') {
        // 엑셀 다운로드 시뮬레이션
        if (exportData.length > 0) {
          const csvContent = [
            Object.keys(exportData[0]).join(','),
            ...exportData.map(row => Object.values(row).map(v => `"${v}"`).join(','))
          ].join('\n');
          
          const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `주문리스트_${new Date().toISOString().split('T')[0]}.csv`;
          link.click();
        }
      } else {
        // HTML 보고서 생성 (인쇄용)
        const reportWindow = window.open('', '_blank');
        const htmlContent = `
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>주문 리스트 보고서</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body { 
            font-family: 'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
            padding: 40px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #14213D;
            padding-bottom: 20px;
        }
        
        .header h1 {
            color: #14213D;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
        }
        
        .header-info {
            color: #666;
            font-size: 14px;
        }
        
        .summary {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 20px;
            border-radius: 12px;
            margin-bottom: 30px;
            border-left: 5px solid #14213D;
        }
        
        .summary h2 {
            color: #14213D;
            font-size: 18px;
            margin-bottom: 10px;
            font-weight: 600;
        }
        
        .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .summary-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .summary-label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 5px;
        }
        
        .summary-value {
            font-size: 18px;
            font-weight: 600;
            color: #14213D;
        }
        
        .order-grid {
            display: grid;
            gap: 20px;
        }
        
        .order-card {
            border: 1px solid #e0e0e0;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.05);
            transition: transform 0.2s;
        }
        
        .order-header {
            background: linear-gradient(135deg, #14213D 0%, #1a2b4d 100%);
            color: white;
            padding: 16px 20px;
            font-weight: 600;
            font-size: 16px;
        }
        
        .order-content {
            padding: 20px;
        }
        
        .order-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 20px;
        }
        
        .detail-item {
            display: flex;
            flex-direction: column;
        }
        
        .detail-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 4px;
            font-weight: 500;
        }
        
        .detail-value {
            font-size: 14px;
            color: #333;
            font-weight: 500;
        }
        
        .menu-section {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #FF6B6B;
        }
        
        .menu-label {
            font-size: 12px;
            color: #666;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        
        .menu-content {
            font-size: 14px;
            color: #333;
            line-height: 1.5;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 11px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-completed { background: #d4edda; color: #155724; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-cancelled { background: #f8d7da; color: #721c24; }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        
        @media print {
            body { padding: 20px; }
            .order-card { break-inside: avoid; }
            .header { break-after: avoid; }
        }
        
        @page {
            margin: 2cm;
            size: A4;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 주문 리스트 보고서</h1>
        <div class="header-info">
            <div>생성일시: ${new Date().toLocaleString('ko-KR')}</div>
        </div>
    </div>
    
    <div class="summary">
        <h2>📊 보고서 요약</h2>
        <div class="summary-grid">
            <div class="summary-item">
                <div class="summary-label">총 주문 건수</div>
                <div class="summary-value">${exportData.length}건</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">보고서 생성</div>
                <div class="summary-value">${new Date().toLocaleDateString('ko-KR')}</div>
            </div>
            <div class="summary-item">
                <div class="summary-label">생성 시간</div>
                <div class="summary-value">${new Date().toLocaleTimeString('ko-KR')}</div>
            </div>
        </div>
    </div>

    <div class="order-grid">
        ${exportData.map((order, index) => `
        <div class="order-card">
            <div class="order-header">
                #${index + 1} 주문번호: ${order.주문번호}
            </div>
            <div class="order-content">
                <div class="order-details">
                    <div class="detail-item">
                        <div class="detail-label">고객명</div>
                        <div class="detail-value">${order.고객명}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">연락처</div>
                        <div class="detail-value">${order.연락처}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">주문시간</div>
                        <div class="detail-value">${order.주문시간}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">주문유형</div>
                        <div class="detail-value">${order.주문유형}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">결제방법</div>
                        <div class="detail-value">${order.결제방법}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">주문상태</div>
                        <div class="detail-value">
                            <span class="status-badge ${order.주문상태 === '완료' ? 'status-completed' : order.주문상태 === '준비중' ? 'status-pending' : 'status-cancelled'}">${order.주문상태}</span>
                        </div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">총금액</div>
                        <div class="detail-value">${order.총금액}</div>
                    </div>
                    <div class="detail-item">
                        <div class="detail-label">할인금액</div>
                        <div class="detail-value">${order.할인금액}</div>
                    </div>
                </div>
                <div class="menu-section">
                    <div class="menu-label">주문 메뉴</div>
                    <div class="menu-content">${order.메뉴}</div>
                </div>
            </div>
        </div>
        `).join('')}
    </div>
    
    <div class="footer">
        <div>FranFriend ERP System - 주문 관리 보고서</div>
        <div>본 보고서는 ${new Date().toLocaleString('ko-KR')}에 자동 생성되었습니다.</div>
    </div>
    
    <script>
        // 페이지 로드 후 자동 인쇄 다이얼로그 표시
        window.onload = function() {
            setTimeout(() => {
                window.print();
            }, 500);
        };
    </script>
</body>
</html>`;
        
        if (reportWindow) {
          reportWindow.document.write(htmlContent);
          reportWindow.document.close();
        }
      }
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>주문 리스트</h1>
          <p className="text-dark-gray">
            오늘 총 {orders.filter(o => o.orderTime >= new Date(new Date().setHours(0,0,0,0))).length}건의 주문
          </p>
        </div>
        <div className="flex gap-2">
          <DownloadToggle
            onDownload={handleDownload}
            filename={`주문리스트_${new Date().toISOString().split('T')[0]}`}
          />
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            새로고침
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-4">
          {/* 검색 */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="주문번호, 고객명, 전화번호, 메뉴명으로 검색"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* 상태 필터 */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="상태" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 상태</SelectItem>
              <SelectItem value="pending">대기중</SelectItem>
              <SelectItem value="preparing">준비중</SelectItem>
              <SelectItem value="cooking">조리중</SelectItem>
              <SelectItem value="ready">완료</SelectItem>
              <SelectItem value="completed">픽업완료</SelectItem>
              <SelectItem value="cancelled">취소</SelectItem>
            </SelectContent>
          </Select>

          {/* 결제 방법 필터 */}
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="결제방법" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 결제</SelectItem>
              <SelectItem value="카드결제">카드결제</SelectItem>
              <SelectItem value="현금결제">현금결제</SelectItem>
              <SelectItem value="상품권결제">상품권결제</SelectItem>
            </SelectContent>
          </Select>

          {/* 주문 유형 필터 */}
          <Select value={orderTypeFilter} onValueChange={setOrderTypeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="주문유형" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체 유형</SelectItem>
              <SelectItem value="방문">방문</SelectItem>
              <SelectItem value="포장">포장</SelectItem>
              <SelectItem value="배달">배달</SelectItem>
            </SelectContent>
          </Select>

          {/* 날짜 필터 */}
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="기간" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">오늘</SelectItem>
              <SelectItem value="week">일주일</SelectItem>
              <SelectItem value="month">한 달</SelectItem>
              <SelectItem value="all">전체</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="all">
              전체 ({getOrderCountByStatus('all')})
            </TabsTrigger>
            <TabsTrigger value="pending">
              대기 ({getOrderCountByStatus('pending')})
            </TabsTrigger>
            <TabsTrigger value="preparing">
              준비 ({getOrderCountByStatus('preparing')})
            </TabsTrigger>
            <TabsTrigger value="cooking">
              조리 ({getOrderCountByStatus('cooking')})
            </TabsTrigger>
            <TabsTrigger value="ready">
              완료 ({getOrderCountByStatus('ready')})
            </TabsTrigger>
            <TabsTrigger value="completed">
              픽업완료 ({getOrderCountByStatus('completed')})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              취소 ({getOrderCountByStatus('cancelled')})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={currentTab} className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">주문번호</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">주문시간</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">고객정보</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">주문내역</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">유형</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">금액</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">결제</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">상태</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">액션</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders
                    .filter(order => currentTab === 'all' || order.status === currentTab)
                    .map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{order.id}</div>

                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-gray-900">{formatTime(order.orderTime)}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.orderTime)}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-gray-900">{order.customer || '고객'}</div>
                          {order.customerPhone && (
                            <div className="text-sm text-gray-500">
                              {order.customerPhone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {order.items.slice(0, 2).map((item, index) => (
                            <div key={index} className="text-sm text-gray-900">
                              {item.name} x{item.quantity}
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <div className="text-sm text-gray-500">
                              외 {order.items.length - 2}개
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {getOrderTypeIcon(order.orderType)}
                          <span className="text-gray-900">{order.orderType}</span>
                        </div>
                        {order.orderType === '배달' && order.deliveryAddress && (
                          <div className="text-sm text-gray-500 mt-1">
                            <MapPin className="w-3 h-3 inline mr-1" />
                            {order.deliveryAddress.slice(0, 20)}...
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-semibold text-gray-900">
                            {(order.total || 0).toLocaleString()}원
                          </div>
                          {order.discount > 0 && (
                            <div className="text-sm text-red-500">
                              -{order.discount.toLocaleString()}원 할인
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900">{order.paymentMethod}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          {getStatusBadge(order.status)}
                          {order.status === 'cancelled' && order.cancelReason && (
                            <div className="text-sm text-gray-500 mt-1">
                              {order.cancelReason}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {order.status !== 'cancelled' && order.status !== 'completed' && (
                            <Select
                              value={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="h-8 w-8 p-0 border-none bg-transparent hover:bg-gray-100">
                                <MoreHorizontal className="w-4 h-4" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="preparing">준비중</SelectItem>
                                <SelectItem value="cooking">조리중</SelectItem>
                                <SelectItem value="ready">완료</SelectItem>
                                <SelectItem value="completed">픽업완료</SelectItem>
                                <SelectItem 
                                  value="cancelled"
                                  onClick={() => cancelOrder(order.id, '관리자 취소')}
                                >
                                  취소
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredOrders.filter(order => currentTab === 'all' || order.status === currentTab).length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">주문이 없습니다</h3>
                <p className="text-gray-500">조건에 맞는 주문이 없습니다.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>

      {/* Order Detail Modal - 여기에 상세 주문 정보 모달을 추가할 수 있습니다 */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2>주문 상세 정보</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedOrder(null)}
                >
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">주문번호</label>
                    <p>{selectedOrder.id}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">주문시간</label>
                    <p>{formatDateTime(selectedOrder.orderTime)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">고객명</label>
                    <p>{selectedOrder.customer || '고객'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">연락처</label>
                    <p>{selectedOrder.customerPhone || '-'}</p>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">주문 내역</label>
                  <div className="mt-2 space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div className="flex items-center gap-2">
                          <span>{item.image}</span>
                          <span>{item.name}</span>
                          <span className="text-gray-500">x{item.quantity}</span>
                        </div>
                        <span>{(item.price * item.quantity).toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span>소계</span>
                    <span>{selectedOrder.originalTotal.toLocaleString()}원</span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between items-center text-red-500">
                      <span>할인</span>
                      <span>-{selectedOrder.discount.toLocaleString()}원</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center font-medium border-t mt-2 pt-2">
                    <span>총 결제금액</span>
                    <span>{selectedOrder.total.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-500">결제방법</label>
                    <p>{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">주문유형</label>
                    <p>{selectedOrder.orderType}</p>
                  </div>
                </div>

                {selectedOrder.deliveryAddress && (
                  <div>
                    <label className="text-sm text-gray-500">배달주소</label>
                    <p>{selectedOrder.deliveryAddress}</p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-gray-500">주문상태</label>
                  <div className="mt-1">
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}