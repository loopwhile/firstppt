import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Clock,
  User,
  ChefHat,
  Bell,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Volume2,
  VolumeX,
  Settings,
  Zap,
  Package
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

interface KitchenOrder {
  id: string;
  items: OrderItem[];
  total: number;
  originalTotal: number;
  discount: number;
  status: 'preparing' | 'cooking' | 'ready' | 'completed';
  orderTime: Date;
  customer?: string;
  paymentMethod: string;
  orderType: '방문' | '포장' | '배달';
  priority?: 'normal' | 'urgent';
  notes?: string;
}

// 샘플 주방 주문 데이터
const sampleKitchenOrders: KitchenOrder[] = [
  {
    id: '#001',
    items: [
      { id: 1, name: '치킨버거세트', price: 12500, quantity: 2, image: '🍔' },
      { id: 5, name: '햄치즈토스트', price: 4500, quantity: 1, image: '🥪' }
    ],
    total: 29500,
    originalTotal: 29500,
    discount: 0,
    status: 'cooking',
    orderTime: new Date(Date.now() - 300000), // 5분 전
    customer: '김고객',
    paymentMethod: '카드',
    orderType: '방문',
    priority: 'urgent'
  },
  {
    id: '#002',
    items: [
      { id: 2, name: '불고기버거세트', price: 13000, quantity: 1, image: '🍔' }
    ],
    total: 13000,
    originalTotal: 13000,
    discount: 0,
    status: 'preparing',
    orderTime: new Date(Date.now() - 120000), // 2분 전
    customer: '이고객',
    paymentMethod: '현금',
    orderType: '포장',
    priority: 'normal'
  },
  {
    id: '#003',
    items: [
      { id: 4, name: '치즈버거세트', price: 11500, quantity: 1, image: '🍔' },
      { id: 7, name: '참치토스트', price: 4800, quantity: 2, image: '🥪' }
    ],
    total: 21100,
    originalTotal: 21100,
    discount: 0,
    status: 'preparing',
    orderTime: new Date(Date.now() - 60000), // 1분 전
    paymentMethod: '상품권',
    orderType: '배달',
    priority: 'normal'
  },
  {
    id: '#004',
    items: [
      { id: 6, name: '베이컨토스트', price: 5000, quantity: 3, image: '🥪' }
    ],
    total: 15000,
    originalTotal: 15000,
    discount: 0,
    status: 'ready',
    orderTime: new Date(Date.now() - 600000), // 10분 전
    customer: '박고객',
    paymentMethod: '카드',
    orderType: '방문',
    priority: 'normal'
  }
];

