import React, { useState } from 'react';
import { DataTable, Column } from '../Common/DataTable';
import { FormModal } from '../Common/FormModal';
import { ConfirmDialog, useConfirmDialog } from '../Common/ConfirmDialog';
import { StatusBadge } from '../Common/StatusBadge';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { 
  Package, 
  AlertTriangle, 
  TrendingDown,
  ShoppingCart,
  Truck,
  Calendar,
  BarChart3,
  Plus,
  RefreshCw,
  Factory,
  Users,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// HQ 전체 자재 재고 샘플 데이터
const sampleInventory = [
  {
    id: 1,
    name: '치킨패티',
    category: '주재료',
    code: 'CHK001',
    totalStock: 2450,
    distributedStock: 2100,
    warehouseStock: 350,
    minStock: 500,
    maxStock: 3000,
    unit: '개',
    unitPrice: 1200,
    lastRestocked: '2024-12-28',
    expiryDate: '2025-01-15',
    supplier: 'ABC 식자재',
    status: 'sufficient',
    weeklyUsage: 420,
    storesUsingCount: 12
  },
  {
    id: 2,
    name: '감자',
    category: '주재료',
    code: 'POT002',
    totalStock: 180,
    distributedStock: 160,
    warehouseStock: 20,
    minStock: 200,
    maxStock: 800,
    unit: 'kg',
    unitPrice: 2500,
    lastRestocked: '2024-12-25',
    expiryDate: '2025-01-10',
    supplier: 'XYZ 농산',
    status: 'low',
    weeklyUsage: 85,
    storesUsingCount: 8
  },
  {
    id: 3,
    name: '콜라시럽',
    category: '음료',
    code: 'COL003',
    totalStock: 45,
    distributedStock: 40,
    warehouseStock: 5,
    minStock: 50,
    maxStock: 200,
    unit: '통',
    unitPrice: 15000,
    lastRestocked: '2024-12-20',
    expiryDate: '2025-06-20',
    supplier: '음료 공급업체',
    status: 'critical',
    weeklyUsage: 20,
    storesUsingCount: 15
  },
  {
    id: 4,
    name: '치즈',
    category: '주재료',
    code: 'CHE004',
    totalStock: 240,
    distributedStock: 200,
    warehouseStock: 40,
    minStock: 150,
    maxStock: 500,
    unit: 'kg',
    unitPrice: 8000,
    lastRestocked: '2024-12-29',
    expiryDate: '2025-01-12',
    supplier: '유제품 공급업체',
    status: 'sufficient',
    weeklyUsage: 60,
    storesUsingCount: 10
  },
  {
    id: 5,
    name: '양상추',
    category: '채소',
    code: 'LET005',
    totalStock: 0,
    distributedStock: 0,
    warehouseStock: 0,
    minStock: 80,
    maxStock: 200,
    unit: 'kg',
    unitPrice: 3500,
    lastRestocked: '2024-12-26',
    expiryDate: '2025-01-03',
    supplier: '신선 채소',
    status: 'out',
    weeklyUsage: 45,
    storesUsingCount: 12
  },
  {
    id: 6,
    name: '포장지',
    category: '포장재',
    code: 'PKG006',
    totalStock: 15000,
    distributedStock: 12000,
    warehouseStock: 3000,
    minStock: 5000,
    maxStock: 20000,
    unit: '개',
    unitPrice: 50,
    lastRestocked: '2024-12-30',
    expiryDate: '2026-12-30',
    supplier: '포장재 공급업체',
    status: 'sufficient',
    weeklyUsage: 1200,
    storesUsingCount: 15
  }
];

// 공급업체별 발주 현황
const sampleSupplierOrders = [
  {
    id: 'SO-001',
    supplier: 'ABC 식자재',
    items: ['치킨패티', '소고기패티'],
    orderDate: '2024-12-30',
    expectedDate: '2025-01-03',
    status: 'pending',
    total: 2400000,
    urgency: 'high'
  },
  {
    id: 'SO-002',
    supplier: 'XYZ 농산',
    items: ['감자', '양파', '양상추'],
    orderDate: '2024-12-29',
    expectedDate: '2025-01-02',
    status: 'approved',
    total: 850000,
    urgency: 'high'
  },
  {
    id: 'SO-003',
    supplier: '포장재 공급업체',
    items: ['포장지', '컵', '빨대'],
    orderDate: '2024-12-28',
    expectedDate: '2025-01-05',
    status: 'shipping',
    total: 450000,
    urgency: 'normal'
  }
];

const formFields = [
  { 
    name: 'name', 
    label: '자재명', 
    type: 'text' as const, 
    required: true,
    placeholder: '자재명을 입력하세요'
  },
  { 
    name: 'code', 
    label: '자재 코드', 
    type: 'text' as const, 
    required: true,
    placeholder: 'ABC001 형식으로 입력'
  },
  { 
    name: 'category', 
    label: '카테고리', 
    type: 'select' as const, 
    required: true,
    options: [
      { value: '주재료', label: '주재료' },
      { value: '부재료', label: '부재료' },
      { value: '채소', label: '채소' },
      { value: '음료', label: '음료' },
      { value: '포장재', label: '포장재' },
      { value: '기타', label: '기타' }
    ]
  },
  { 
    name: 'supplier', 
    label: '공급업체', 
    type: 'text' as const, 
    required: true,
    placeholder: '공급업체명을 입력하세요'
  },
  { 
    name: 'unitPrice', 
    label: '단가 (원)', 
    type: 'number' as const, 
    required: true,
    placeholder: '단가를 입력하세요'
  },
  { 
    name: 'unit', 
    label: '단위', 
    type: 'text' as const, 
    required: true,
    placeholder: 'kg, 개, 통 등'
  },
  { 
    name: 'minStock', 
    label: '최소 재고', 
    type: 'number' as const, 
    required: true,
    placeholder: '최소 재고량'
  },
  { 
    name: 'maxStock', 
    label: '최대 재고', 
    type: 'number' as const, 
    required: true,
    placeholder: '최대 재고량'
  },
  { 
    name: 'expiryDate', 
    label: '유통기한', 
    type: 'date' as const, 
    required: false
  }
];

export function HQInventoryManagement() {
  const [currentView, setCurrentView] = useState<'inventory' | 'orders'>('inventory');
  const [inventory, setInventory] = useState(sampleInventory);
  const [orders, setOrders] = useState(sampleSupplierOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit' | 'distribute'>('add');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dialog, confirm } = useConfirmDialog();

  const inventoryFilters = [
    { label: '충분', value: 'sufficient', count: inventory.filter(i => i.status === 'sufficient').length },
    { label: '부족', value: 'low', count: inventory.filter(i => i.status === 'low').length },
    { label: '위험', value: 'critical', count: inventory.filter(i => i.status === 'critical').length },
    { label: '품절', value: 'out', count: inventory.filter(i => i.status === 'out').length }
  ];

  const orderFilters = [
    { label: '긴급', value: 'high', count: orders.filter(o => o.urgency === 'high').length },
    { label: '일반', value: 'normal', count: orders.filter(o => o.urgency === 'normal').length },
    { label: '대기중', value: 'pending', count: orders.filter(o => o.status === 'pending').length },
    { label: '배송중', value: 'shipping', count: orders.filter(o => o.status === 'shipping').length }
  ];

  const inventoryColumns: Column[] = [
    { 
      key: 'name', 
      label: '자재정보', 
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-dark-gray">{row.category}</div>
          <div className="text-xs text-dark-gray">코드: {row.code}</div>
        </div>
      )
    },
    { 
      key: 'totalStock', 
      label: '재고현황', 
      sortable: true,
      render: (value, row) => {
        const percentage = (value / row.maxStock) * 100;
        const isLow = value <= row.minStock;
        
        return (
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`font-medium ${isLow ? 'text-kpi-red' : 'text-gray-900'}`}>
                총 {(value || 0).toLocaleString()} {row.unit}
              </span>
              {isLow && <AlertTriangle className="w-4 h-4 text-kpi-red" />}
            </div>
            <div className="text-xs text-dark-gray space-y-1">
              <div>창고: {(row.warehouseStock || 0).toLocaleString()} {row.unit}</div>
              <div>배송: {(row.distributedStock || 0).toLocaleString()} {row.unit}</div>
            </div>
            <Progress 
              value={percentage} 
              className={`h-2 mt-2 ${
                percentage <= 20 ? '[&>div]:bg-kpi-red' :
                percentage <= 50 ? '[&>div]:bg-kpi-orange' : '[&>div]:bg-kpi-green'
              }`}
            />
          </div>
        );
      }
    },
    { 
      key: 'weeklyUsage', 
      label: '사용량', 
      sortable: true,
      render: (value, row) => {
        const daysLeft = Math.floor(row.totalStock / (value / 7));
        return (
          <div>
            <div className="font-medium text-gray-900">{(value || 0).toLocaleString()} {row.unit}/주</div>
            <div className={`text-xs ${daysLeft <= 7 ? 'text-kpi-red' : 'text-dark-gray'}`}>
              약 {daysLeft}일분
            </div>
            <div className="text-xs text-dark-gray">
              {row.storesUsingCount}개 매장 사용
            </div>
          </div>
        );
      }
    },
    { 
      key: 'supplier', 
      label: '공급업체', 
      render: (value, row) => (
        <div>
          <div className="text-sm text-gray-900">{value}</div>
          <div className="text-xs text-dark-gray">
            ₩{(row.unitPrice || 0).toLocaleString()}/{row.unit}
          </div>
        </div>
      )
    },
    { 
      key: 'status', 
      label: '상태', 
      render: (value) => (
        <StatusBadge 
          status={
            value === 'sufficient' ? 'active' :
            value === 'low' ? 'warning' :
            value === 'critical' ? 'warning' : 'closed'
          }
          text={
            value === 'sufficient' ? '충분' :
            value === 'low' ? '부족' :
            value === 'critical' ? '위험' : '품절'
          }
        />
      )
    }
  ];

  const orderColumns: Column[] = [
    { 
      key: 'id', 
      label: '발주정보', 
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-dark-gray">{row.supplier}</div>
          <div className="text-xs text-dark-gray">
            발주일: {new Date(row.orderDate).toLocaleDateString('ko-KR')}
          </div>
        </div>
      )
    },
    { 
      key: 'items', 
      label: '발주품목', 
      render: (value) => (
        <div className="space-y-1">
          {value.slice(0, 2).map((item: string, index: number) => (
            <div key={index} className="text-sm text-gray-900">
              {item}
            </div>
          ))}
          {value.length > 2 && (
            <div className="text-xs text-dark-gray">외 {value.length - 2}개</div>
          )}
        </div>
      )
    },
    { 
      key: 'total', 
      label: '총액', 
      sortable: true,
      render: (value) => (
        <div className="font-medium text-gray-900">
          ₩{(value || 0).toLocaleString()}
        </div>
      )
    },
    { 
      key: 'urgency', 
      label: '우선순위', 
      render: (value) => (
        <Badge 
          className={
            value === 'high' ? 'bg-kpi-red text-white' : 'bg-kpi-green text-white'
          }
        >
          {value === 'high' ? '긴급' : '일반'}
        </Badge>
      )
    },
    { 
      key: 'status', 
      label: '상태', 
      render: (value) => (
        <StatusBadge 
          status={
            value === 'pending' ? 'preparing' :
            value === 'approved' ? 'active' :
            value === 'shipping' ? 'normal' : 'active'
          }
          text={
            value === 'pending' ? '대기중' :
            value === 'approved' ? '승인됨' :
            value === 'shipping' ? '배송중' : '완료'
          }
        />
      )
    }
  ];

  const handleAdd = () => {
    setSelectedItem(null);
    setModalType('add');
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setModalType('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (item: any) => {
    confirm({
      title: '자재 삭제',
      description: `${item.name}을(를) 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      type: 'danger',
      confirmText: '삭제',
      onConfirm: () => {
        setInventory(prev => prev.filter(i => i.id !== item.id));
        toast.success('자재가 삭제되었습니다.');
      }
    });
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (modalType === 'edit' && selectedItem) {
        setInventory(prev => prev.map(item => 
          item.id === selectedItem.id 
            ? { ...item, ...data }
            : item
        ));
        toast.success('자재 정보가 수정되었습니다.');
      } else {
        const newItem = {
          ...data,
          id: Math.max(...inventory.map(i => i.id)) + 1,
          totalStock: 0,
          distributedStock: 0,
          warehouseStock: 0,
          status: 'out',
          weeklyUsage: 0,
          storesUsingCount: 0,
          lastRestocked: new Date().toISOString().split('T')[0]
        };
        setInventory(prev => [...prev, newItem]);
        toast.success('새 자재가 등록되었습니다.');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      toast.error('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    toast.success('재고 현황을 내보냈습니다.');
  };

  // 통계 계산
  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(i => i.status === 'low' || i.status === 'critical' || i.status === 'out').length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.totalStock * item.unitPrice), 0);
  const urgentOrders = orders.filter(o => o.urgency === 'high').length;

  if (currentView === 'orders') {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">공급업체 발주 관리</h2>
            <p className="text-sm text-dark-gray">전체 공급업체 발주 현황</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => setCurrentView('inventory')}
              variant="outline"
            >
              재고 관리
            </Button>
          </div>
        </div>

        {/* Orders Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-gray mb-1">총 발주 건수</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <Truck className="w-8 h-8 text-kpi-green" />
            </div>
          </Card>
          
          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-gray mb-1">긴급 발주</p>
                <p className="text-2xl font-bold text-kpi-red">{urgentOrders}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-kpi-red" />
            </div>
          </Card>
          
          <Card className="p-6 bg-white rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-dark-gray mb-1">총 발주 금액</p>
                <p className="text-2xl font-bold text-kpi-purple">
                  ₩{(orders.reduce((sum, o) => sum + o.total, 0) / 10000).toFixed(0)}만
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-kpi-purple" />
            </div>
          </Card>
        </div>

        {/* Orders Table */}
        <DataTable
          data={orders}
          columns={orderColumns}
          title="발주 목록"
          searchPlaceholder="발주번호, 공급업체로 검색"
          filters={orderFilters}
          showActions={false}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">총 자재</p>
              <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
              <p className="text-xs text-dark-gray">관리 자재 수</p>
            </div>
            <Package className="w-8 h-8 text-kpi-green" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">재고 부족</p>
              <p className="text-2xl font-bold text-kpi-red">{lowStockItems}</p>
              <p className="text-xs text-dark-gray">긴급 조치 필요</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-kpi-red" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">총 재고 가치</p>
              <p className="text-2xl font-bold text-kpi-orange">
                ₩{(totalValue / 100000000).toFixed(1)}억
              </p>
              <p className="text-xs text-dark-gray">전체 자재 가치</p>
            </div>
            <BarChart3 className="w-8 h-8 text-kpi-orange" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">가맹점</p>
              <p className="text-2xl font-bold text-kpi-purple">15</p>
              <p className="text-xs text-dark-gray">자재 공급 매장</p>
            </div>
            <Users className="w-8 h-8 text-kpi-purple" />
          </div>
        </Card>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">본사 재고 관리</h2>
          <p className="text-sm text-dark-gray">전체 자재 재고 현황 및 관리</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={() => setCurrentView('orders')}
            variant="outline"
          >
            <Truck className="w-4 h-4 mr-2" />
            발주 현황
          </Button>
          <Button 
            onClick={handleAdd}
            className="bg-kpi-red hover:bg-red-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            자재 등록
          </Button>
        </div>
      </div>

      {/* Critical Stock Alert */}
      {lowStockItems > 0 && (
        <Card className="p-6 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="w-6 h-6 text-kpi-red" />
            <div>
              <h3 className="font-semibold text-gray-900">재고 부족 알림</h3>
              <p className="text-sm text-dark-gray">{lowStockItems}개 자재의 재고가 부족합니다. 긴급 발주가 필요합니다.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {inventory.filter(i => i.status === 'low' || i.status === 'critical' || i.status === 'out').slice(0, 4).map((item) => (
              <div key={item.id} className="p-3 bg-white rounded-lg border border-red-200">
                <div className="font-medium text-gray-900">{item.name}</div>
                <div className="text-sm text-dark-gray">{item.totalStock}/{item.minStock} {item.unit}</div>
                <div className="text-xs text-kpi-red">{item.storesUsingCount}개 매장 영향</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Data Table */}
      <DataTable
        data={inventory}
        columns={inventoryColumns}
        title="자재 재고 현황"
        searchPlaceholder="자재명, 코드, 공급업체로 검색"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        addButtonText="자재 등록"
        filters={inventoryFilters}
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalType === 'edit' ? '자재 정보 수정' : '새 자재 등록'}
        fields={formFields}
        onSubmit={handleSubmit}
        initialData={selectedItem || {}}
        isLoading={isLoading}
        maxWidth="lg"
      />

      {/* Confirm Dialog */}
      {dialog}
    </div>
  );
}