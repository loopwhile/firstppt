import React, { useState } from 'react';
import { DataTable, Column } from '../Common/DataTable';
import { FormModal } from '../Common/FormModal';
import { ConfirmDialog, useConfirmDialog } from '../Common/ConfirmDialog';
import { StatusBadge } from '../Common/StatusBadge';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Building2, MapPin, Phone, User, Calendar, DollarSign } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// 샘플 데이터
const sampleStores = [
  {
    id: 1,
    name: '강남점',
    owner: '김철수',
    phone: '010-1234-5678',
    email: 'gangnam@franfriend.com',
    address: '서울시 강남구 테헤란로 123',
    openDate: '2024-01-15',
    monthlyRevenue: 45000000,
    status: 'active',
    region: '서울',
    contractType: '가맹',
    deposit: 50000000
  },
  {
    id: 2,
    name: '홍대점',
    owner: '이영희',
    phone: '010-2345-6789',
    email: 'hongdae@franfriend.com',
    address: '서울시 마포구 홍익로 456',
    openDate: '2024-02-01',
    monthlyRevenue: 38000000,
    status: 'preparing',
    region: '서울',
    contractType: '가맹',
    deposit: 50000000
  },
  {
    id: 3,
    name: '신촌점',
    owner: '박민수',
    phone: '010-3456-7890',
    email: 'sinchon@franfriend.com',
    address: '서울시 서대문구 신촌로 789',
    openDate: '2024-01-28',
    monthlyRevenue: 42000000,
    status: 'active',
    region: '서울',
    contractType: '직영',
    deposit: 0
  },
  {
    id: 4,
    name: '부산서면점',
    owner: '최지은',
    phone: '010-4567-8901',
    email: 'seomyeon@franfriend.com',
    address: '부산시 부산진구 서면로 101',
    openDate: '2024-01-10',
    monthlyRevenue: 35000000,
    status: 'warning',
    region: '부산',
    contractType: '가맹',
    deposit: 45000000
  },
  {
    id: 5,
    name: '대구동성로점',
    owner: '정민재',
    phone: '010-5678-9012',
    email: 'dongseong@franfriend.com',
    address: '대구시 중구 동성로 202',
    openDate: '2023-12-20',
    monthlyRevenue: 32000000,
    status: 'active',
    region: '대구',
    contractType: '가맹',
    deposit: 45000000
  }
];

const formFields = [
  { 
    name: 'name', 
    label: '매장명', 
    type: 'text' as const, 
    required: true,
    placeholder: '매장명을 입력하세요'
  },
  { 
    name: 'owner', 
    label: '점주명', 
    type: 'text' as const, 
    required: true,
    placeholder: '점주명을 입력하세요'
  },
  { 
    name: 'phone', 
    label: '연락처', 
    type: 'text' as const, 
    required: true,
    placeholder: '010-0000-0000'
  },
  { 
    name: 'email', 
    label: '이메일', 
    type: 'email' as const, 
    required: true,
    placeholder: 'store@franfriend.com'
  },
  { 
    name: 'address', 
    label: '주소', 
    type: 'text' as const, 
    required: true,
    placeholder: '매장 주소를 입력하세요'
  },
  { 
    name: 'region', 
    label: '지역', 
    type: 'select' as const, 
    required: true,
    options: [
      { value: '서울', label: '서울' },
      { value: '부산', label: '부산' },
      { value: '대구', label: '대구' },
      { value: '인천', label: '인천' },
      { value: '광주', label: '광주' },
      { value: '대전', label: '대전' },
      { value: '울산', label: '울산' },
      { value: '경기', label: '경기도' }
    ]
  },
  { 
    name: 'contractType', 
    label: '계약 유형', 
    type: 'select' as const, 
    required: true,
    options: [
      { value: '가맹', label: '가맹점' },
      { value: '직영', label: '직영점' }
    ]
  },
  { 
    name: 'openDate', 
    label: '개점일', 
    type: 'date' as const, 
    required: true
  },
  { 
    name: 'deposit', 
    label: '보증금 (원)', 
    type: 'number' as const, 
    required: false,
    placeholder: '보증금을 입력하세요'
  }
];

