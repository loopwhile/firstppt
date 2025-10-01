import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'date' | 'file' | 'tel' | 'month' | 'time';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  validation?: (value: any) => string | undefined;
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: FormField[];
  onSubmit: (data: any) => void;
  initialData?: any;
  submitText?: string;
  cancelText?: string;
  isLoading?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  onChange?: (fieldName: string, value: any, formData: any) => void;
}

export function FormModal({
  isOpen,
  onClose,
  title = "양식",
  fields = [],
  onSubmit,
  initialData = {},
  submitText = "저장",
  cancelText = "취소",
  isLoading = false,
  maxWidth = 'md',
  onChange
}: FormModalProps) {
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  // Filter and validate fields early
  const validFields = React.useMemo(() => {
    if (!Array.isArray(fields)) {
      console.warn('FormModal: fields prop is not an array:', fields);
      return [];
    }
    return fields.filter(field => {
      if (!field || typeof field !== 'object') {
        console.warn('FormModal: Invalid field object:', field);
        return false;
      }
      if (!field.name || !field.label || !field.type) {
        console.warn('FormModal: Field missing required properties:', field);
        return false;
      }
      return true;
    });
  }, [fields]);

  React.useEffect(() => {
    if (isOpen) {
      // initialData가 null이거나 undefined일 수 있으므로 안전하게 처리
      const safeInitialData = initialData && typeof initialData === 'object' ? initialData : {};
      setFormData(safeInitialData);
      setErrors({});
    } else {
      // 모달이 닫힐 때 formData 초기화
      setFormData({});
      setErrors({});
    }
  }, [isOpen]); // initialData 의존성 제거하여 무한루프 방지

  // initialData가 변경될 때만 폼 데이터 업데이트 (깊은 비교 없이 JSON.stringify로 변경 감지)
  const initialDataString = React.useMemo(() => 
    JSON.stringify(initialData || {}), [initialData]
  );
  
  React.useEffect(() => {
    if (isOpen && initialData) {
      const safeInitialData = initialData && typeof initialData === 'object' ? initialData : {};
      setFormData(prev => ({ ...prev, ...safeInitialData }));
    }
  }, [initialDataString, isOpen]);

  const handleChange = (name: string, value: any) => {
    const newFormData = { ...formData, [name]: value };
    setFormData(newFormData);
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Call onChange callback if provided
    if (onChange) {
      onChange(name, value, newFormData);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    validFields.forEach(field => {
      if (!field || !field.name) {
        console.warn('FormModal validateForm: Invalid field:', field);
        return;
      }
      
      const value = formData[field.name];
      
      // Required validation
      if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
        newErrors[field.name] = `${field.label}은(는) 필수 입력 항목입니다.`;
        return;
      }

      // Custom validation
      if (field.validation && value) {
        const error = field.validation(value);
        if (error) {
          newErrors[field.name] = error;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: FormField) => {
    // Add safety check
    if (!field || !field.name) {
      return null;
    }
    
    const value = formData[field.name] || '';
    const hasError = !!errors[field.name];

    switch (field.type) {
      case 'select':
        return (
          <select
            id={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kpi-red focus:border-transparent ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          >
            <option value="">{field.placeholder || `${field.label} 선택`}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            id={field.name}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kpi-red focus:border-transparent resize-none ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );

      case 'file':
        return (
          <input
            id={field.name}
            type="file"
            onChange={(e) => handleChange(field.name, e.target.files?.[0])}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kpi-red focus:border-transparent ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );

      case 'month':
        return (
          <input
            id={field.name}
            type="month"
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kpi-red focus:border-transparent ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            id={field.name}
            type="number"
            value={value || field.placeholder || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kpi-red focus:border-transparent ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );

      case 'time':
        return (
          <input
            id={field.name}
            type="time"
            value={value || ''}
            onChange={(e) => handleChange(field.name, e.target.value)}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kpi-red focus:border-transparent ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );

      default:
        return (
          <input
            id={field.name}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-kpi-red focus:border-transparent ${
              hasError ? 'border-red-500' : 'border-gray-300'
            }`}
            required={field.required}
          />
        );
    }
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg', 
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${maxWidthClasses[maxWidth]} max-h-[90vh] overflow-y-auto`}>
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            {title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            폼을 작성하여 데이터를 입력하거나 수정할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {validFields.map((field, index) => {
            if (!field || !field.name) {
              console.warn('FormModal render: Invalid field at index', index, field);
              return null;
            }
            return (
              <div key={field.name} className="space-y-2">
                <label 
                  htmlFor={field.name}
                  className="text-sm font-medium text-gray-700"
                >
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </label>
              
                {renderField(field)}
                
                {errors[field.name] && (
                  <p className="text-sm text-red-600">{errors[field.name]}</p>
                )}
              </div>
            );
          })}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              type="submit"
              className="bg-kpi-red hover:bg-red-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? '처리중...' : submitText}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}