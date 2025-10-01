import React, { useState } from 'react';
import { KPICard } from '../Common/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormModal } from '../Common/FormModal';
import { ConfirmDialog } from '../Common/ConfirmDialog';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  ChevronLeft, 
  ChevronRight,
  UserCheck,
  UserX,
  Coffee,
  Sun,
  Moon,
  Sunset,
  MapPin,
  Timer,
  DollarSign,
  FileText,
  CalendarDays,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

// 인터페이스 정의
interface Staff {
  id: string;
  name: string;
  position: string;
  hourlyWage: number;
  monthlyWage: number;
  employmentType: '정규직' | '파트타임';
  phone: string;
  email: string;
}

interface WorkSchedule {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  workType: 'open' | 'middle' | 'close' | 'vacation' | 'off';
  startTime: string;
  endTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  breakTime: number; // 분 단위
  status: 'scheduled' | 'confirmed' | 'working' | 'completed' | 'absent';
  notes?: string;
}

interface VacationRequest {
  id: string;
  staffId: string;
  staffName: string;
  startDate: string;
  endDate: string;
  type: 'annual' | 'sick' | 'personal' | 'maternity';
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  approvedBy?: string;
  approvedDate?: string;
}

interface WorkTimeTemplate {
  id: string;
  name: string;
  type: 'open' | 'middle' | 'close' | 'A' | 'B' | 'C' | 'D';
  startTime: string;
  endTime: string;
  breakTime: number;
  description: string;
  employmentType: '파트타임' | '정규직';
}

// 영업시간 정보 (매일 동일)
const BUSINESS_HOURS = {
  open: '08:00',
  close: '22:00'
};

// 영업시간 표시 함수
const getBusinessHours = (date: Date) => {
  return BUSINESS_HOURS; // 매일 동일한 영업시간
};

// 샘플 데이터
const mockStaff: Staff[] = [
  {
    id: '1',
    name: '김철수',
    position: '매장 매니저',
    hourlyWage: 12000,
    monthlyWage: 3200000,
    employmentType: '정규직',
    phone: '010-1234-5678',
    email: 'kim@store.com'
  },
  {
    id: '2',
    name: '이영희',
    position: '주방장',
    hourlyWage: 15000,
    monthlyWage: 3500000,
    employmentType: '정규직',
    phone: '010-2345-6789',
    email: 'lee@store.com'
  },
  {
    id: '3',
    name: '박민수',
    position: '홀 서빙',
    hourlyWage: 10000,
    monthlyWage: 0,
    employmentType: '파트타임',
    phone: '010-3456-7890',
    email: 'park@store.com'
  },
  {
    id: '4',
    name: '최지은',
    position: '캐셔',
    hourlyWage: 9500,
    monthlyWage: 0,
    employmentType: '파트타임',
    phone: '010-4567-8901',
    email: 'choi@store.com'
  },
  {
    id: '5',
    name: '정유진',
    position: '주방 보조',
    hourlyWage: 9200,
    monthlyWage: 0,
    employmentType: '파트타임',
    phone: '010-5678-9012',
    email: 'jung@store.com'
  }
];

const workTimeTemplates: WorkTimeTemplate[] = [
  // 파트타임용 템플릿 - 영업시간 08:00~22:00 + 마감작업
  {
    id: '1',
    name: '오픈 근무',
    type: 'open',
    startTime: '08:00',
    endTime: '14:00',
    breakTime: 60,
    description: '매장 오픈 준비 및 오전 운영 (6시간)',
    employmentType: '파트타임'
  },
  {
    id: '2',
    name: '미들 근무',
    type: 'middle',
    startTime: '12:00',
    endTime: '18:00',
    breakTime: 60,
    description: '점심~오후 피크타임 운영 (6시간)',
    employmentType: '파트타임'
  },
  {
    id: '3',
    name: '마감 근무',
    type: 'close',
    startTime: '16:00',
    endTime: '22:30',
    breakTime: 30,
    description: '오후~매장 마감 (6.5시간)',
    employmentType: '파트타임'
  },
  // 정규직용 템플릿 - 영업시간 커버 + 마감작업 (휴게시간 90분 고정)
  {
    id: '4',
    name: 'A 근무 (오픈형)',
    type: 'A',
    startTime: '08:00',
    endTime: '20:00',
    breakTime: 90,
    description: '오픈~저녁 12시간 근무 (휴게: 13:00~14:30)',
    employmentType: '정규직'
  },
  {
    id: '5',
    name: 'B 근무 (미들형)',
    type: 'B',
    startTime: '10:00',
    endTime: '22:00',
    breakTime: 90,
    description: '오전~영업종료 12시간 근무 (휴게: 15:00~16:30)',
    employmentType: '정규직'
  },
  {
    id: '6',
    name: 'C 근무 (마감형)',
    type: 'C',
    startTime: '11:00',
    endTime: '22:30',
    breakTime: 90,
    description: '오전~마감작업 11.5시간 근무 (휴게: 16:00~17:30)',
    employmentType: '정규직'
  },
  {
    id: '7',
    name: 'D 근무 (풀타임)',
    type: 'D',
    startTime: '09:00',
    endTime: '21:00',
    breakTime: 90,
    description: '영업시간 풀커버 12시간 근무 (휴게: 14:00~15:30)',
    employmentType: '정규직'
  }
];

