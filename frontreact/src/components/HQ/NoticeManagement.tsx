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
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  MessageSquare, 
  Plus, 
  Send, 
  Eye, 
  EyeOff,
  Search,
  Filter,
  Edit3,
  Trash2,
  FileText,
  AlertTriangle,
  BookOpen,
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Paperclip
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// 공지사항 데이터 (임시)
const noticeData = [
  {
    id: 1,
    title: '2024년 1월 신메뉴 출시 안내',
    content: '새로운 시즌 메뉴가 출시됩니다. 모든 가맹점에서는 새로운 메뉴 교육을 받아주시기 바랍니다.',
    type: '일반',
    priority: '보통',
    targetStores: ['전체'],
    author: '본사 마케팅팀',
    createdDate: '2024-01-01',
    publishDate: '2024-01-02',
    status: '발송완료',
    readCount: 45,
    totalStores: 50,
    hasAttachment: true,
    category: '메뉴',
  },
  {
    id: 2,
    title: '긴급: 식품안전 관리 지침 업데이트',
    content: '식품안전 관리 지침이 업데이트되었습니다. 즉시 확인하여 적용해주시기 바랍니다.',
    type: '긴급',
    priority: '높음',
    targetStores: ['전체'],
    author: '본사 운영팀',
    createdDate: '2024-01-03',
    publishDate: '2024-01-03',
    status: '발송완료',
    readCount: 50,
    totalStores: 50,
    hasAttachment: true,
    category: '안전',
  },
  {
    id: 3,
    title: '신입 직원 교육 프로그램 안내',
    content: '신입 직원을 위한 온라인 교육 프로그램이 준비되었습니다.',
    type: '교육',
    priority: '보통',
    targetStores: ['강남점', '홍대점', '신촌점'],
    author: '본사 인사팀',
    createdDate: '2024-01-04',
    publishDate: '2024-01-05',
    status: '예약발송',
    readCount: 0,
    totalStores: 3,
    hasAttachment: false,
    category: '교육',
  },
  {
    id: 4,
    title: '매장 청소 및 방역 안내',
    content: '코로나19 재확산에 따른 매장 청소 및 방역 강화 안내입니다.',
    type: '일반',
    priority: '높음',
    targetStores: ['전체'],
    author: '본사 운영팀',
    createdDate: '2024-01-02',
    publishDate: '2024-01-02',
    status: '발송완료',
    readCount: 48,
    totalStores: 50,
    hasAttachment: false,
    category: '운영',
  },
  {
    id: 5,
    title: '월말 정산 시스템 점검 안내',
    content: '월말 정산 시스템 점검으로 인한 일시적 서비스 중단 안내입니다.',
    type: '일반',
    priority: '보통',
    targetStores: ['전체'],
    author: '본사 IT팀',
    createdDate: '2023-12-30',
    publishDate: '2023-12-31',
    status: '발송완료',
    readCount: 50,
    totalStores: 50,
    hasAttachment: false,
    category: 'IT',
  },
];

// 가맹점 목록 (임시)
const storeList = [
  '강남점', '홍대점', '신촌점', '잠실점', '건대점',
  '성수점', '압구정점', '청담점', '역삼점', '논현점'
];

