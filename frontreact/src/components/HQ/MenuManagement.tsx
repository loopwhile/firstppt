import React, { useState } from 'react';
import { DataTable, Column } from '../Common/DataTable';
import { FormModal } from '../Common/FormModal';
import { ConfirmDialog, useConfirmDialog } from '../Common/ConfirmDialog';
import { StatusBadge } from '../Common/StatusBadge';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Package, ChefHat, DollarSign, TrendingUp, Star, Camera } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// 샘플 데이터
const sampleMenus = [
  {
    id: 1,
    name: '치킨버거',
    category: '버거',
    price: 8500,
    cost: 3200,
    description: '바삭한 치킨패티와 신선한 야채가 들어간 시그니처 버거',
    ingredients: '치킨패티, 양상추, 토마토, 마요네즈, 피클',
    allergens: '글루텐, 계란',
    calories: 520,

    status: 'active',
    popularity: 95,
    monthlySales: 2840,
    image: '🍔'
  },
  {
    id: 2,
    name: '불고기버거',
    category: '버거',
    price: 9000,
    cost: 3500,
    description: '한국식 불고기와 치즈가 만나는 특별한 맛',
    ingredients: '불고기패티, 치즈, 양파, 불고기소스',
    allergens: '글루텐, 유제품',
    calories: 580,

    status: 'active',
    popularity: 88,
    monthlySales: 2650,
    image: '🍔'
  },
  {
    id: 3,
    name: '새우버거',
    category: '버거',
    price: 9500,
    cost: 4200,
    description: '통통한 새우패티로 만든 프리미엄 버거',
    ingredients: '새우패티, 아보카도, 양상추, 타르타르소스',
    allergens: '글루텐, 갑각류, 계란',
    calories: 490,

    status: 'active',
    popularity: 92,
    monthlySales: 2180,
    image: '🍤'
  },
  {
    id: 4,
    name: '감자튀김(L)',
    category: '사이드',
    price: 3500,
    cost: 1200,
    description: '바삭하게 튀긴 황금 감자튀김',
    ingredients: '감자, 식용유, 소금',
    allergens: '-',
    calories: 320,

    status: 'active',
    popularity: 96,
    monthlySales: 3200,
    image: '🍟'
  },
  {
    id: 5,
    name: '콜라(L)',
    category: '음료',
    price: 2500,
    cost: 800,
    description: '시원하고 상쾌한 콜라',
    ingredients: '탄산수, 콜라시럽, 얼음',
    allergens: '-',
    calories: 150,

    status: 'active',
    popularity: 85,
    monthlySales: 4200,
    image: '🥤'
  },
  {
    id: 6,
    name: '치즈스틱',
    category: '사이드',
    price: 4500,
    cost: 1800,
    description: '겉은 바삭, 속은 쫄깃한 모짜렐라 치즈스틱',
    ingredients: '모짜렐라치즈, 밀가루, 빵가루',
    allergens: '글루텐, 유제품',
    calories: 380,

    status: 'preparing',
    popularity: 0,
    monthlySales: 0,
    image: '🧀'
  }
];