const mockSchedules: WorkSchedule[] = [
  {
    id: '1',
    staffId: '1',
    staffName: '김철수',
    date: '2024-10-01',
    workType: 'open',
    startTime: '08:00',
    endTime: '16:00',
    actualStartTime: '07:55',
    actualEndTime: '16:10',
    breakTime: 60,
    status: 'completed',
    notes: '매장 점검 완료'
  },
  {
    id: '2',
    staffId: '2',
    staffName: '이영희',
    date: '2024-10-01',
    workType: 'middle',
    startTime: '14:00',
    endTime: '22:00',
    actualStartTime: '13:58',
    actualEndTime: '22:05',
    breakTime: 60,
    status: 'completed'
  },
  {
    id: '3',
    staffId: '3',
    staffName: '박민수',
    date: '2024-10-01',
    workType: 'close',
    startTime: '20:00',
    endTime: '02:00',
    breakTime: 30,
    status: 'working'
  },
  {
    id: '4',
    staffId: '1',
    staffName: '김철수',
    date: '2024-10-02',
    workType: 'vacation',
    startTime: '',
    endTime: '',
    breakTime: 0,
    status: 'confirmed',
    notes: '연차 휴가'
  },
  {
    id: '5',
    staffId: '4',
    staffName: '최지은',
    date: '2024-10-02',
    workType: 'middle',
    startTime: '14:00',
    endTime: '20:00',
    breakTime: 30,
    status: 'scheduled'
  }
];

const mockVacations: VacationRequest[] = [
  {
    id: '1',
    staffId: '1',
    staffName: '김철수',
    startDate: '2024-10-02',
    endDate: '2024-10-02',
    type: 'annual',
    reason: '가족 행사 참석',
    status: 'approved',
    requestDate: '2024-09-25',
    approvedBy: '매장장',
    approvedDate: '2024-09-26'
  },
  {
    id: '2',
    staffId: '3',
    staffName: '박민수',
    startDate: '2024-10-05',
    endDate: '2024-10-06',
    type: 'sick',
    reason: '몸살감기',
    status: 'pending',
    requestDate: '2024-10-01'
  }
];

