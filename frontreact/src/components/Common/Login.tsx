import React, { useState } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Store, Lock, Mail, Users } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { api } from '../../lib/axios';

interface LoginProps {
  onLogin: (userType: 'HQ' | 'Store') => void;
  onRegister: () => void;
}

export function Login({ onLogin, onRegister }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState<'HQ' | 'Store'>('HQ');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('이메일과 비밀번호를 입력해주세요.');
      return;
    }

    try {
      const res = await api.post('/api/members/login', { email, password });
      if (res.status === 200 && res.data?.success) {
        toast.success(`${userType === 'HQ' ? '본사' : '가맹점'} 로그인 성공!`);
        onLogin(userType);
      } else {
        toast.error(res.data?.message || '로그인 실패');
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || '서버 연결 실패');
    }
  };

  return (
    <div className="min-h-screen bg-light-gray flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-kpi-orange rounded-xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">FranFriend ERP</h1>
          <p className="text-dark-gray">프랜차이즈 통합 관리 시스템</p>
        </div>

        {/* User Type Selection */}
        <div className="mb-6">
          <Label className="text-sm font-medium text-gray-700 mb-3 block">로그인 유형</Label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setUserType('HQ')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'HQ'
                  ? 'border-kpi-red bg-kpi-red text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-kpi-red'
              }`}
            >
              <Users className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm font-medium">본사</span>
            </button>
            <button
              type="button"
              onClick={() => setUserType('Store')}
              className={`p-4 rounded-lg border-2 transition-all ${
                userType === 'Store'
                  ? 'border-kpi-green bg-kpi-green text-white'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-kpi-green'
              }`}
            >
              <Store className="w-5 h-5 mx-auto mb-2" />
              <span className="text-sm font-medium">가맹점</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
              이메일
            </Label>
            <div className="relative">
              <Mail className="w-5 h-5 text-dark-gray absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                id="email"
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 h-12 border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="password" className="text-sm font-medium text-gray-700 mb-2 block">
              비밀번호
            </Label>
            <div className="relative">
              <Lock className="w-5 h-5 text-dark-gray absolute left-3 top-1/2 transform -translate-y-1/2" />
              <Input
                id="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 border-gray-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <Button
              type="submit"
              className={`w-full h-12 rounded-lg font-medium ${
                userType === 'HQ'
                  ? 'bg-kpi-red hover:bg-red-600 text-white'
                  : 'bg-kpi-green hover:bg-green-600 text-white'
              }`}
            >
              {userType === 'HQ' ? '본사 로그인' : '가맹점 로그인'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={onRegister}
              className="w-full h-12 rounded-lg font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              회원가입
            </Button>
          </div>
        </form>

        {/* Demo Accounts Info (원문 유지) */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">데모 계정</h4>
          <div className="text-xs text-blue-800 space-y-1">
            <p><strong>본사:</strong> hq@franfriend.com / demo123</p>
            <p><strong>가맹점:</strong> store@franfriend.com / demo123</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-dark-gray">
            © 2024 FranFriend ERP. All rights reserved.
          </p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="text-xs text-dark-gray hover:text-gray-900">이용약관</a>
            <a href="#" className="text-xs text-dark-gray hover:text-gray-900">개인정보처리방침</a>
            <a href="#" className="text-xs text-dark-gray hover:text-gray-900">고객지원</a>
          </div>
        </div>
      </Card>
    </div>
  );
}