const formFields = [
  { 
    name: 'name', 
    label: '메뉴명', 
    type: 'text' as const, 
    required: true,
    placeholder: '메뉴명을 입력하세요'
  },
  { 
    name: 'category', 
    label: '카테고리', 
    type: 'select' as const, 
    required: true,
    options: [
      { value: '버거', label: '버거' },
      { value: '사이드', label: '사이드' },
      { value: '음료', label: '음료' },
      { value: '디저트', label: '디저트' },
      { value: '세트', label: '세트' }
    ]
  },
  { 
    name: 'price', 
    label: '판매가격 (원)', 
    type: 'number' as const, 
    required: true,
    placeholder: '판매가격을 입력하세요'
  },
  { 
    name: 'cost', 
    label: '원가 (원)', 
    type: 'number' as const, 
    required: true,
    placeholder: '원가를 입력하세요'
  },
  { 
    name: 'description', 
    label: '메뉴 설명', 
    type: 'textarea' as const, 
    required: false,
    placeholder: '메뉴에 대한 설명을 입력하세요'
  },
  { 
    name: 'ingredients', 
    label: '주재료', 
    type: 'text' as const, 
    required: false,
    placeholder: '주재료를 쉼표(,)로 구분해서 입력하세요'
  },
  { 
    name: 'allergens', 
    label: '알레르기 정보', 
    type: 'text' as const, 
    required: false,
    placeholder: '알레르기 유발 요소 (없으면 - 입력)'
  },
  { 
    name: 'calories', 
    label: '칼로리 (kcal)', 
    type: 'number' as const, 
    required: false,
    placeholder: '칼로리를 입력하세요'
  },

  { 
    name: 'image', 
    label: '메뉴 이미지', 
    type: 'file' as const, 
    required: false
  }
];

