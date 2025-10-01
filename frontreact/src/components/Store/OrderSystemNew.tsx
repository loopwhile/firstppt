import React, { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { 
  Plus, 
  Minus, 
  ShoppingCart, 
  CreditCard, 
  Printer,
  Clock,
  User,
  Check,
  X,
  ChefHat,
  Bell,
  Zap,
  TrendingUp,
  Store,
  Package,
  Truck,
  Gift,
  Percent
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// 메뉴 데이터
const menuCategories = [
  {
    id: 'set',
    name: '세트',
    items: [
      { id: 1, name: '치킨버거세트', price: 12500, image: '🍔', available: true },
      { id: 2, name: '불고기버거세트', price: 13000, image: '🍔', available: true },
      { id: 3, name: '새우버거세트', price: 13500, image: '🍤', available: false },
      { id: 4, name: '치즈버거세트', price: 11500, image: '🍔', available: true }
    ]
  },
  {
    id: 'toast',
    name: '토스트',
    items: [
      { id: 5, name: '햄치즈토스트', price: 4500, image: '🥪', available: true },
      { id: 6, name: '베이컨토스트', price: 5000, image: '🥪', available: true },
      { id: 7, name: '참치토스트', price: 4800, image: '🥪', available: true },
      { id: 8, name: '치킨토스트', price: 5500, image: '🥪', available: true }
    ]
  },
  {
    id: 'side',
    name: '사이드',
    items: [
      { id: 9, name: '감자튀김(L)', price: 3500, image: '🍟', available: true },
      { id: 10, name: '감자튀김(M)', price: 2500, image: '🍟', available: true },
      { id: 11, name: '치킨너겟', price: 4500, image: '🍗', available: true },
      { id: 12, name: '치즈스틱', price: 4000, image: '🧀', available: true }
    ]
  },
  {
    id: 'drink',
    name: '음료',
    items: [
      { id: 13, name: '콜라(L)', price: 2500, image: '🥤', available: true },
      { id: 14, name: '콜라(M)', price: 2000, image: '🥤', available: true },
      { id: 15, name: '사이다(L)', price: 2500, image: '🥤', available: true },
      { id: 16, name: '커피', price: 3000, image: '☕', available: true }
    ]
  }
];

// 빠른 주문 인기 상품
const quickOrderItems = [
  { id: 1, name: '치킨버거세트', price: 12500, image: '🍔', available: true, popular: true },
  { id: 9, name: '감자튀김(L)', price: 3500, image: '🍟', available: true, popular: true },
  { id: 13, name: '콜라(L)', price: 2500, image: '🥤', available: true, popular: true },
  { id: 5, name: '햄치즈토스트', price: 4500, image: '🥪', available: true, popular: true },
  { id: 11, name: '치킨너겟', price: 4500, image: '🍗', available: true, popular: true }
];

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
  status: 'preparing' | 'cooking' | 'ready' | 'completed';
  orderTime: Date;
  customer?: string;
  paymentMethod: string;
  orderType: '방문' | '포장' | '배달';
}

// 최근 주문 샘플 데이터
const recentOrders: Order[] = [
  {
    id: '#001',
    items: [
      { id: 1, name: '치킨버거세트', price: 12500, quantity: 2, image: '🍔' },
      { id: 9, name: '감자튀김(L)', price: 3500, quantity: 1, image: '🍟' }
    ],
    total: 28500,
    originalTotal: 28500,
    discount: 0,
    status: 'completed',
    orderTime: new Date(Date.now() - 1800000), // 30분 전
    customer: '김고객',
    paymentMethod: '카드',
    orderType: '방문'
  },
  {
    id: '#002',
    items: [
      { id: 5, name: '햄치즈토스트', price: 4500, quantity: 1, image: '🥪' },
      { id: 13, name: '콜라(L)', price: 2500, quantity: 1, image: '🥤' }
    ],
    total: 6300,
    originalTotal: 7000,
    discount: 700,
    status: 'completed',
    orderTime: new Date(Date.now() - 900000), // 15분 전
    customer: '이고객',
    paymentMethod: '현금',
    orderType: '포장'
  },
  {
    id: '#003',
    items: [
      { id: 11, name: '치킨너겟', price: 4500, quantity: 1, image: '🍗' },
      { id: 10, name: '감자튀김(M)', price: 2500, quantity: 2, image: '🍟' }
    ],
    total: 9500,
    originalTotal: 9500,
    discount: 0,
    status: 'completed',
    orderTime: new Date(Date.now() - 300000), // 5분 전
    customer: '박고객',
    paymentMethod: '카드',
    orderType: '배달'
  }
];

export function OrderSystem() {
  const [selectedCategory, setSelectedCategory] = useState('set');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orderType, setOrderType] = useState<'방문' | '포장' | '배달'>('방문');
  const [customerName, setCustomerName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState<'amount' | 'percent'>('amount');
  const [orders, setOrders] = useState<Order[]>(recentOrders);
  const [showQuickOrder, setShowQuickOrder] = useState(false);

  // 시간 업데이트
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addToCart = (item: any) => {
    if (!item.available) {
      toast.error('품절된 상품입니다.');
      return;
    }

    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { 
        id: item.id, 
        name: item.name, 
        price: item.price, 
        quantity: 1, 
        image: item.image 
      }]);
    }
    toast.success(`${item.name}이(가) 주문에 추가되었습니다.`);
  };

  const removeFromCart = (id: number) => {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(item => 
        item.id === id 
          ? { ...item, quantity: item.quantity - 1 }
          : item
      ));
    } else {
      setCart(cart.filter(item => item.id !== id));
    }
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
    toast.info('주문이 초기화되었습니다.');
  };

  const calculateSubtotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    if (discountType === 'percent') {
      return subtotal - (subtotal * discount / 100);
    }
    return subtotal - discount;
  };

  const applyDiscount = (amount: number, type: 'amount' | 'percent') => {
    setDiscount(amount);
    setDiscountType(type);
    toast.success(`할인이 적용되었습니다: ${type === 'percent' ? amount + '%' : amount.toLocaleString() + '원'}`);
  };

  const removeDiscount = () => {
    setDiscount(0);
    toast.info('할인이 제거되었습니다.');
  };

  const processPayment = (method: string) => {
    if (cart.length === 0) {
      toast.error('주문할 상품을 선택해주세요.');
      return;
    }

    try {
      // 주문 생성
      const orderId = `#${String(Date.now()).slice(-3)}`;
      
      const newOrder: Order = {
        id: orderId,
        items: [...cart],
        total: calculateTotal(),
        originalTotal: calculateSubtotal(),
        discount: calculateSubtotal() - calculateTotal(),
        status: 'preparing',
        orderTime: new Date(),
        customer: customerName || undefined,
        paymentMethod: method,
        orderType: orderType
      };

      // 주문 목록에 추가
      setOrders([newOrder, ...orders]);

      // 결제 완료 처리
      setPaymentMethod(method);
      toast.success(`결제가 완료되었습니다. 주문번호: ${orderId}`);
      
      // 영수증 출력 시뮬레이션
      setTimeout(() => {
        toast.info('영수증이 출력되었습니다.');
      }, 1000);

      // 주문 초기화
      setCart([]);
      setCustomerName('');
      setDiscount(0);
      setShowPayment(false);
      
    } catch (error) {
      console.error('결제 처리 오류:', error);
      toast.error('결제 처리 중 오류가 발생했습니다.');
    }
  };

  const getRecentOrderItems = () => {
    const recentItems = orders
      .slice(0, 5)
      .flatMap(order => order.items)
      .reduce((acc: any[], item) => {
        const existing = acc.find(i => i.id === item.id);
        if (existing) {
          existing.count += item.quantity;
        } else {
          acc.push({ ...item, count: item.quantity });
        }
        return acc;
      }, [])
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
    
    return recentItems;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">주문 등록</h1>
          <p className="text-dark-gray mt-1">
            {currentTime.toLocaleString('ko-KR')} | {orderType} 주문
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={showQuickOrder ? "default" : "outline"}
            onClick={() => setShowQuickOrder(!showQuickOrder)}
            className="flex items-center gap-2"
          >
            <Zap className="w-4 h-4" />
            빠른주문
          </Button>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['방문', '포장', '배달'] as const).map((type) => (
              <Button
                key={type}
                variant={orderType === type ? "default" : "ghost"}
                size="sm"
                onClick={() => setOrderType(type)}
                className="px-4"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Menu Section */}
        <div className="col-span-8">
          {showQuickOrder ? (
            /* Quick Order */
            <Card className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <Zap className="w-5 h-5 text-kpi-orange" />
                <h3 className="font-medium">인기 상품 빠른 주문</h3>
              </div>
              <div className="grid grid-cols-5 gap-3">
                {quickOrderItems.map((item) => (
                  <Card 
                    key={item.id}
                    className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => addToCart(item)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{item.image}</div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-kpi-red font-semibold">
                        {item.price.toLocaleString()}원
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t">
                <h4 className="font-medium mb-3">최근 주문 상품</h4>
                <div className="grid grid-cols-6 gap-2">
                  {getRecentOrderItems().map((item, index) => (
                    <Card 
                      key={`recent-${item.id}-${index}`}
                      className="p-2 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addToCart(item)}
                    >
                      <div className="text-center">
                        <div className="text-lg mb-1">{item.image}</div>
                        <div className="text-xs font-medium">{item.name}</div>
                        <div className="text-xs text-kpi-red font-semibold">
                          {item.price.toLocaleString()}원
                        </div>
                        <div className="text-xs text-gray-500">
                          {item.count}회 주문
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </Card>
          ) : (
            /* Regular Menu */
            <>
              {/* Category Tabs */}
              <div className="flex gap-2 mb-4">
                {menuCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    onClick={() => setSelectedCategory(category.id)}
                    className="flex-1"
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Menu Items */}
              <div className="grid grid-cols-4 gap-4">
                {menuCategories
                  .find(cat => cat.id === selectedCategory)
                  ?.items.map((item) => (
                    <Card 
                      key={item.id}
                      className={`p-4 cursor-pointer transition-all ${
                        item.available 
                          ? 'hover:shadow-lg hover:scale-105' 
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => addToCart(item)}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">{item.image}</div>
                        <h3 className="font-medium mb-2">{item.name}</h3>
                        <div className="text-lg font-semibold text-kpi-red">
                          {item.price.toLocaleString()}원
                        </div>
                        {!item.available && (
                          <Badge variant="destructive" className="mt-2">
                            품절
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))}
              </div>
            </>
          )}
        </div>

        {/* Order Cart */}
        <div className="col-span-4">
          <Card className="p-4 sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                주문 내역
              </h3>
              {cart.length > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={clearCart}
                  className="text-red-600 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Customer Info */}
            <div className="mb-4">
              <Input
                placeholder="고객명 (선택사항)"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="mb-2"
              />
            </div>

            {/* Cart Items */}
            <div className="space-y-3 mb-4 max-h-80 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>주문할 상품을 선택해주세요</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.image}</span>
                      <div>
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-xs text-gray-500">
                          {item.price.toLocaleString()}원
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => removeFromCart(item.id)}
                        className="w-6 h-6 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="mx-2 min-w-[20px] text-center">{item.quantity}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => addToCart(item)}
                        className="w-6 h-6 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Discount Section */}
            {cart.length > 0 && (
              <div className="border-t pt-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Percent className="w-4 h-4" />
                  <span className="font-medium">할인</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyDiscount(1000, 'amount')}
                  >
                    1,000원
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyDiscount(10, 'percent')}
                  >
                    10%
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyDiscount(5000, 'amount')}
                  >
                    5,000원
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => applyDiscount(20, 'percent')}
                  >
                    20%
                  </Button>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between mt-2 text-sm">
                    <span>적용된 할인</span>
                    <div className="flex items-center gap-1">
                      <span className="text-red-600">
                        -{discountType === 'percent' ? discount + '%' : discount.toLocaleString() + '원'}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeDiscount}
                        className="w-4 h-4 p-0 text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Order Summary */}
            {cart.length > 0 && (
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-dark-gray">소계</span>
                  <span className="text-sm">{calculateSubtotal().toLocaleString()}원</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-dark-gray">할인</span>
                    <span className="text-sm text-red-600">
                      -{(calculateSubtotal() - calculateTotal()).toLocaleString()}원
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-semibold pt-2 border-t">
                  <span>총액</span>
                  <span className="text-kpi-red">{calculateTotal().toLocaleString()}원</span>
                </div>
              </div>
            )}

            {/* Payment Buttons */}
            {cart.length > 0 && (
              <div className="space-y-2 mt-4">
                <Button 
                  onClick={() => processPayment('카드')}
                  className="w-full bg-kpi-red hover:bg-kpi-red/90 text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  카드 결제
                </Button>
                <Button 
                  onClick={() => processPayment('현금')}
                  variant="outline"
                  className="w-full"
                >
                  <Package className="w-4 h-4 mr-2" />
                  현금 결제
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Recent Orders */}
      <Card className="p-4">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          최근 주문
        </h3>
        <div className="space-y-3">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium text-gray-900">{order.id}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">
                    {order.items.map(item => `${item.name} x${item.quantity}`).join(', ')}
                  </div>
                  <div className="text-xs text-gray-500">
                    {order.orderTime.toLocaleTimeString('ko-KR')} | {order.orderType}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold text-kpi-red">
                  {order.total.toLocaleString()}원
                </div>
                <div className="text-xs text-gray-500">
                  {order.paymentMethod}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}