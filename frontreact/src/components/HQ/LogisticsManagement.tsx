import React, { useState } from 'react';
import { KPICard } from '../Common/KPICard';
import { DataTable } from '../Common/DataTable';
import { FormModal } from '../Common/FormModal';
import { StatusBadge } from '../Common/StatusBadge';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Truck, 
  Plus, 
  Package, 
  Building,
  Search,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Phone,
  User
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'sonner@2.0.3';

// 발주 데이터 (임시)
const orderData = [
  {
    id: 1,
    orderNumber: 'PO-2024-001',
    store: '강남점',
    supplier: '신선농산',
    items: [
      { name: '토마토', quantity: 20, unit: 'kg', price: 3000 },
      { name: '양상추', quantity: 15, unit: 'kg', price: 2500 },
    ],
    totalAmount: 97500,
    orderDate: '2024-01-03',
    expectedDate: '2024-01-05',
    deliveryDate: null,
    status: '발주완료',
    urgency: '보통',
    approver: '김팀장',
  },
  {
    id: 2,
    orderNumber: 'PO-2024-002',
    store: '홍대점',
    supplier: '프리미엄육류',
    items: [
      { name: '소고기', quantity: 10, unit: 'kg', price: 25000 },
      { name: '돼지고기', quantity: 8, unit: 'kg', price: 15000 },
    ],
    totalAmount: 370000,
    orderDate: '2024-01-04',
    expectedDate: '2024-01-06',
    deliveryDate: '2024-01-06',
    status: '배송완료',
    urgency: '높음',
    approver: '이과장',
  },
  {
    id: 3,
    orderNumber: 'PO-2024-003',
    store: '신촌점',
    supplier: '일반식자재',
    items: [
      { name: '식용유', quantity: 5, unit: 'L', price: 8000 },
      { name: '소금', quantity: 3, unit: 'kg', price: 2000 },
    ],
    totalAmount: 46000,
    orderDate: '2024-01-05',
    expectedDate: '2024-01-07',
    deliveryDate: null,
    status: '배송중',
    urgency: '보통',
    approver: '박대리',
  },
];

// 공급업체 데이터 (임시)
const supplierData = [
  {
    id: 1,
    name: '신선농산',
    category: '농산물',
    contact: '김농산',
    phone: '02-1234-5678',
    email: 'farm@fresh.com',
    address: '서울시 서초구 농산로 123',
    rating: 4.8,
    totalOrders: 156,
    totalAmount: 12500000,
    status: '활성',
    contractDate: '2023-03-15',
    paymentTerms: '월말정산',
  },
  {
    id: 2,
    name: '프리미엄육류',
    category: '육류',
    contact: '이정육',
    phone: '02-2345-6789',
    email: 'meat@premium.com',
    address: '서울시 강남구 육류로 456',
    rating: 4.9,
    totalOrders: 89,
    totalAmount: 18750000,
    status: '활성',
    contractDate: '2023-01-20',
    paymentTerms: '선결제',
  },
  {
    id: 3,
    name: '일반식자재',
    category: '기타',
    contact: '박식자',
    phone: '02-3456-7890',
    email: 'food@general.com',
    address: '서울시 마포구 식자재로 789',
    rating: 4.2,
    totalOrders: 234,
    totalAmount: 8950000,
    status: '활성',
    contractDate: '2022-11-10',
    paymentTerms: '월말정산',
  },
];

// 월별 발주 통계 데이터
const monthlyOrderData = [
  { month: '2023-07', orders: 45, amount: 8500000 },
  { month: '2023-08', orders: 52, amount: 9200000 },
  { month: '2023-09', orders: 48, amount: 8800000 },
  { month: '2023-10', orders: 58, amount: 10500000 },
  { month: '2023-11', orders: 61, amount: 11200000 },
  { month: '2023-12', orders: 67, amount: 12100000 },
];

// 카테고리별 발주 비율
const categoryData = [
  { name: '농산물', value: 35, color: '#FF6B6B' },
  { name: '육류', value: 28, color: '#F77F00' },
  { name: '수산물', value: 15, color: '#06D6A0' },
  { name: '유제품', value: 12, color: '#9D4EDD' },
  { name: '기타', value: 10, color: '#6C757D' },
];