export function MenuManagement() {
  const [menus, setMenus] = useState(sampleMenus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dialog, confirm } = useConfirmDialog();

  const filters = [
    { label: '판매중', value: 'active', count: menus.filter(m => m.status === 'active').length },
    { label: '준비중', value: 'preparing', count: menus.filter(m => m.status === 'preparing').length },
    { label: '단종', value: 'discontinued', count: menus.filter(m => m.status === 'discontinued').length }
  ];

  const columns: Column[] = [
    { 
      key: 'name', 
      label: '메뉴정보', 
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-kpi-orange to-kpi-red rounded-lg flex items-center justify-center text-lg">
            {row.image}
          </div>
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-dark-gray">{row.category}</div>
            <div className="text-xs text-dark-gray">
              {row.calories}kcal
            </div>
          </div>
        </div>
      )
    },
    { 
      key: 'price', 
      label: '가격정보', 
      sortable: true,
      render: (value, row) => {
        const margin = ((value - row.cost) / value * 100).toFixed(1);
        const marginColor = parseFloat(margin) >= 60 ? 'text-kpi-green' : 
                           parseFloat(margin) >= 40 ? 'text-kpi-orange' : 'text-kpi-red';
        
        return (
          <div>
            <div className="font-medium text-gray-900">₩{(value || 0).toLocaleString()}</div>
            <div className="text-sm text-dark-gray">원가: ₩{(row.cost || 0).toLocaleString()}</div>
            <div className={`text-xs font-medium ${marginColor}`}>
              마진율: {margin}%
            </div>
          </div>
        );
      }
    },
    { 
      key: 'monthlySales', 
      label: '판매량', 
      sortable: true,
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{(value || 0).toLocaleString()}개</div>
          <div className="flex items-center gap-1 text-sm text-dark-gray">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            인기도: {row.popularity}%
          </div>
        </div>
      )
    },
    { 
      key: 'ingredients', 
      label: '주재료', 
      render: (value) => (
        <div className="max-w-xs">
          <div className="text-sm text-gray-900 truncate" title={value}>
            {value}
          </div>
        </div>
      )
    },
    { 
      key: 'allergens', 
      label: '알레르기', 
      render: (value) => (
        <div className="text-sm text-gray-900">
          {value === '-' ? (
            <Badge variant="outline" className="border-kpi-green text-kpi-green">
              없음
            </Badge>
          ) : (
            <Badge variant="outline" className="border-kpi-orange text-kpi-orange">
              {value}
            </Badge>
          )}
        </div>
      )
    },
    { 
      key: 'status', 
      label: '상태', 
      render: (value) => (
        <StatusBadge 
          status={value === 'active' ? 'active' : value === 'preparing' ? 'preparing' : 'closed'}
          text={
            value === 'active' ? '판매중' :
            value === 'preparing' ? '준비중' : '단종'
          }
        />
      )
    }
  ];

  const handleAdd = () => {
    setEditingMenu(null);
    setIsModalOpen(true);
  };

  const handleEdit = (menu: any) => {
    setEditingMenu(menu);
    setIsModalOpen(true);
  };

  const handleDelete = (menu: any) => {
    confirm({
      title: '메뉴 삭제',
      description: `${menu.name}을(를) 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
      type: 'danger',
      confirmText: '삭제',
      onConfirm: () => {
        setMenus(prev => prev.filter(m => m.id !== menu.id));
        toast.success('메뉴가 삭제되었습니다.');
      }
    });
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      // API 호출 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingMenu) {
        // 수정
        setMenus(prev => prev.map(menu => 
          menu.id === editingMenu.id 
            ? { ...menu, ...data, image: data.image || menu.image }
            : menu
        ));
        toast.success('메뉴 정보가 수정되었습니다.');
      } else {
        // 추가
        const newMenu = {
          ...data,
          id: Math.max(...menus.map(m => m.id)) + 1,
          popularity: 0,
          monthlySales: 0,
          status: 'preparing',
          image: '🍽️' // 기본 이미지
        };
        setMenus(prev => [...prev, newMenu]);
        toast.success('새 메뉴가 등록되었습니다.');
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
    toast.success('메뉴 목록을 내보냈습니다.');
  };

  // 통계 계산
  const totalRevenue = menus.reduce((sum, menu) => sum + (menu.price * menu.monthlySales), 0);
  const totalCost = menus.reduce((sum, menu) => sum + (menu.cost * menu.monthlySales), 0);
  const averageMargin = ((totalRevenue - totalCost) / totalRevenue * 100) || 0;
  const topSellingMenu = menus.reduce((max, menu) => menu.monthlySales > max.monthlySales ? menu : max, menus[0]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">전체 메뉴</p>
              <p className="text-2xl font-bold text-gray-900">{menus.length}</p>
              <p className="text-xs text-kpi-green">판매중: {menus.filter(m => m.status === 'active').length}</p>
            </div>
            <ChefHat className="w-8 h-8 text-kpi-red" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">월 매출</p>
              <p className="text-2xl font-bold text-kpi-green">
                ₩{(totalRevenue / 10000).toFixed(0)}만
              </p>
              <p className="text-xs text-dark-gray">원가: ₩{(totalCost / 10000).toFixed(0)}만</p>
            </div>
            <DollarSign className="w-8 h-8 text-kpi-green" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">평균 마진율</p>
              <p className="text-2xl font-bold text-kpi-orange">
                {averageMargin.toFixed(1)}%
              </p>
              <p className="text-xs text-dark-gray">수익: ₩{((totalRevenue - totalCost) / 10000).toFixed(0)}만</p>
            </div>
            <TrendingUp className="w-8 h-8 text-kpi-orange" />
          </div>
        </Card>
        
        <Card className="p-6 bg-white rounded-xl shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-dark-gray mb-1">최고 인기</p>
              <p className="text-lg font-bold text-kpi-purple">{topSellingMenu?.name}</p>
              <p className="text-xs text-dark-gray">{(topSellingMenu?.monthlySales || 0).toLocaleString()}개 판매</p>
            </div>
            <div className="text-2xl">{topSellingMenu?.image}</div>
          </div>
        </Card>
      </div>

      {/* Data Table */}
      <DataTable
        data={menus}
        columns={columns}
        title="메뉴 관리"
        searchPlaceholder="메뉴명, 카테고리, 재료로 검색"
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onExport={handleExport}
        addButtonText="메뉴 등록"
        filters={filters}
      />

      {/* Form Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingMenu ? '메뉴 정보 수정' : '새 메뉴 등록'}
        fields={formFields}
        onSubmit={handleSubmit}
        initialData={editingMenu || {}}
        isLoading={isLoading}
        maxWidth="lg"
      />

      {/* Confirm Dialog */}
      {dialog}
    </div>
  );
}