export function NoticeManagement() {
  const [notices, setNotices] = useState(noticeData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const noticeColumns = [
    {
      key: 'title',
      label: '제목',
      render: (notice: any) => (
        <div className="max-w-xs">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium truncate">{notice.title}</span>
            {notice.hasAttachment && <Paperclip className="w-3 h-3 text-gray-400" />}
          </div>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`text-xs ${
                notice.type === '긴급' ? 'border-red-200 text-red-700' :
                notice.type === '교육' ? 'border-blue-200 text-blue-700' :
                'border-gray-200 text-gray-700'
              }`}
            >
              {notice.type}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {notice.category}
            </Badge>
          </div>
        </div>
      ),
    },
    {
      key: 'targetStores',
      label: '대상 매장',
      render: (notice: any) => (
        <div className="text-xs">
          {notice.targetStores.includes('전체') ? (
            <span className="font-medium">전체 매장</span>
          ) : (
            <div>
              <span className="font-medium">{notice.targetStores.length}개 매장</span>
              <div className="text-gray-500 mt-1">
                {notice.targetStores.slice(0, 2).join(', ')}
                {notice.targetStores.length > 2 && ` 외 ${notice.targetStores.length - 2}개`}
              </div>
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      label: '상태',
      render: (notice: any) => <StatusBadge status={notice.status} />,
    },
    {
      key: 'readRate',
      label: '읽음 현황',
      render: (notice: any) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 mb-1">
            <CheckCircle className="w-3 h-3 text-green-500" />
            <span>{notice.readCount}/{notice.totalStores}</span>
          </div>
          <div className="w-16 bg-gray-200 rounded-full h-1">
            <div 
              className="bg-green-500 h-1 rounded-full transition-all"
              style={{ width: `${(notice.readCount / notice.totalStores) * 100}%` }}
            ></div>
          </div>
        </div>
      ),
    },
    {
      key: 'author',
      label: '작성자',
      render: (notice: any) => (
        <div className="text-xs">
          <div className="font-medium">{notice.author}</div>
          <div className="text-gray-500">{notice.createdDate}</div>
        </div>
      ),
    },
    {
      key: 'publishDate',
      label: '발송일',
      render: (notice: any) => (
        <div className="text-xs flex items-center gap-1">
          <Calendar className="w-3 h-3" />
          {notice.publishDate}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '관리',
      render: (notice: any) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditNotice(notice)}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteNotice(notice)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  const noticeFormFields = [
    {
      name: 'title',
      label: '제목',
      type: 'text' as const,
      required: true,
    },
    {
      name: 'type',
      label: '공지 유형',
      type: 'select' as const,
      options: [
        { value: '일반', label: '일반 공지' },
        { value: '긴급', label: '긴급 공지' },
        { value: '교육', label: '교육 자료' },
      ],
      required: true,
    },
    {
      name: 'category',
      label: '카테고리',
      type: 'select' as const,
      options: [
        { value: '메뉴', label: '메뉴' },
        { value: '운영', label: '운영' },
        { value: '안전', label: '안전' },
        { value: '교육', label: '교육' },
        { value: 'IT', label: 'IT' },
        { value: '기타', label: '기타' },
      ],
      required: true,
    },
    {
      name: 'priority',
      label: '우선순위',
      type: 'select' as const,
      options: [
        { value: '낮음', label: '낮음' },
        { value: '보통', label: '보통' },
        { value: '높음', label: '높음' },
      ],
      required: true,
    },
    {
      name: 'content',
      label: '내용',
      type: 'textarea' as const,
      required: true,
    },
    {
      name: 'publishDate',
      label: '발송일',
      type: 'date' as const,
      required: true,
    },
  ];

  const handleAddNotice = (formData: any) => {
    const newNotice = {
      id: notices.length + 1,
      ...formData,
      targetStores: ['전체'], // 기본값으로 전체 매장
      author: '본사 관리자',
      createdDate: new Date().toISOString().split('T')[0],
      status: new Date(formData.publishDate) <= new Date() ? '발송완료' : '예약발송',
      readCount: 0,
      totalStores: 50,
      hasAttachment: false,
    };
    
    setNotices([...notices, newNotice]);
    setShowAddModal(false);
    toast.success('공지사항이 등록되었습니다.');
  };

  const handleEditNotice = (notice: any) => {
    setSelectedNotice(notice);
    setShowEditModal(true);
  };

  const handleUpdateNotice = (formData: any) => {
    setNotices(notices.map(n => 
      n.id === selectedNotice.id 
        ? { ...n, ...formData }
        : n
    ));
    setShowEditModal(false);
    setSelectedNotice(null);
    toast.success('공지사항이 수정되었습니다.');
  };

  const handleDeleteNotice = (notice: any) => {
    setSelectedNotice(notice);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setNotices(notices.filter(n => n.id !== selectedNotice.id));
    setShowDeleteDialog(false);
    setSelectedNotice(null);
    toast.success('공지사항이 삭제되었습니다.');
  };

  // 필터링된 공지사항 데이터
  const filteredNotices = notices.filter(notice => {
    const matchesSearch = notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notice.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notice.type === filterType;
    const matchesStatus = filterStatus === 'all' || notice.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // 통계 계산
  const totalNotices = notices.length;
  const urgentNotices = notices.filter(n => n.type === '긴급').length;
  const pendingNotices = notices.filter(n => n.status === '예약발송').length;
  const avgReadRate = notices.length > 0 
    ? Math.round(notices.reduce((sum, n) => sum + (n.readCount / n.totalStores), 0) / notices.length * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">공지사항 관리</h1>
          <p className="text-sm text-gray-600 mt-1">가맹점에 발송할 공지사항을 관리합니다</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          공지사항 작성
        </Button>
      </div>

      {/* KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="전체 공지사항"
          value={`${totalNotices}건`}
          icon={MessageSquare}
          color="red"
          trend={+8.3}
        />
        <KPICard
          title="긴급 공지"
          value={`${urgentNotices}건`}
          icon={AlertTriangle}
          color="orange"
          trend={-12.5}
        />
        <KPICard
          title="발송 대기"
          value={`${pendingNotices}건`}
          icon={Clock}
          color="green"
          trend={+5.7}
        />
        <KPICard
          title="평균 읽음률"
          value={`${avgReadRate}%`}
          icon={Eye}
          color="purple"
          trend={+3.2}
        />
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">공지사항 목록</TabsTrigger>
          <TabsTrigger value="templates">템플릿 관리</TabsTrigger>
          <TabsTrigger value="analytics">발송 분석</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* 검색 및 필터 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="제목, 내용, 작성자로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">전체 유형</option>
                    <option value="일반">일반</option>
                    <option value="긴급">긴급</option>
                    <option value="교육">교육</option>
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">전체 상태</option>
                    <option value="발송완료">발송완료</option>
                    <option value="예약발송">예약발송</option>
                    <option value="임시저장">임시저장</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 공지사항 목록 테이블 */}
          <DataTable
            data={filteredNotices}
            columns={noticeColumns}
            searchKey=""
            title={`공지사항 목록 (${filteredNotices.length}건)`}
          />
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                공지사항 템플릿
              </CardTitle>
              <p className="text-sm text-gray-600">자주 사용하는 공지사항 템플릿을 관리합니다</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: '신메뉴 출시 안내', category: '메뉴', usage: 12 },
                  { title: '정기 점검 안내', category: '운영', usage: 8 },
                  { title: '교육 프로그램 안내', category: '교육', usage: 6 },
                  { title: '안전 점검 안내', category: '안전', usage: 4 },
                  { title: '시스템 업데이트', category: 'IT', usage: 3 },
                  { title: '행사 안내', category: '마케팅', usage: 7 },
                ].map((template, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium">{template.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        사용 횟수: {template.usage}회
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="text-xs">
                          편집
                        </Button>
                        <Button size="sm" variant="outline" className="text-xs">
                          사용
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* 읽음률 분석 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  유형별 읽음률
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { type: '긴급', rate: 98, color: 'bg-kpi-red' },
                    { type: '교육', rate: 85, color: 'bg-kpi-orange' },
                    { type: '일반', rate: 76, color: 'bg-kpi-green' },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${item.color}`}
                            style={{ width: `${item.rate}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-semibold w-8">{item.rate}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  매장별 읽음 현황
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {storeList.slice(0, 5).map((store, index) => {
                    const readRate = Math.floor(Math.random() * 20) + 80; // 80-100% 사이
                    return (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{store}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-green-500 h-1 rounded-full"
                              style={{ width: `${readRate}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-medium w-8">{readRate}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 발송 통계 */}
          <Card>
            <CardHeader>
              <CardTitle>발송 통계</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">이번달 발송</h4>
                  <p className="text-2xl font-bold text-kpi-red">24건</p>
                  <p className="text-sm text-gray-600">전월 대비 +12%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">평균 읽음률</h4>
                  <p className="text-2xl font-bold text-kpi-orange">86%</p>
                  <p className="text-sm text-gray-600">전월 대비 +3%</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">즉시 읽음률</h4>
                  <p className="text-2xl font-bold text-kpi-green">52%</p>
                  <p className="text-sm text-gray-600">24시간 이내</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <h4 className="font-semibold mb-2">미읽음 매장</h4>
                  <p className="text-2xl font-bold text-kpi-purple">3개</p>
                  <p className="text-sm text-gray-600">전체 50개 중</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 공지사항 추가 모달 */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddNotice}
        title="공지사항 작성"
        fields={noticeFormFields}
      />

      {/* 공지사항 수정 모달 */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedNotice(null);
        }}
        onSubmit={handleUpdateNotice}
        title="공지사항 수정"
        fields={noticeFormFields}
        initialData={selectedNotice || {}}
      />

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedNotice(null);
        }}
        onConfirm={confirmDelete}
        title="공지사항 삭제"
        description={`정말로 "${selectedNotice?.title}" 공지사항을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
      />
    </div>
  );
}