export function LogisticsManagement() {
  const [orders, setOrders] = useState(orderData);
  const [suppliers, setSuppliers] = useState(supplierData);
  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showAddSupplierModal, setShowAddSupplierModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('orders');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const orderColumns = [
    {
      key: 'orderNumber',
      label: '발주번호',
      render: (order: any) => (
        <div>
          <div className="font-medium">{order.orderNumber}</div>
          <div className="text-xs text-gray-500">{order.orderDate}</div>
        </div>
      ),
    },
    {
      key: 'store',
      label: '요청 매장',
      render: (order: any) => (
        <div className="flex items-center gap-1">
          <Building className="w-3 h-3" />
          <span className="font-medium">{order.store}</span>
        </div>
      ),
    },
    {
      key: 'supplier',
      label: '공급업체',
      render: (order: any) => (
        <div className="flex items-center gap-1">
          <User className="w-3 h-3" />
          <span>{order.supplier}</span>
        </div>
      ),
    },
    {
      key: 'items',
      label: '주문 품목',
      render: (order: any) => (
        <div className="text-xs">
          <div>{order.items.length}개 품목</div>
          <div className="text-gray-500">
            {order.items.slice(0, 2).map((item: any) => item.name).join(', ')}
            {order.items.length > 2 && ` 외 ${order.items.length - 2}개`}
          </div>
        </div>
      ),
    },
    {
      key: 'totalAmount',
      label: '총 금액',
      render: (order: any) => (
        <span className="font-semibold">₩{(order.totalAmount || 0).toLocaleString()}</span>
      ),
    },
    {
      key: 'status',
      label: '상태',
      render: (order: any) => <StatusBadge status={order.status} />,
    },
    {
      key: 'urgency',
      label: '긴급도',
      render: (order: any) => (
        <Badge 
          className={
            order.urgency === '높음' ? 'bg-red-100 text-red-700' :
            order.urgency === '보통' ? 'bg-yellow-100 text-yellow-700' :
            'bg-green-100 text-green-700'
          }
        >
          {order.urgency}
        </Badge>
      ),
    },
    {
      key: 'expectedDate',
      label: '예정일',
      render: (order: any) => (
        <div className="text-xs flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {order.expectedDate}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '관리',
      render: (order: any) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditOrder(order)}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteOrder(order)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  const supplierColumns = [
    {
      key: 'name',
      label: '업체명',
      render: (supplier: any) => (
        <div>
          <div className="font-medium">{supplier.name}</div>
          <div className="text-xs text-gray-500">{supplier.category}</div>
        </div>
      ),
    },
    {
      key: 'contact',
      label: '담당자',
      render: (supplier: any) => (
        <div className="text-xs">
          <div className="font-medium">{supplier.contact}</div>
          <div className="flex items-center gap-1 mt-1">
            <Phone className="w-3 h-3" />
            {supplier.phone}
          </div>
        </div>
      ),
    },
    {
      key: 'address',
      label: '주소',
      render: (supplier: any) => (
        <div className="text-xs flex items-start gap-1">
          <MapPin className="w-3 h-3 mt-0.5" />
          <span>{supplier.address}</span>
        </div>
      ),
    },
    {
      key: 'rating',
      label: '평점',
      render: (supplier: any) => (
        <div className="flex items-center gap-1">
          <span className="font-medium">{supplier.rating}</span>
          <span className="text-xs text-gray-500">/ 5.0</span>
        </div>
      ),
    },
    {
      key: 'orders',
      label: '주문 현황',
      render: (supplier: any) => (
        <div className="text-xs">
          <div>{supplier.totalOrders}건</div>
          <div className="text-gray-500">₩{(supplier.totalAmount / 10000).toFixed(0)}만원</div>
        </div>
      ),
    },
    {
      key: 'status',
      label: '상태',
      render: (supplier: any) => <StatusBadge status={supplier.status} />,
    },
    {
      key: 'actions',
      label: '관리',
      render: (supplier: any) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditSupplier(supplier)}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteSupplier(supplier)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  const orderFormFields = [
    {
      name: 'store',
      label: '요청 매장',
      type: 'select' as const,
      options: [
        { value: '강남점', label: '강남점' },
        { value: '홍대점', label: '홍대점' },
        { value: '신촌점', label: '신촌점' },
        { value: '잠실점', label: '잠실점' },
      ],
      required: true,
    },
    {
      name: 'supplier',
      label: '공급업체',
      type: 'select' as const,
      options: suppliers.map(s => ({ value: s.name, label: s.name })),
      required: true,
    },
    {
      name: 'expectedDate',
      label: '희망 배송일',
      type: 'date' as const,
      required: true,
    },
    {
      name: 'urgency',
      label: '긴급도',
      type: 'select' as const,
      options: [
        { value: '낮음', label: '낮음' },
        { value: '보통', label: '보통' },
        { value: '높음', label: '높음' },
      ],
      required: true,
    },
  ];

  const supplierFormFields = [
    {
      name: 'name',
      label: '업체명',
      type: 'text' as const,
      required: true,
    },
    {
      name: 'category',
      label: '카테고리',
      type: 'select' as const,
      options: [
        { value: '농산물', label: '농산물' },
        { value: '육류', label: '육류' },
        { value: '수산물', label: '수산물' },
        { value: '유제품', label: '유제품' },
        { value: '기타', label: '기타' },
      ],
      required: true,
    },
    {
      name: 'contact',
      label: '담당자',
      type: 'text' as const,
      required: true,
    },
    {
      name: 'phone',
      label: '연락처',
      type: 'tel' as const,
      required: true,
    },
    {
      name: 'email',
      label: '이메일',
      type: 'email' as const,
      required: true,
    },
    {
      name: 'address',
      label: '주소',
      type: 'text' as const,
      required: true,
    },
    {
      name: 'paymentTerms',
      label: '결제조건',
      type: 'select' as const,
      options: [
        { value: '선결제', label: '선결제' },
        { value: '월말정산', label: '월말정산' },
        { value: '주간정산', label: '주간정산' },
      ],
      required: true,
    },
  ];

  const handleAddOrder = (formData: any) => {
    const newOrder = {
      id: orders.length + 1,
      orderNumber: `PO-2024-${String(orders.length + 1).padStart(3, '0')}`,
      ...formData,
      items: [],
      totalAmount: 0,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: null,
      status: '발주완료',
      approver: '관리자',
    };
    
    setOrders([...orders, newOrder]);
    setShowAddOrderModal(false);
    toast.success('발주가 등록되었습니다.');
  };

  const handleAddSupplier = (formData: any) => {
    const newSupplier = {
      id: suppliers.length + 1,
      ...formData,
      rating: 0,
      totalOrders: 0,
      totalAmount: 0,
      status: '활성',
      contractDate: new Date().toISOString().split('T')[0],
    };
    
    setSuppliers([...suppliers, newSupplier]);
    setShowAddSupplierModal(false);
    toast.success('공급업체가 등록되었습니다.');
  };

  const handleEditOrder = (order: any) => {
    setSelectedItem(order);
    setActiveTab('orders');
    setShowEditModal(true);
  };

  const handleEditSupplier = (supplier: any) => {
    setSelectedItem(supplier);
    setActiveTab('suppliers');
    setShowEditModal(true);
  };

  const handleDeleteOrder = (order: any) => {
    setSelectedItem(order);
    setActiveTab('orders');
    setShowDeleteDialog(true);
  };

  const handleDeleteSupplier = (supplier: any) => {
    setSelectedItem(supplier);
    setActiveTab('suppliers');
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (activeTab === 'orders') {
      setOrders(orders.filter(o => o.id !== selectedItem.id));
      toast.success('발주가 삭제되었습니다.');
    } else {
      setSuppliers(suppliers.filter(s => s.id !== selectedItem.id));
      toast.success('공급업체가 삭제되었습니다.');
    }
    setShowDeleteDialog(false);
    setSelectedItem(null);
  };

  // 필터링된 데이터
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.store.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // 통계 계산
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === '발주완료').length;
  const totalAmount = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = totalAmount / totalOrders || 0;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">물류/발주 관리</h1>
          <p className="text-sm text-gray-600 mt-1">전체 가맹점의 발주와 공급업체를 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddSupplierModal(true)}>
            <Building className="w-4 h-4 mr-2" />
            공급업체 추가
          </Button>
          <Button onClick={() => setShowAddOrderModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            발주 등록
          </Button>
        </div>
      </div>

      {/* KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="총 발주건수"
          value={`${totalOrders}건`}
          icon={Package}
          color="red"
          trend={+12.3}
        />
        <KPICard
          title="처리 대기"
          value={`${pendingOrders}건`}
          icon={Clock}
          color="orange"
          trend={-8.5}
        />
        <KPICard
          title="총 발주금액"
          value={`₩${Math.round(totalAmount / 10000)}만원`}
          icon={DollarSign}
          color="green"
          trend={+15.7}
        />
        <KPICard
          title="평균 발주액"
          value={`₩${Math.round(avgOrderValue / 1000)}천원`}
          icon={TrendingUp}
          color="purple"
          trend={+3.2}
        />
      </div>

      <Tabs defaultValue="orders" className="space-y-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="orders">발주 관리</TabsTrigger>
          <TabsTrigger value="suppliers">공급업체</TabsTrigger>
          <TabsTrigger value="analytics">발주 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          {/* 검색 및 필터 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="발주번호, 매장명, 공급업체로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">전체 상태</option>
                    <option value="발주완료">발주완료</option>
                    <option value="배송중">배송중</option>
                    <option value="배송완료">배송완료</option>
                    <option value="취소">취소</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 발주 목록 테이블 */}
          <DataTable
            data={filteredOrders}
            columns={orderColumns}
            searchKey=""
            title={`발주 목록 (${filteredOrders.length}건)`}
          />
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-6">
          {/* 공급업체 목록 테이블 */}
          <DataTable
            data={suppliers}
            columns={supplierColumns}
            searchKey="name"
            title={`공급업체 목록 (${suppliers.length}개)`}
          />

          {/* 공급업체 성과 요약 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                공급업체 성과 요약
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {suppliers.slice(0, 3).map((supplier, index) => (
                  <div key={supplier.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{supplier.name}</h4>
                      <Badge className="bg-green-100 text-green-700">
                        {supplier.rating}★
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>발주: {supplier.totalOrders}건</div>
                      <div>금액: ₩{(supplier.totalAmount / 10000).toFixed(0)}만원</div>
                      <div>분류: {supplier.category}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* 월별 발주 추이 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                월별 발주 추이
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyOrderData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickFormatter={(value) => value.slice(-2) + '월'} />
                  <YAxis yAxisId="left" tickFormatter={(value) => `${value}건`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `₩${(value/1000000).toFixed(0)}M`} />
                  <Tooltip 
                    formatter={(value: any, name) => [
                      name === 'orders' ? `${value}건` : `₩${(value/10000).toFixed(0)}만원`,
                      name === 'orders' ? '발주건수' : '발주금액'
                    ]}
                    labelFormatter={(label) => `${label.slice(-2)}월`}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="orders" fill="#FF6B6B" name="발주건수" />
                  <Line yAxisId="right" type="monotone" dataKey="amount" stroke="#06D6A0" strokeWidth={3} name="발주금액" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 카테고리별 발주 분석 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>카테고리별 발주 비율</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>발주 현황 요약</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>평균 배송 소요일</span>
                    <span className="font-semibold">2.3일</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>정시 배송률</span>
                    <span className="font-semibold text-kpi-green">94%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>월평균 발주액</span>
                    <span className="font-semibold">₩987만원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>활성 공급업체</span>
                    <span className="font-semibold">{suppliers.filter(s => s.status === '활성').length}개</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* 발주 등록 모달 */}
      <FormModal
        isOpen={showAddOrderModal}
        onClose={() => setShowAddOrderModal(false)}
        onSubmit={handleAddOrder}
        title="발주 등록"
        fields={orderFormFields}
      />

      {/* 공급업체 등록 모달 */}
      <FormModal
        isOpen={showAddSupplierModal}
        onClose={() => setShowAddSupplierModal(false)}
        onSubmit={handleAddSupplier}
        title="공급업체 등록"
        fields={supplierFormFields}
      />

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedItem(null);
        }}
        onConfirm={confirmDelete}
        title={activeTab === 'orders' ? '발주 삭제' : '공급업체 삭제'}
        description={`정말로 ${selectedItem?.orderNumber || selectedItem?.name}을(를) 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
      />
    </div>
  );
}