export function StaffSchedule() {
  const [schedules, setSchedules] = useState<WorkSchedule[]>(mockSchedules);
  const [vacations, setVacations] = useState<VacationRequest[]>(mockVacations);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedStaff, setSelectedStaff] = useState<string>('all');
  const [currentTab, setCurrentTab] = useState('schedule');
  const [searchTerm, setSearchTerm] = useState('');

  // 모달 상태
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isVacationModalOpen, setIsVacationModalOpen] = useState(false);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<WorkSchedule | null>(null);
  const [editingVacation, setEditingVacationRequest] = useState<VacationRequest | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'schedule' | 'vacation', id: string } | null>(null);

  // 현재 주의 날짜들 계산
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day;
    start.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const newDate = new Date(start);
      newDate.setDate(start.getDate() + i);
      weekDates.push(newDate);
    }
    return weekDates;
  };

  const weekDates = getWeekDates(currentDate);

  // 날짜별 스케줄 필터링
  const getSchedulesForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return schedules.filter(schedule => {
      const matchesDate = schedule.date === dateString;
      const matchesStaff = selectedStaff === 'all' || schedule.staffId === selectedStaff;
      const matchesSearch = schedule.staffName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesDate && matchesStaff && matchesSearch;
    });
  };

  // 근무 유형별 아이콘
  const getWorkTypeIcon = (workType: string) => {
    switch (workType) {
      case 'open': return <Sun className="w-4 h-4" />;
      case 'middle': return <Coffee className="w-4 h-4" />;
      case 'close': return <Moon className="w-4 h-4" />;
      case 'A': return <Clock className="w-4 h-4" />;
      case 'B': return <Clock className="w-4 h-4" />;
      case 'C': return <Clock className="w-4 h-4" />;
      case 'D': return <Clock className="w-4 h-4" />;
      case 'vacation': return <CalendarDays className="w-4 h-4" />;
      case 'off': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // 근무 유형별 배지
  const getWorkTypeBadge = (workType: string) => {
    switch (workType) {
      case 'open': return <Badge className="bg-blue-100 text-blue-800">오픈</Badge>;
      case 'middle': return <Badge className="bg-green-100 text-green-800">미들</Badge>;
      case 'close': return <Badge className="bg-purple-100 text-purple-800">마감</Badge>;
      case 'A': return <Badge className="bg-indigo-100 text-indigo-800">A근무</Badge>;
      case 'B': return <Badge className="bg-indigo-100 text-indigo-800">B근무</Badge>;
      case 'C': return <Badge className="bg-indigo-100 text-indigo-800">C근무</Badge>;
      case 'D': return <Badge className="bg-indigo-100 text-indigo-800">D근무</Badge>;
      case 'vacation': return <Badge className="bg-yellow-100 text-yellow-800">휴가</Badge>;
      case 'off': return <Badge className="bg-gray-100 text-gray-800">휴무</Badge>;
      default: return <Badge>{workType}</Badge>;
    }
  };

  // 상태별 배지
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'scheduled': return <Badge variant="outline">예정</Badge>;
      case 'confirmed': return <Badge className="bg-blue-100 text-blue-800">확정</Badge>;
      case 'working': return <Badge className="bg-green-100 text-green-800">근무중</Badge>;
      case 'completed': return <Badge className="bg-gray-100 text-gray-800">완료</Badge>;
      case 'absent': return <Badge className="bg-red-100 text-red-800">결근</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  // 휴가 상태별 배지
  const getVacationStatusBadge = (status: string) => {
    switch (status) {
      case 'pending': return <Badge className="bg-yellow-100 text-yellow-800">대기중</Badge>;
      case 'approved': return <Badge className="bg-green-100 text-green-800">승인</Badge>;
      case 'rejected': return <Badge className="bg-red-100 text-red-800">거부</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  // 근무시간 계산
  const calculateWorkHours = (schedule: WorkSchedule) => {
    if (!schedule.actualStartTime || !schedule.actualEndTime) return 0;
    
    const start = new Date(`2024-01-01 ${schedule.actualStartTime}`);
    let end = new Date(`2024-01-01 ${schedule.actualEndTime}`);
    
    // 다음날 새벽까지 근무하는 경우
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const breakHours = schedule.breakTime / 60;
    
    return Math.max(0, diffHours - breakHours);
  };

  // 급여 계산
  const calculatePay = (schedule: WorkSchedule) => {
    const staff = mockStaff.find(s => s.id === schedule.staffId);
    if (!staff || schedule.status !== 'completed') return 0;
    
    const workHours = calculateWorkHours(schedule);
    return Math.round(workHours * staff.hourlyWage);
  };

  // 통계 계산
  const todaySchedules = schedules.filter(s => s.date === new Date().toISOString().split('T')[0]);
  const workingNow = todaySchedules.filter(s => s.status === 'working').length;
  const totalWorkHours = schedules
    .filter(s => s.status === 'completed')
    .reduce((sum, schedule) => sum + calculateWorkHours(schedule), 0);
  const pendingVacations = vacations.filter(v => v.status === 'pending').length;
  
  // 파트타임 직원의 급여만 계산
  const partTimePayroll = schedules
    .filter(s => s.status === 'completed')
    .filter(s => {
      const staff = mockStaff.find(staff => staff.id === s.staffId);
      return staff?.employmentType === '파트타임';
    })
    .reduce((sum, s) => sum + calculatePay(s), 0);

  // 선택된 직원 상태
  const [selectedStaffForForm, setSelectedStaffForForm] = useState<string>('');
  const [selectedWorkType, setSelectedWorkType] = useState<string>('');

  // 일정 추가/수정 폼 필드 (메모이제이션)
  const scheduleFormFields = React.useMemo(() => {
    const getFields = (selectedStaffId: string, workType?: string) => {
      const selectedStaff = mockStaff.find(s => s.id === selectedStaffId);
      const isPartTime = selectedStaff?.employmentType === '파트타임';

      // 고용형태에 맞는 템플릿 필터링
      const availableTemplates = workTimeTemplates.filter(
        template => template.employmentType === selectedStaff?.employmentType
      );

      const workTypeOptions = [
        // 템플릿 옵션들
        ...availableTemplates.map(template => ({
          value: template.type,
          label: template.name
        })),
        // 기본 옵션들
        { value: 'vacation', label: '휴가' },
        { value: 'off', label: '휴무' }
      ];

      // 직접 시간 입력 옵션 (정규직만)
      if (!isPartTime) {
        workTypeOptions.push({ value: 'custom', label: '직접 입력' });
      }

      const fields = [
        { 
          name: 'staffId', 
          label: '직원', 
          type: 'select' as const, 
          required: true, 
          placeholder: '직원을 선택하세요',
          options: mockStaff.map(staff => ({ 
            value: staff.id, 
            label: `${staff.name} (${staff.position}) - ${staff.employmentType}` 
          }))
        },
        { 
          name: 'date', 
          label: '날짜', 
          type: 'date' as const, 
          required: true 
        },
        { 
          name: 'workType', 
          label: '근무 템플릿', 
          type: 'select' as const, 
          required: true, 
          placeholder: '근무 템플릿을 선택하세요',
          options: workTypeOptions
        }
      ];

      // 정규직이 '직접 입력'을 선택한 경우 시간 필드 추가
      if (!isPartTime && workType === 'custom') {
        fields.push(
          { name: 'startTime', label: '시작 시간', type: 'time' as const, required: true },
          { name: 'endTime', label: '종료 시간', type: 'time' as const, required: true },
          { name: 'breakTime', label: '휴게시간 (분)', type: 'number' as const, required: true, placeholder: '120' }
        );
      }

      fields.push({ name: 'notes', label: '메모', type: 'textarea' as const, required: false });

      return fields;
    };

    return getFields;
  }, []);

  // 휴가 신청 폼 필드
  const vacationFormFields = React.useMemo(() => [
    { 
      name: 'staffId', 
      label: '직원', 
      type: 'select' as const, 
      required: true,
      placeholder: '직원을 선택하세요',
      options: mockStaff.map(staff => ({ 
        value: staff.id, 
        label: `${staff.name} (${staff.position})` 
      }))
    },
    { name: 'startDate', label: '시작일', type: 'date' as const, required: true },
    { name: 'endDate', label: '종료일', type: 'date' as const, required: true },
    { 
      name: 'type', 
      label: '휴가 유형', 
      type: 'select' as const, 
      required: true,
      placeholder: '휴가 유형을 선택하세요',
      options: [
        { value: 'annual', label: '연차' },
        { value: 'sick', label: '병가' },
        { value: 'personal', label: '개인사유' },
        { value: 'maternity', label: '출산휴가' }
      ]
    },
    { name: 'reason', label: '사유', type: 'textarea' as const, required: true, placeholder: '휴가 사유를 입력하세요' }
  ], []);

  // 출퇴근 기록 폼 필드
  const attendanceFormFields = React.useMemo(() => [
    { 
      name: 'scheduleId', 
      label: '스케줄', 
      type: 'select' as const, 
      required: true,
      placeholder: '스케줄을 선택하세요',
      options: schedules
        .filter(s => s.status === 'scheduled' || s.status === 'confirmed' || s.status === 'working')
        .filter(s => s.date === new Date().toISOString().split('T')[0]) // 오늘 날짜만
        .map(s => {
          const workTypeLabel = 
            s.workType === 'open' ? '오픈' :
            s.workType === 'middle' ? '미들' :
            s.workType === 'close' ? '마감' :
            s.workType === 'A' ? 'A근무' :
            s.workType === 'B' ? 'B근무' :
            s.workType === 'C' ? 'C근무' :
            s.workType === 'D' ? 'D근무' :
            s.workType === 'vacation' ? '휴가' :
            s.workType === 'off' ? '휴무' : s.workType;
          
          return { 
            value: s.id, 
            label: `${s.staffName} - ${workTypeLabel} (${s.startTime}~${s.endTime})` 
          };
        })
    },
    { name: 'actualStartTime', label: '실제 출근 시간', type: 'time' as const, required: false },
    { name: 'actualEndTime', label: '실제 퇴근 시간', type: 'time' as const, required: false },
    { 
      name: 'status', 
      label: '상태', 
      type: 'select' as const, 
      required: true,
      placeholder: '상태를 선택하세요',
      options: [
        { value: 'working', label: '근무중' },
        { value: 'completed', label: '완료' },
        { value: 'absent', label: '결근' }
      ]
    }
  ], [schedules]);

  // 핸들러 함수들
  const handleAddSchedule = (data: any) => {
    if (!data.staffId || !data.date || !data.workType) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const staff = mockStaff.find(s => s.id === data.staffId);
    const template = workTimeTemplates.find(t => t.type === data.workType);
    
    let startTime, endTime, breakTime;
    
    if (template) {
      // 템플릿 사용 (파트타임 또는 정규직 템플릿)
      startTime = template.startTime;
      endTime = template.endTime;
      breakTime = template.breakTime;
    } else if (data.workType === 'custom') {
      // 정규직 직접 입력
      startTime = data.startTime || '';
      endTime = data.endTime || '';
      breakTime = parseInt(data.breakTime) || 60;
    } else {
      // 휴가, 휴무 등
      startTime = '';
      endTime = '';
      breakTime = 0;
    }
    
    const newSchedule: WorkSchedule = {
      id: Date.now().toString(),
      staffId: data.staffId,
      staffName: staff?.name || '',
      date: data.date,
      workType: data.workType,
      startTime,
      endTime,
      breakTime,
      status: 'scheduled',
      notes: data.notes || ''
    };
    
    setSchedules([...schedules, newSchedule]);
    setIsScheduleModalOpen(false);
    setSelectedStaffForForm('');
    setSelectedWorkType('');
    toast.success('근무 일정이 추가되었습니다.');
  };

  const handleAddVacation = (data: any) => {
    if (!data.staffId || !data.startDate || !data.endDate || !data.type || !data.reason) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    const staff = mockStaff.find(s => s.id === data.staffId);
    
    const newVacation: VacationRequest = {
      id: Date.now().toString(),
      staffId: data.staffId,
      staffName: staff?.name || '',
      startDate: data.startDate,
      endDate: data.endDate,
      type: data.type,
      reason: data.reason,
      status: 'pending',
      requestDate: new Date().toISOString().split('T')[0]
    };
    
    setVacations([...vacations, newVacation]);
    setIsVacationModalOpen(false);
    toast.success('휴가 신청이 등록되었습니다.');
  };

  const handleUpdateAttendance = (data: any) => {
    if (!data.scheduleId || !data.status) {
      toast.error('필수 항목을 모두 입력해주세요.');
      return;
    }

    setSchedules(schedules.map(schedule => 
      schedule.id === data.scheduleId 
        ? { 
            ...schedule, 
            actualStartTime: data.actualStartTime || schedule.actualStartTime,
            actualEndTime: data.actualEndTime || schedule.actualEndTime,
            status: data.status
          }
        : schedule
    ));
    setIsAttendanceModalOpen(false);
    toast.success('출퇴근 기록이 업데이트되었습니다.');
  };

  const handleApproveVacation = (id: string, approved: boolean) => {
    setVacations(vacations.map(vacation => 
      vacation.id === id 
        ? { 
            ...vacation, 
            status: approved ? 'approved' : 'rejected',
            approvedBy: '매장장',
            approvedDate: new Date().toISOString().split('T')[0]
          }
        : vacation
    ));
    toast.success(`휴가 신청이 ${approved ? '승인' : '거부'}되었습니다.`);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">근무 일정 관리</h1>
          <p className="text-sm text-gray-600 mt-1">직원들의 출퇴근 및 휴가 일정을 관리합니다</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsScheduleModalOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            일정 추가
          </Button>
          <Button onClick={() => setIsVacationModalOpen(true)} variant="outline" className="gap-2">
            <CalendarDays className="w-4 h-4" />
            휴가 신청
          </Button>
          <Button onClick={() => setIsAttendanceModalOpen(true)} variant="outline" className="gap-2">
            <Clock className="w-4 h-4" />
            출퇴근 기록
          </Button>
        </div>
      </div>

      {/* KPI 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="현재 근무중"
          value={`${workingNow}명`}
          icon={UserCheck}
          color="green"
          trend={+12.5}
        />
        <KPICard
          title="이번 주 총 근무시간"
          value={`${totalWorkHours.toFixed(1)}시간`}
          icon={Timer}
          color="purple"
          trend={+8.3}
        />
        <KPICard
          title="대기중인 휴가"
          value={`${pendingVacations}건`}
          icon={AlertTriangle}
          color="orange"
          trend={-5.2}
        />
        <KPICard
          title="파트타임 급여"
          value={`${partTimePayroll.toLocaleString()}원`}
          icon={DollarSign}
          color="purple"
          trend={+15.7}
        />
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="schedule">근무 일정</TabsTrigger>
          <TabsTrigger value="vacation">휴가 관리</TabsTrigger>
          <TabsTrigger value="attendance">출퇴근 현황</TabsTrigger>
          <TabsTrigger value="templates">근무 템플릿</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-4">
          {/* 필터 및 검색 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="직원명으로 검색..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="직원 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체 직원</SelectItem>
                      {mockStaff.map(staff => (
                        <SelectItem key={staff.id} value={staff.id}>
                          {staff.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={viewMode} onValueChange={(value: any) => setViewMode(value)}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">주간</SelectItem>
                      <SelectItem value="month">월간</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 캘린더 네비게이션 */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button variant="outline" onClick={() => navigateWeek('prev')} className="gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  이전 주
                </Button>
                
                <h2 className="font-semibold">
                  {(() => {
                    const startDate = weekDates[0];
                    const endDate = weekDates[6];
                    const startMonth = startDate.getMonth() + 1;
                    const endMonth = endDate.getMonth() + 1;
                    const year = startDate.getFullYear();
                    
                    if (startMonth === endMonth) {
                      // 같은 월인 경우
                      return `${year}년 ${startMonth}월 ${startDate.getDate()}일 - ${endDate.getDate()}일`;
                    } else {
                      // 다른 월인 경우  
                      return `${year}년 ${startMonth}월 ${startDate.getDate()}일 - ${endMonth}월 ${endDate.getDate()}일`;
                    }
                  })()}
                </h2>
                
                <Button variant="outline" onClick={() => navigateWeek('next')} className="gap-2">
                  다음 주
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* 주간 스케줄 그리드 */}
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-7 gap-4">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="font-semibold mb-2 pb-2 border-b">
                      <div>{day}</div>
                      <div className="text-sm text-gray-600">
                        {weekDates[index].getDate()}
                      </div>
                    </div>
                    
                    <div className="space-y-2 min-h-32">
                      {(() => {
                        const daySchedules = getSchedulesForDate(weekDates[index]);
                        const businessHours = getBusinessHours(weekDates[index]);
                        
                        if (daySchedules.length === 0) {
                          // 스케줄이 없는 경우 영업시간 표시
                          return (
                            <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 border-dashed">
                              <div className="text-center space-y-3">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="p-2 bg-blue-100 rounded-full">
                                    <Clock className="w-4 h-4 text-blue-600" />
                                  </div>
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-blue-800 mb-1">매장 영업시간</div>
                                  <div className="text-lg font-bold text-blue-900">
                                    {businessHours.open} - {businessHours.close}
                                  </div>
                                  <div className="text-xs text-blue-600 mt-1">
                                    (14시간 영업)
                                  </div>
                                </div>
                                <div className="pt-2 border-t border-blue-200">
                                  <div className="text-xs text-blue-500 font-medium">
                                    직원 스케줄 없음
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        
                        return daySchedules.map((schedule) => (
                          <Card key={schedule.id} className="p-3 text-left hover:shadow-md transition-shadow cursor-pointer">
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="font-medium text-sm">{schedule.staffName}</span>
                                {getStatusBadge(schedule.status)}
                              </div>
                              
                              <div className="flex items-center gap-1">
                                {getWorkTypeIcon(schedule.workType)}
                                {getWorkTypeBadge(schedule.workType)}
                              </div>
                              
                              {schedule.workType !== 'vacation' && schedule.workType !== 'off' && (
                                <div className="flex items-center gap-1 text-xs">
                                  <Clock className="w-3 h-3" />
                                  {schedule.startTime} - {schedule.endTime}
                                </div>
                              )}
                              
                              {schedule.actualStartTime && schedule.actualEndTime && (
                                <div className="text-xs text-gray-600">
                                  실제: {schedule.actualStartTime} - {schedule.actualEndTime}
                                  {(() => {
                                    const staff = mockStaff.find(s => s.id === schedule.staffId);
                                    const isPartTime = staff?.employmentType === '파트타임';
                                    return isPartTime ? (
                                      <>
                                        <br />
                                        급여: {calculatePay(schedule).toLocaleString()}원
                                      </>
                                    ) : null;
                                  })()}
                                </div>
                              )}
                              
                              <div className="flex justify-between items-center">
                                <div className="text-xs text-gray-500">
                                  휴게: {schedule.breakTime}분
                                </div>
                                
                                <div className="flex gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      setEditingSchedule(schedule);
                                      setSelectedStaffForForm(schedule.staffId);
                                    }}
                                    className="p-1 h-6 w-6"
                                  >
                                    <Edit className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setDeleteConfirm({ type: 'schedule', id: schedule.id })}
                                    className="p-1 h-6 w-6 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ));
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vacation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5" />
                휴가 신청 관리
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {vacations.map((vacation) => (
                  <div key={vacation.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{vacation.staffName}</span>
                        {getVacationStatusBadge(vacation.status)}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>기간: {vacation.startDate} ~ {vacation.endDate}</div>
                        <div>유형: {vacation.type === 'annual' ? '연차' : vacation.type === 'sick' ? '병가' : vacation.type === 'personal' ? '개인사유' : '출산휴가'}</div>
                        <div>사유: {vacation.reason}</div>
                        <div>신청일: {vacation.requestDate}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {vacation.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            onClick={() => handleApproveVacation(vacation.id, true)}
                            className="gap-1"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            승인
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleApproveVacation(vacation.id, false)}
                            className="gap-1"
                          >
                            <XCircle className="w-4 h-4" />
                            거부
                          </Button>
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setDeleteConfirm({ type: 'vacation', id: vacation.id })}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  출퇴근 현황
                </CardTitle>
                <Button onClick={() => setIsAttendanceModalOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  출퇴근 기록
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedules
                  .filter(s => s.status === 'scheduled' || s.status === 'confirmed' || s.status === 'working' || s.status === 'completed')
                  .filter(s => {
                    // 최근 7일 내의 일정만 표시
                    const scheduleDate = new Date(s.date);
                    const today = new Date();
                    const diffTime = today.getTime() - scheduleDate.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays >= -1 && diffDays <= 7; // 내일부터 일주일 전까지
                  })
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // 최신 순으로 정렬
                  .map((schedule) => {
                    const staff = mockStaff.find(s => s.id === schedule.staffId);
                    const isPartTime = staff?.employmentType === '파트타임';
                    
                    return (
                      <div key={schedule.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium">{schedule.staffName}</span>
                            <Badge variant="outline" className={`text-xs ${
                              isPartTime ? 'border-orange-200 text-orange-700' : 'border-blue-200 text-blue-700'
                            }`}>
                              {staff?.employmentType || '정규직'}
                            </Badge>
                            {getStatusBadge(schedule.status)}
                            {getWorkTypeBadge(schedule.workType)}
                          </div>
                          <div className="text-sm text-gray-600">
                            <div>날짜: {schedule.date}</div>
                            <div>스케줄: {
                              schedule.workType === 'open' ? '오픈 근무' :
                              schedule.workType === 'middle' ? '미들 근무' :
                              schedule.workType === 'close' ? '마감 근무' :
                              schedule.workType === 'A' ? 'A근무 (09시 시작)' :
                              schedule.workType === 'B' ? 'B근무 (10시 시작)' :
                              schedule.workType === 'C' ? 'C근무 (11시 시작)' :
                              schedule.workType === 'D' ? 'D근무 (12시 시작)' :
                              schedule.workType === 'vacation' ? '휴가' :
                              schedule.workType === 'off' ? '휴무' : schedule.workType
                            }</div>
                            <div>예정: {schedule.startTime} - {schedule.endTime}</div>
                            {schedule.actualStartTime && schedule.actualEndTime && (
                              <div>실제: {schedule.actualStartTime} - {schedule.actualEndTime}</div>
                            )}
                            <div>근무시간: {calculateWorkHours(schedule).toFixed(1)}시간</div>
                            {isPartTime && (
                              <div>예상급여: {calculatePay(schedule).toLocaleString()}원</div>
                            )}
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            {calculateWorkHours(schedule).toFixed(1)}h
                          </div>
                          {isPartTime && (
                            <div className="text-sm text-gray-600">
                              {calculatePay(schedule).toLocaleString()}원
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

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                근무 시간 템플릿
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {workTimeTemplates.map((template) => (
                  <Card key={template.id} className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      {getWorkTypeIcon(template.type)}
                      <h3 className="font-medium">{template.name}</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>시간: {template.startTime} - {template.endTime}</div>
                      <div>휴게: {template.breakTime}분</div>
                      <div className="text-gray-600">{template.description}</div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 모달들 */}
      <FormModal
        key="add-schedule"
        isOpen={isScheduleModalOpen}
        onClose={() => {
          setIsScheduleModalOpen(false);
          setSelectedStaffForForm('');
          setSelectedWorkType('');
        }}
        onSubmit={handleAddSchedule}
        title="근무 일정 추가"
        fields={scheduleFormFields(selectedStaffForForm, selectedWorkType)}
        initialData={{
          date: new Date().toISOString().split('T')[0],
          breakTime: 120
        }}
        onChange={(fieldName, value, formData) => {
          if (fieldName === 'staffId') {
            setSelectedStaffForForm(value);
          } else if (fieldName === 'workType') {
            setSelectedWorkType(value);
          }
        }}
      />

      <FormModal
        isOpen={isVacationModalOpen}
        onClose={() => setIsVacationModalOpen(false)}
        onSubmit={handleAddVacation}
        title="휴가 신청"
        fields={vacationFormFields}
      />

      <FormModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        onSubmit={handleUpdateAttendance}
        title="출퇴근 기록"
        fields={attendanceFormFields}
      />

      <FormModal
        key={`edit-schedule-${editingSchedule?.id || 'new'}`}
        isOpen={!!editingSchedule}
        onClose={() => {
          setEditingSchedule(null);
          setSelectedStaffForForm('');
          setSelectedWorkType('');
        }}
        onSubmit={(data) => {
          const staff = mockStaff.find(s => s.id === data.staffId);
          const template = workTimeTemplates.find(t => t.type === data.workType);
          
          let startTime, endTime, breakTime;
          
          if (template) {
            // 템플릿 사용 (파트타임 또는 정규직 템플릿)
            startTime = template.startTime;
            endTime = template.endTime;
            breakTime = template.breakTime;
          } else if (data.workType === 'custom') {
            // 정규직 직접 입력
            startTime = data.startTime || '';
            endTime = data.endTime || '';
            breakTime = data.breakTime || 60;
          } else {
            // 휴가, 휴무 등
            startTime = '';
            endTime = '';
            breakTime = 0;
          }

          setSchedules(schedules.map(s => 
            s.id === editingSchedule?.id ? { 
              ...s, 
              ...data,
              startTime,
              endTime,
              breakTime,
              staffName: staff?.name || s.staffName
            } : s
          ));
          setEditingSchedule(null);
          setSelectedStaffForForm('');
          setSelectedWorkType('');
          toast.success('일정이 수정되었습니다.');
        }}
        title="일정 수정"
        fields={scheduleFormFields(selectedStaffForForm || editingSchedule?.staffId || '', selectedWorkType || editingSchedule?.workType)}
        initialData={editingSchedule || undefined}
        onChange={(fieldName, value, formData) => {
          if (fieldName === 'staffId') {
            setSelectedStaffForForm(value);
          } else if (fieldName === 'workType') {
            setSelectedWorkType(value);
          }
        }}
      />

      <ConfirmDialog
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (deleteConfirm) {
            if (deleteConfirm.type === 'schedule') {
              setSchedules(schedules.filter(s => s.id !== deleteConfirm.id));
              toast.success('일정이 삭제되었습니다.');
            } else {
              setVacations(vacations.filter(v => v.id !== deleteConfirm.id));
              toast.success('휴가 신청이 삭제되었습니다.');
            }
            setDeleteConfirm(null);
          }
        }}
        title={deleteConfirm?.type === 'schedule' ? '일정 삭제' : '휴가 신청 삭제'}
        description="정말로 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        cancelText="취소"
      />
    </div>
  );
}