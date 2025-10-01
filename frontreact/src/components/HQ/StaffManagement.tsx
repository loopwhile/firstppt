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
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Search, 
  Filter,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Edit3,
  Trash2,
  Shield,
  Clock
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// 직원 데이터 (임시)
const staffData = [
  {
    id: 1,
    name: '김철수',
    email: 'kim.cs@franfriend.com',
    phone: '010-1234-5678',
    department: '영업팀',
    position: '팀장',
    role: 'manager',
    status: '재직',
    joinDate: '2020-03-15',
    location: '서울 본사',
    avatar: 'KC',
    lastLogin: '2024-01-05 14:30',
  },
  {
    id: 2,
    name: '이영희',
    email: 'lee.yh@franfriend.com',
    phone: '010-2345-6789',
    department: '마케팅팀',
    position: '과장',
    role: 'staff',
    status: '재직',
    joinDate: '2021-07-01',
    location: '서울 본사',
    avatar: 'LY',
    lastLogin: '2024-01-05 16:45',
  },
  {
    id: 3,
    name: '박민수',
    email: 'park.ms@franfriend.com',
    phone: '010-3456-7890',
    department: 'IT팀',
    position: '개발자',
    role: 'admin',
    status: '재직',
    joinDate: '2019-11-20',
    location: '서울 본사',
    avatar: 'PM',
    lastLogin: '2024-01-05 09:15',
  },
  {
    id: 4,
    name: '최지현',
    email: 'choi.jh@franfriend.com',
    phone: '010-4567-8901',
    department: '인사팀',
    position: '대리',
    role: 'staff',
    status: '휴직',
    joinDate: '2022-02-14',
    location: '서울 본사',
    avatar: 'CJ',
    lastLogin: '2024-01-02 18:20',
  },
  {
    id: 5,
    name: '정수현',
    email: 'jung.sh@franfriend.com',
    phone: '010-5678-9012',
    department: '운영팀',
    position: '사원',
    role: 'staff',
    status: '퇴직',
    joinDate: '2023-05-10',
    location: '부산 지점',
    avatar: 'JS',
    lastLogin: '2023-12-28 10:30',
  },
];

// 부서별 데이터
const departmentStats = [
  { name: '영업팀', count: 12, color: '#FF6B6B' },
  { name: '마케팅팀', count: 8, color: '#F77F00' },
  { name: 'IT팀', count: 6, color: '#06D6A0' },
  { name: '인사팀', count: 4, color: '#9D4EDD' },
  { name: '운영팀', count: 10, color: '#6C757D' },
];

