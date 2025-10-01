import React, { useState } from 'react';
import { KPICard } from '../Common/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Badge } from '../ui/badge';
import { 
  BarChart3, 
  Download, 
  CalendarIcon,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Building,
  Package,
  Users,
  Eye,
  FileText,
  PieChart,
  Activity
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { toast } from 'sonner@2.0.3';

// 전체 매출 데이터 (임시)
const overallSalesData = [
  { month: '2023-07', revenue: 145000000, stores: 45, avgPerStore: 3222222 },
  { month: '2023-08', revenue: 158000000, stores: 47, avgPerStore: 3361702 },
  { month: '2023-09', revenue: 152000000, stores: 48, avgPerStore: 3166667 },
  { month: '2023-10', revenue: 167000000, stores: 49, avgPerStore: 3408163 },
  { month: '2023-11', revenue: 174000000, stores: 50, avgPerStore: 3480000 },
  { month: '2023-12', revenue: 189000000, stores: 50, avgPerStore: 3780000 },
];

// 매장별 성과 데이터
const storePerformanceData = [
  { store: '강남점', revenue: 8500000, growth: 12.5, ranking: 1, customer: 2100 },
  { store: '홍대점', revenue: 7800000, growth: 8.3, ranking: 2, customer: 1950 },
  { store: '잠실점', revenue: 7200000, growth: 15.2, ranking: 3, customer: 1800 },
  { store: '신촌점', revenue: 6900000, growth: -2.1, ranking: 4, customer: 1720 },
  { store: '건대점', revenue: 6500000, growth: 6.7, ranking: 5, customer: 1650 },
  { store: '성수점', revenue: 6200000, growth: 22.8, ranking: 6, customer: 1580 },
  { store: '압구정점', revenue: 5900000, growth: 4.2, ranking: 7, customer: 1490 },
  { store: '청담점', revenue: 5600000, growth: -5.3, ranking: 8, customer: 1420 },
  { store: '역삼점', revenue: 5300000, growth: 9.1, ranking: 9, customer: 1350 },
  { store: '논현점', revenue: 5100000, growth: 1.8, ranking: 10, customer: 1280 },
];

// 카테고리별 매출 데이터
const categorySalesData = [
  { name: '버거류', value: 45, amount: 850000000, color: '#FF6B6B' },
  { name: '음료', value: 25, amount: 472500000, color: '#F77F00' },
  { name: '사이드', value: 20, amount: 378000000, color: '#06D6A0' },
  { name: '디저트', value: 10, amount: 189000000, color: '#9D4EDD' },
];

// 지역별 분석 데이터
const regionData = [
  { region: '강남구', stores: 12, revenue: 98000000, growth: 8.5 },
  { region: '마포구', stores: 8, revenue: 65000000, growth: 12.3 },
  { region: '송파구', stores: 7, revenue: 58000000, growth: 15.2 },
  { region: '서초구', stores: 6, revenue: 52000000, growth: 6.7 },
  { region: '용산구', stores: 5, revenue: 43000000, growth: 9.8 },
  { region: '기타', stores: 12, revenue: 95000000, growth: 7.1 },
];

// 주간 트렌드 데이터
const weeklyTrendData = [
  { week: '1주차', revenue: 42000000, orders: 8500, customers: 6800 },
  { week: '2주차', revenue: 45000000, orders: 9200, customers: 7300 },
  { week: '3주차', revenue: 47000000, orders: 9800, customers: 7800 },
  { week: '4주차', revenue: 55000000, orders: 11200, customers: 8900 },
];

export function HQReports() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedReport, setSelectedReport] = useState('sales');

  const handleExportReport = (reportType: string) => {
    toast.success(`${reportType} 리포트를 다운로드합니다.`);
  };

  const currentMonth = overallSalesData[overallSalesData.length - 1];
  const previousMonth = overallSalesData[overallSalesData.length - 2];
  const revenueGrowth = ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue) * 100;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">통합 리포트</h1>
          <p className="text-sm text-gray-600 mt-1">전체 가맹점의 통합 분석 리포트를 확인합니다</p>
        </div>
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="w-4 h-4 mr-2" />
                {selectedDate.toLocaleDateString('ko-KR')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button onClick={() => handleExportReport('전체')}>
            <Download className="w-4 h-4 mr-2" />
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* 전체 성과 KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="총 매출"
          value={`₩${Math.round(currentMonth.revenue / 100000000)}억원`}
          icon={DollarSign}
          color="red"
          trend={revenueGrowth}
        />
        <KPICard
          title="활성 매장"
          value={`${currentMonth.stores}개`}
          icon={Building}
          color="orange"
          trend={+4.2}
        />
        <KPICard
          title="평균 매장 매출"
          value={`₩${Math.round(currentMonth.avgPerStore / 10000)}만원`}
          icon={TrendingUp}
          color="green"
          trend={+7.8}
        />
        <KPICard
          title="신규 매장"
          value="3개"
          icon={Package}
          color="purple"
          trend={+50}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">종합 현황</TabsTrigger>
          <TabsTrigger value="sales">매출 분석</TabsTrigger>
          <TabsTrigger value="stores">매장 성과</TabsTrigger>
          <TabsTrigger value="products">상품 분석</TabsTrigger>
          <TabsTrigger value="trends">트렌드 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* 전체 매출 추이 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                전체 매출 추이
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={overallSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickFormatter={(value) => value.slice(-2) + '월'} />
                  <YAxis tickFormatter={(value) => `₩${(value / 100000000).toFixed(1)}억`} />
                  <Tooltip 
                    formatter={(value: any) => [`₩${(value / 100000000).toFixed(1)}억원`, '매출']}
                    labelFormatter={(label) => `${label.slice(-2)}월`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#FF6B6B" 
                    fill="#FF6B6B" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 핵심 지표 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">매출 성장률</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-3xl font-bold text-kpi-green mb-2">
                    +{revenueGrowth.toFixed(1)}%
                  </div>
                  <p className="text-sm text-gray-600">전월 대비</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-gray-600">이번달</div>
                      <div className="font-semibold">₩{(currentMonth.revenue / 100000000).toFixed(1)}억</div>
                    </div>
                    <div>
                      <div className="text-gray-600">지난달</div>
                      <div className="font-semibold">₩{(previousMonth.revenue / 100000000).toFixed(1)}억</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">매장 현황</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">전체 매장</span>
                    <span className="font-semibold">{currentMonth.stores}개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">신규 매장</span>
                    <span className="font-semibold text-kpi-green">3개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">우수 매장</span>
                    <span className="font-semibold text-kpi-orange">12개</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">개선 필요</span>
                    <span className="font-semibold text-kpi-red">2개</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">운영 효율성</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">평균 주문 금액</span>
                    <span className="font-semibold">₩15,500</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">고객 재방문율</span>
                    <span className="font-semibold text-kpi-green">78%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">재고 회전율</span>
                    <span className="font-semibold">24.3일</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">순이익률</span>
                    <span className="font-semibold text-kpi-purple">18.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sales" className="space-y-6">
          {/* 월별 매출 및 매장수 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                매출 및 매장 수 추이
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={overallSalesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tickFormatter={(value) => value.slice(-2) + '월'} />
                  <YAxis yAxisId="left" tickFormatter={(value) => `₩${(value / 100000000).toFixed(0)}억`} />
                  <YAxis yAxisId="right" orientation="right" tickFormatter={(value) => `${value}개`} />
                  <Tooltip 
                    formatter={(value: any, name) => [
                      name === 'revenue' ? `₩${(value / 100000000).toFixed(1)}억원` : `${value}개`,
                      name === 'revenue' ? '매출' : '매장 수'
                    ]}
                    labelFormatter={(label) => `${label.slice(-2)}월`}
                  />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="revenue" stroke="#FF6B6B" strokeWidth={3} name="매출" />
                  <Line yAxisId="right" type="monotone" dataKey="stores" stroke="#06D6A0" strokeWidth={2} name="매장 수" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 지역별 매출 분석 */}
          <Card>
            <CardHeader>
              <CardTitle>지역별 매출 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regionData.map((region, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-sm font-medium w-16">{region.region}</div>
                      <div className="text-xs text-gray-600">{region.stores}개 매장</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold">₩{(region.revenue / 10000000).toFixed(1)}천만원</div>
                        <div className={`text-xs flex items-center gap-1 ${region.growth > 0 ? 'text-kpi-green' : 'text-kpi-red'}`}>
                          {region.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {Math.abs(region.growth)}%
                        </div>
                      </div>
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-kpi-orange h-2 rounded-full"
                          style={{ width: `${(region.revenue / 98000000) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stores" className="space-y-6">
          {/* 매장별 성과 순위 */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  매장별 성과 순위
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => handleExportReport('매장 성과')}>
                  <Download className="w-3 h-3 mr-1" />
                  내보내기
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {storePerformanceData.slice(0, 10).map((store, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index < 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {store.ranking}
                      </div>
                      <div>
                        <div className="font-medium">{store.store}</div>
                        <div className="text-xs text-gray-500">고객 수: {(store.customer || 0).toLocaleString()}명</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₩{(store.revenue / 10000).toFixed(0)}만원</div>
                      <div className={`text-xs flex items-center gap-1 ${store.growth > 0 ? 'text-kpi-green' : 'text-kpi-red'}`}>
                        {store.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(store.growth)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          {/* 카테고리별 매출 분석 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>카테고리별 매출 비율</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <RechartsPieChart>
                    <Pie
                      data={categorySalesData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categorySalesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>카테고리별 상세 분석</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {categorySalesData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        ></div>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₩{(category.amount / 100000000).toFixed(1)}억원</div>
                        <div className="text-xs text-gray-500">{category.value}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* 주간 트렌드 분석 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                주간 트렌드 분석
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis yAxisId="left" tickFormatter={(value) => `₩${(value / 1000000).toFixed(0)}M`} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip 
                    formatter={(value: any, name) => [
                      name === 'revenue' ? `₩${((value || 0) / 10000).toFixed(0)}만원` :
                      name === 'orders' ? `${(value || 0).toLocaleString()}건` :
                      `${(value || 0).toLocaleString()}명`,
                      name === 'revenue' ? '매출' :
                      name === 'orders' ? '주문수' : '고객수'
                    ]}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="revenue" fill="#FF6B6B" name="매출" />
                  <Bar yAxisId="right" dataKey="orders" fill="#F77F00" name="주문수" />
                  <Bar yAxisId="right" dataKey="customers" fill="#06D6A0" name="고객수" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* 성장 분석 */}
          <Card>
            <CardHeader>
              <CardTitle>성장 분석 요약</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">매출 성장률</h4>
                  <p className="text-2xl font-bold text-kpi-green">+{revenueGrowth.toFixed(1)}%</p>
                  <p className="text-sm text-gray-600">전월 대비</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">고객 증가율</h4>
                  <p className="text-2xl font-bold text-kpi-orange">+8.7%</p>
                  <p className="text-sm text-gray-600">전월 대비</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">매장 확장률</h4>
                  <p className="text-2xl font-bold text-kpi-purple">+6.4%</p>
                  <p className="text-sm text-gray-600">전월 대비</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}