export function KitchenDisplay() {
  // localStorage에서 주문 데이터 가져오기
  const getOrdersFromStorage = () => {
    try {
      const storedOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
      if (storedOrders.length > 0) {
        // Date 문자열을 Date 객체로 변환하고 주방 화면에 필요한 주문만 필터링
        return storedOrders
          .map((order: any) => ({
            ...order,
            orderTime: new Date(order.orderTime)
          }))
          .filter((order: any) => 
            order.status === 'preparing' || 
            order.status === 'cooking' || 
            order.status === 'ready'
          );
      }
      return sampleKitchenOrders.filter(order => 
        order.status === 'preparing' || 
        order.status === 'cooking' || 
        order.status === 'ready'
      );
    } catch (error) {
      console.error('주방 주문 데이터 로드 오류:', error);
      return sampleKitchenOrders.filter(order => 
        order.status === 'preparing' || 
        order.status === 'cooking' || 
        order.status === 'ready'
      );
    }
  };

  const [orders, setOrders] = useState<KitchenOrder[]>(getOrdersFromStorage());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // localStorage 변경 감지 및 주문 데이터 자동 업데이트
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedOrders = getOrdersFromStorage();
      setOrders(updatedOrders);
    };

    // storage 이벤트 리스너 등록
    window.addEventListener('storage', handleStorageChange);

    // 컴포넌트가 포커스될 때마다 데이터 새로고침
    const handleFocus = () => {
      const updatedOrders = getOrdersFromStorage();
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

  // 자동 새로고침
  useEffect(() => {
    if (!autoRefresh) return;

    const refreshTimer = setInterval(() => {
      const updatedOrders = getOrdersFromStorage();
      setOrders(updatedOrders);
    }, 10000); // 10초마다

    return () => clearInterval(refreshTimer);
  }, [autoRefresh]);

  // 주문 상태 업데이트
  const updateOrderStatus = (orderId: string, newStatus: KitchenOrder['status']) => {
    // 로컬 state 업데이트
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      )
    );

    // localStorage의 전체 주문 목록도 업데이트
    try {
      const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
      const updatedAllOrders = allOrders.map((order: any) => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      );
      localStorage.setItem('allOrders', JSON.stringify(updatedAllOrders));
    } catch (error) {
      console.error('주문 상태 업데이트 오류:', error);
    }

    if (soundEnabled && newStatus === 'ready') {
      // 실제 구현에서는 알림음 재생
      toast.success(`주문 ${orderId} 조리 완료!`);
    }

    // 완료된 주문은 주방 화면에서 제거
    if (newStatus === 'completed') {
      setTimeout(() => {
        setOrders(prevOrders => prevOrders.filter(order => order.id !== orderId));
      }, 2000); // 2초 후 제거
    }
  };

  // 주문 완료 처리 (픽업 완료)
  const completeOrder = (orderId: string) => {
    // localStorage의 전체 주문 목록에서 상태를 'completed'로 업데이트
    try {
      const allOrders = JSON.parse(localStorage.getItem('allOrders') || '[]');
      const updatedAllOrders = allOrders.map((order: any) => 
        order.id === orderId 
          ? { ...order, status: 'completed' }
          : order
      );
      localStorage.setItem('allOrders', JSON.stringify(updatedAllOrders));
    } catch (error) {
      console.error('주문 완료 처리 오류:', error);
    }

    // 주방 화면에서 제거
    setOrders(prevOrders => 
      prevOrders.filter(order => order.id !== orderId)
    );
    toast.success(`주문 ${orderId} 픽업 완료`);
  };

  // 경과 시간 계산
  const getElapsedTime = (orderTime: Date) => {
    const elapsed = Math.floor((currentTime.getTime() - orderTime.getTime()) / 1000 / 60);
    return elapsed;
  };

  // 우선순위별 정렬
  const sortedOrders = [...orders].sort((a, b) => {
    // 우선순위가 높은 것 먼저
    if (a.priority === 'urgent' && b.priority !== 'urgent') return -1;
    if (b.priority === 'urgent' && a.priority !== 'urgent') return 1;
    
    // 상태별 정렬 (cooking > preparing > ready)
    const statusOrder = { cooking: 0, preparing: 1, ready: 2 };
    const aStatus = statusOrder[a.status] ?? 3;
    const bStatus = statusOrder[b.status] ?? 3;
    if (aStatus !== bStatus) return aStatus - bStatus;
    
    // 주문 시간 순
    return a.orderTime.getTime() - b.orderTime.getTime();
  });

  // 상태별 주문 개수
  const preparingCount = orders.filter(o => o.status === 'preparing').length;
  const cookingCount = orders.filter(o => o.status === 'cooking').length;
  const readyCount = orders.filter(o => o.status === 'ready').length;

  // 상태별 배지 스타일
  const getStatusBadge = (status: string, priority?: string) => {
    const isPriority = priority === 'urgent';
    
    switch (status) {
      case 'preparing':
        return (
          <Badge className={`${isPriority ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-blue-100 text-blue-800'}`}>
            {isPriority && <Zap className="w-3 h-3 mr-1" />}
            준비중
          </Badge>
        );
      case 'cooking':
        return (
          <Badge className={`${isPriority ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-orange-100 text-orange-800'}`}>
            {isPriority && <Zap className="w-3 h-3 mr-1" />}
            조리중
          </Badge>
        );
      case 'ready':
        return (
          <Badge className="bg-green-100 text-green-800 animate-bounce">
            <Bell className="w-3 h-3 mr-1" />
            완료
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // 주문 유형 아이콘
  const getOrderTypeIcon = (type: string) => {
    switch (type) {
      case '방문': return '🏪';
      case '포장': return '🥡';
      case '배달': return '🚗';
      default: return '🏪';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ChefHat className="w-6 h-6 text-kpi-orange" />
            <h1>주방 화면</h1>
          </div>
          <div className="text-lg font-mono">
            {currentTime.toLocaleTimeString('ko-KR')}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={soundEnabled ? "default" : "outline"}
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
          
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
          </Button>
          
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>



      {/* 상태별 주문 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 준비중 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Package className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-800">준비중 ({preparingCount})</h3>
          </div>
          <div className="space-y-3">
            {orders.filter(order => order.status === 'preparing').map((order) => {
              const elapsedTime = getElapsedTime(order.orderTime);
              
              return (
                <Card 
                  key={order.id} 
                  className={`p-4 ${
                    order.priority === 'urgent' 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-blue-200 bg-blue-50'
                  }`}
                >
                  {/* 주문 헤더 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getOrderTypeIcon(order.orderType)}</span>
                      <div>
                        <div className="font-semibold">{order.id}</div>
                        <div className="text-sm text-gray-500">
                          {order.customer || '고객'} • {order.orderType}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(order.status, order.priority)}
                  </div>

                  {/* 주문 정보 */}
                  <div className="flex items-center justify-between mb-3 p-2 bg-white rounded">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {elapsedTime}분 경과
                      </span>
                    </div>
                  </div>

                  {/* 주문 아이템 */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.image}</span>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.options && item.options.length > 0 && (
                              <div className="text-sm text-gray-500">
                                {item.options.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">x{item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 액션 버튼 */}
                  <Button
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    onClick={() => updateOrderStatus(order.id, 'cooking')}
                  >
                    <ChefHat className="w-4 h-4 mr-2" />
                    조리 시작
                  </Button>

                  {/* 특별 요청 */}
                  {order.notes && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="text-sm text-yellow-800">
                        📝 {order.notes}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
            {preparingCount === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">준비중인 주문이 없습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 조리중 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
            <ChefHat className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-800">조리중 ({cookingCount})</h3>
          </div>
          <div className="space-y-3">
            {orders.filter(order => order.status === 'cooking').map((order) => {
              const elapsedTime = getElapsedTime(order.orderTime);
              
              return (
                <Card 
                  key={order.id} 
                  className={`p-4 ${
                    order.priority === 'urgent' 
                      ? 'border-red-300 bg-red-50' 
                      : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  {/* 주문 헤더 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getOrderTypeIcon(order.orderType)}</span>
                      <div>
                        <div className="font-semibold">{order.id}</div>
                        <div className="text-sm text-gray-500">
                          {order.customer || '고객'} • {order.orderType}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(order.status, order.priority)}
                  </div>

                  {/* 주문 정보 */}
                  <div className="flex items-center justify-between mb-3 p-2 bg-white rounded">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {elapsedTime}분 경과
                      </span>
                    </div>
                  </div>

                  {/* 주문 아이템 */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.image}</span>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.options && item.options.length > 0 && (
                              <div className="text-sm text-gray-500">
                                {item.options.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">x{item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 액션 버튼 */}
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600"
                    onClick={() => updateOrderStatus(order.id, 'ready')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    조리 완료
                  </Button>

                  {/* 특별 요청 */}
                  {order.notes && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="text-sm text-yellow-800">
                        📝 {order.notes}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
            {cookingCount === 0 && (
              <div className="text-center py-8 text-gray-500">
                <ChefHat className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">조리중인 주문이 없습니다</p>
              </div>
            )}
          </div>
        </div>

        {/* 완료 대기 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-green-800">완료 대기 ({readyCount})</h3>
          </div>
          <div className="space-y-3">
            {orders.filter(order => order.status === 'ready').map((order) => {
              const elapsedTime = getElapsedTime(order.orderTime);
              
              return (
                <Card 
                  key={order.id} 
                  className="p-4 border-green-300 bg-green-50 animate-pulse"
                >
                  {/* 주문 헤더 */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getOrderTypeIcon(order.orderType)}</span>
                      <div>
                        <div className="font-semibold">{order.id}</div>
                        <div className="text-sm text-gray-500">
                          {order.customer || '고객'} • {order.orderType}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(order.status, order.priority)}
                  </div>

                  {/* 주문 정보 */}
                  <div className="flex items-center justify-between mb-3 p-2 bg-white rounded">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">
                        {elapsedTime}분 경과
                      </span>
                    </div>
                    <Bell className="w-4 h-4 text-green-500 animate-bounce" />
                  </div>

                  {/* 주문 아이템 */}
                  <div className="space-y-2 mb-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{item.image}</span>
                          <div>
                            <div className="font-medium">{item.name}</div>
                            {item.options && item.options.length > 0 && (
                              <div className="text-sm text-gray-500">
                                {item.options.join(', ')}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">x{item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 액션 버튼 */}
                  <Button
                    className="w-full bg-gray-500 hover:bg-gray-600"
                    onClick={() => completeOrder(order.id)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    픽업 완료
                  </Button>

                  {/* 특별 요청 */}
                  {order.notes && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="text-sm text-yellow-800">
                        📝 {order.notes}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
            {readyCount === 0 && (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">완료 대기중인 주문이 없습니다</p>
              </div>
            )}
          </div>
        </div>
      </div>


      {/* 주문 없음 */}
      {orders.length === 0 && (
        <Card className="p-12 text-center">
          <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">조리할 주문이 없습니다</h3>
          <p className="text-gray-500">새로운 주문이 들어오면 여기에 표시됩니다.</p>
        </Card>
      )}
    </div>
  );
}