export function StaffManagement() {
  const [staff, setStaff] = useState(staffData);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const staffColumns = [
    {
      key: 'name',
      label: '이름',
      render: (staff: any) => (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-kpi-green text-white text-xs">
              {staff?.avatar || '??'}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{staff?.name || '-'}</div>
            <div className="text-xs text-gray-500">{staff?.email || '-'}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'department',
      label: '부서/직급',
      render: (staff: any) => (
        <div>
          <div className="font-medium">{staff?.department || '-'}</div>
          <div className="text-xs text-gray-500">{staff?.position || '-'}</div>
        </div>
      ),
    },
    {
      key: 'role',
      label: '권한',
      render: (staff: any) => {
        const roleColors = {
          admin: 'bg-kpi-red',
          manager: 'bg-kpi-orange',
          staff: 'bg-kpi-green',
        };
        const roleLabels = {
          admin: '관리자',
          manager: '매니저',
          staff: '일반',
        };
        return (
          <Badge className={`${roleColors[staff.role as keyof typeof roleColors]} text-white`}>
            <Shield className="w-3 h-3 mr-1" />
            {roleLabels[staff.role as keyof typeof roleLabels]}
          </Badge>
        );
      },
    },
    {
      key: 'status',
      label: '상태',
      render: (value: any, staff: any) => {
        const status = staff?.status || 'normal';
        const statusText = {
          'active': '근무중',
          'preparing': '준비중',
          'closed': '퇴사', 
          'warning': '경고',
          'normal': '일반'
        }[status] || status;
        
        return <StatusBadge status={status} text={statusText} />;
      },
    },
    {
      key: 'contact',
      label: '연락처',
      render: (staff: any) => (
        <div className="text-xs">
          <div className="flex items-center gap-1 mb-1">
            <Phone className="w-3 h-3" />
            {staff?.phone || '-'}
          </div>
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {staff?.location || '-'}
          </div>
        </div>
      ),
    },
    {
      key: 'joinDate',
      label: '입사일',
      render: (staff: any) => (
        <div className="text-xs">
          <div>{staff?.joinDate ? new Date(staff.joinDate).toLocaleDateString('ko-KR') : '-'}</div>
          <div className="text-gray-500">
            {staff?.joinDate ? Math.floor((new Date().getTime() - new Date(staff.joinDate).getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0}년차
          </div>
        </div>
      ),
    },
    {
      key: 'lastLogin',
      label: '최근 접속',
      render: (staff: any) => (
        <div className="text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {staff?.lastLogin || '-'}
        </div>
      ),
    },
    {
      key: 'actions',
      label: '관리',
      render: (staff: any) => (
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleEditStaff(staff)}
          >
            <Edit3 className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => handleDeleteStaff(staff)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      ),
    },
  ];

  const staffFormFields = [
    {
      name: 'name',
      label: '이름',
      type: 'text' as const,
      required: true,
    },
    {
      name: 'email',
      label: '이메일',
      type: 'email' as const,
      required: true,
    },
    {
      name: 'phone',
      label: '연락처',
      type: 'tel' as const,
      required: true,
    },
    {
      name: 'department',
      label: '부서',
      type: 'select' as const,
      options: [
        { value: '영업팀', label: '영업팀' },
        { value: '마케팅팀', label: '마케팅팀' },
        { value: 'IT팀', label: 'IT팀' },
        { value: '인사팀', label: '인사팀' },
        { value: '운영팀', label: '운영팀' },
      ],
      required: true,
    },
    {
      name: 'position',
      label: '직급',
      type: 'select' as const,
      options: [
        { value: '사원', label: '사원' },
        { value: '대리', label: '대리' },
        { value: '과장', label: '과장' },
        { value: '팀장', label: '팀장' },
        { value: '부장', label: '부장' },
      ],
      required: true,
    },
    {
      name: 'role',
      label: '권한',
      type: 'select' as const,
      options: [
        { value: 'staff', label: '일반' },
        { value: 'manager', label: '매니저' },
        { value: 'admin', label: '관리자' },
      ],
      required: true,
    },
    {
      name: 'location',
      label: '근무지',
      type: 'select' as const,
      options: [
        { value: '서울 본사', label: '서울 본사' },
        { value: '부산 지점', label: '부산 지점' },
        { value: '대구 지점', label: '대구 지점' },
        { value: '광주 지점', label: '광주 지점' },
      ],
      required: true,
    },
    {
      name: 'joinDate',
      label: '입사일',
      type: 'date' as const,
      required: true,
    },
  ];

  const handleAddStaff = (formData: any) => {
    const newStaff = {
      id: staff.length + 1,
      ...formData,
      avatar: formData.name.substring(0, 2).toUpperCase(),
      status: '재직',
      lastLogin: '로그인 전',
    };
    
    setStaff([...staff, newStaff]);
    setShowAddModal(false);
    toast.success('직원이 추가되었습니다.');
  };

  const handleEditStaff = (staffMember: any) => {
    setSelectedStaff(staffMember);
    setShowEditModal(true);
  };

  const handleUpdateStaff = (formData: any) => {
    setStaff(staff.map(s => 
      s.id === selectedStaff.id 
        ? { ...s, ...formData }
        : s
    ));
    setShowEditModal(false);
    setSelectedStaff(null);
    toast.success('직원 정보가 수정되었습니다.');
  };

  const handleDeleteStaff = (staffMember: any) => {
    setSelectedStaff(staffMember);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    setStaff(staff.filter(s => s.id !== selectedStaff.id));
    setShowDeleteDialog(false);
    setSelectedStaff(null);
    toast.success('직원이 삭제되었습니다.');
  };

  // 필터링된 직원 데이터
  const filteredStaff = staff.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === 'all' || s.department === filterDepartment;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  // 통계 계산
  const totalStaff = staff.length;
  const activeStaff = staff.filter(s => s.status === '재직').length;
  const onLeaveStaff = staff.filter(s => s.status === '휴직').length;
  const newThisMonth = staff.filter(s => {
    const joinDate = new Date(s.joinDate);
    const thisMonth = new Date();
    return joinDate.getMonth() === thisMonth.getMonth() && 
           joinDate.getFullYear() === thisMonth.getFullYear();
  }).length;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">직원 관리</h1>
          <p className="text-sm text-gray-600 mt-1">본사 직원들의 정보를 관리합니다</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <UserPlus className="w-4 h-4 mr-2" />
          직원 추가
        </Button>
      </div>

      {/* KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="전체 직원"
          value={`${totalStaff}명`}
          icon={Users}
          color="red"
          trend={+2.1}
        />
        <KPICard
          title="재직 중"
          value={`${activeStaff}명`}
          icon={UserCheck}
          color="orange"
          trend={+1.5}
        />
        <KPICard
          title="휴직/기타"
          value={`${onLeaveStaff}명`}
          icon={UserX}
          color="green"
          trend={0}
        />
        <KPICard
          title="이번달 입사"
          value={`${newThisMonth}명`}
          icon={Calendar}
          color="purple"
          trend={+100}
        />
      </div>

      <Tabs defaultValue="list" className="space-y-6">
        <TabsList>
          <TabsTrigger value="list">직원 목록</TabsTrigger>
          <TabsTrigger value="departments">부서별 현황</TabsTrigger>
          <TabsTrigger value="reports">인사 리포트</TabsTrigger>
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
                      placeholder="이름, 이메일, 부서로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">전체 부서</option>
                    {departmentStats.map(dept => (
                      <option key={dept.name} value={dept.name}>{dept.name}</option>
                    ))}
                  </select>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="all">전체 상태</option>
                    <option value="재직">재직</option>
                    <option value="휴직">휴직</option>
                    <option value="퇴직">퇴직</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 직원 목록 테이블 */}
          <DataTable
            data={filteredStaff}
            columns={staffColumns}
            searchKey=""
            title={`직원 목록 (${filteredStaff.length}명)`}
          />
        </TabsContent>

        <TabsContent value="departments" className="space-y-6">
          {/* 부서별 통계 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departmentStats.map((dept, index) => (
              <Card key={dept.name}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{dept.name}</h3>
                      <p className="text-2xl font-bold mt-1">{dept.count}명</p>
                      <p className="text-sm text-gray-600">
                        전체의 {Math.round((dept.count / totalStaff) * 100)}%
                      </p>
                    </div>
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: dept.color }}
                    >
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 부서별 직원 상세 */}
          <Card>
            <CardHeader>
              <CardTitle>부서별 직원 현황</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentStats.map(dept => {
                  const deptStaff = staff.filter(s => s.department === dept.name);
                  const activeCount = deptStaff.filter(s => s.status === '재직').length;
                  
                  return (
                    <div key={dept.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: dept.color }}
                        ></div>
                        <div>
                          <h4 className="font-medium">{dept.name}</h4>
                          <p className="text-sm text-gray-600">
                            재직: {activeCount}명 / 전체: {dept.count}명
                          </p>
                        </div>
                      </div>
                      <div className="flex -space-x-2">
                        {deptStaff.slice(0, 3).map(member => (
                          <Avatar key={member.id} className="w-6 h-6 border-2 border-white">
                            <AvatarFallback className="bg-gray-300 text-xs">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                        {deptStaff.length > 3 && (
                          <div className="w-6 h-6 bg-gray-200 border-2 border-white rounded-full flex items-center justify-center text-xs">
                            +{deptStaff.length - 3}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>인사 리포트</CardTitle>
              <p className="text-sm text-gray-600">직원 현황 및 인사 분석 정보</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">근속 연수별 분포</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">1년 미만</span>
                        <span className="font-medium">3명 (15%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">1-3년</span>
                        <span className="font-medium">8명 (40%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">3-5년</span>
                        <span className="font-medium">6명 (30%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">5년 이상</span>
                        <span className="font-medium">3명 (15%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">권한별 분포</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">관리자</span>
                        <span className="font-medium">2명 (10%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">매니저</span>
                        <span className="font-medium">5명 (25%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">일반</span>
                        <span className="font-medium">13명 (65%)</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3">주요 인사 지표</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">평균 근속연수</p>
                      <p className="text-xl font-bold">2.8년</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">이직률 (연간)</p>
                      <p className="text-xl font-bold">8.5%</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                      <p className="text-sm text-gray-600">채용 성공률</p>
                      <p className="text-xl font-bold">92%</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 직원 추가 모달 */}
      <FormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddStaff}
        title="직원 추가"
        fields={staffFormFields}
      />

      {/* 직원 수정 모달 */}
      <FormModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedStaff(null);
        }}
        onSubmit={handleUpdateStaff}
        title="직원 정보 수정"
        fields={staffFormFields}
        initialData={selectedStaff || {}}
      />

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setSelectedStaff(null);
        }}
        onConfirm={confirmDelete}
        title="직원 삭제"
        description={`정말로 ${selectedStaff?.name} 직원을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
      />
    </div>
  );
}