export function StoreManagement() {
  const [stores, setStores] = useState(sampleStores);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dialog, confirm } = useConfirmDialog();

  const filters = [
    { label: '운영중', value: 'active', count: stores.filter(s => s.status === 'active').length },
    { label: '개점 준비', value: 'preparing', count: stores.filter(s => s.status === 'preparing').length },
    { label: '점검 필요', value: 'warning', count: stores.filter(s => s.status === 'warning').length },
    { label: '폐점', value: 'closed', count: stores.filter(s => s.status === 'closed').length }
  ];

  const columns: Column[] = [
    { 
      key: 'name', 
      label: '매장명', 
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-kpi-orange rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-dark-gray">{row.region}</div>
          </div>
        </div>
      )
    },
    { 
      key: 'owner', 
      label: '점주', 
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-sm text-dark-gray">{row.phone}</div>
        </div>
      )
    },
    { 
      key: 'address', 
      label: '주소', 
      render: (value) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      )
    },
    { 
      key: 'monthlyRevenue', 
      label: '월매출', 
      sortable: true,
      render: (value) => (
        <div className="font-medium text-gray-900">
          ₩{(value / 10000).toFixed(0)}만
        </div>
      )
    },
    { 
      key: 'contractType', 
      label: '계약유형', 
      render: (value) => (
        <Badge 
          variant="outline"
          className={value === '직영' ? 'border-kpi-purple text-kpi-purple' : 'border-kpi-green text-kpi-green'}
        >
          {value}
        </Badge>
      )
    },
    { 
      key: 'status', 
      label: '상태', 
      render: (value) => (
        <StatusBadge 
          status={value} 
          text={
            value === 'active' ? '운영중' :
            value === 'preparing' ? '개점 준비' :
            value === 'warning' ? '점검 필요' : '폐점'
          }
        />
      )
    },
    { 
      key: 'openDate', 
      label: '개점일', 
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString('ko-KR')
    }
  ];

  const handleAdd = () => {
    setEditingStore(null);
    setIsModalOpen(true);
  };

  const handleEdit = (store: any) => {
    setEditingStore(store);
    setIsModalOpen(true);
  };

  const handleDelete = (store: any) => {
    confirm({
      title: '매장 삭제',
      description: `${store.name}을(를) 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      type: 'danger',
      confirmText: '삭제',
      onConfirm: () => {
        setStores(prev => prev.filter(s => s.id !== store.id));
        toast.success('매장이 삭제되었습니다.');
      }
    });
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingStore) {
        // 수정
        setStores(prev => prev.map(store => 
          store.id === editingStore.id 
            ? { ...store, ...data, monthlyRevenue: 0 }
            : store
        ));
        toast.success('매장 정보가 수정되었습니다.');
      } else {
        // 추가
        const newStore = {
          ...data,
          id: Math.max(...stores.map(s => s.id)) + 1,
          monthlyRevenue: 0,
          status: 'preparing'
        };
        setStores(prev => [...prev, newStore]);
        toast.success('새 매장이 등록되었습니다.');
      }
      
      setIsModalOpen(false);
    } catch (error) {
      toast.error('오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    // 엑셀 내보내기 로직
    toast.success('매장 목록을 내보냈습니다.');
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">전체 매장</p>
              <p className="text-2xl font-bold text-gray-900">{stores.length}</p>
            </div>
            <Building2 className="w-8 h-8 text-kpi-red" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">운영중</p>
              <p className="text-2xl font-bold text-kpi-green">
                {stores.filter(s => s.status === 'active').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-kpi-green rounded-full flex items-center justify-center">
              <Building2 className="w-4 h-4 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">개점 준비</p>
              <p className="text-2xl font-bold text-kpi-orange">
                {stores.filter(s => s.status === 'preparing').length}
              </p>
            </div>
            <div className="w-8 h-8 bg-kpi-orange rounded-full flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
          </div>
        </Card>
        
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">월 평균 매출</p>
              <p className="text-2xl font-bold text-kpi-purple">
                ₩{(stores.reduce((sum, s) => sum + s.monthlyRevenue, 0) / stores.length / 10000).toFixed(0)}만
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-kpi-purple" />
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={stores}
        columns={columns}
        title="가맹점 관리"
        searchPlaceholder="매장명, 점주명, 주소로 검색"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        addButtonText="매장 등록"
        filters={filters}
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingStore ? '매장 정보 수정' : '새 매장 등록'}
        fields={formFields}
        onSubmit={handleSubmit}
        initialData={editingStore || {}}
        isLoading={isLoading}
        maxWidth="lg"
      />

      {/* Confirm Dialog */}
      {dialog}
    </div>
  );
}