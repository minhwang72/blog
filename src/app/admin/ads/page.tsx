'use client';

import { useState, useEffect } from 'react';
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  EyeSlashIcon,
  MegaphoneIcon,
  Cog6ToothIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

interface AdSetting {
  id: number;
  name: string;
  position: 'top' | 'middle' | 'bottom' | 'sidebar' | 'inline';
  adCode: string;
  enabled: boolean;
  postTypes: string;
  displayRules: string | null;
  createdAt: string;
  updatedAt: string;
}

const positionOptions = [
  { value: 'top', label: '포스트 상단', description: '포스트 제목 아래에 표시' },
  { value: 'middle', label: '포스트 중간', description: '본문 중간에 표시' },
  { value: 'bottom', label: '포스트 하단', description: '포스트 끝에 표시' },
  { value: 'sidebar', label: '사이드바', description: '사이드바 영역에 표시' },
  { value: 'inline', label: '인라인', description: '본문 내용 중간에 삽입' },
];

export default function AdminAdsPage() {
  const [adSettings, setAdSettings] = useState<AdSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<AdSetting | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    position: 'top' as AdSetting['position'],
    adCode: '',
    enabled: true,
    postTypes: 'all',
    displayRules: '',
  });

  useEffect(() => {
    fetchAdSettings();
  }, []);

  const fetchAdSettings = async () => {
    try {
      const response = await fetch('/api/admin/ads');
      if (response.ok) {
        const data = await response.json();
        setAdSettings(data);
      }
    } catch (error) {
      console.error('Failed to fetch ad settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = editingAd ? `/api/admin/ads/${editingAd.id}` : '/api/admin/ads';
      const method = editingAd ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert(editingAd ? '광고 설정이 수정되었습니다!' : '광고 설정이 생성되었습니다!');
        closeModal();
        fetchAdSettings();
      } else {
        const errorData = await response.json();
        alert(errorData.message || '광고 설정 저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('광고 설정 저장 중 오류가 발생했습니다.');
    }
  };

  const handleEdit = (ad: AdSetting) => {
    setEditingAd(ad);
    setFormData({
      name: ad.name,
      position: ad.position,
      adCode: ad.adCode,
      enabled: ad.enabled,
      postTypes: ad.postTypes,
      displayRules: ad.displayRules || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 이 광고 설정을 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.')) return;

    try {
      const response = await fetch(`/api/admin/ads/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('광고 설정이 삭제되었습니다.');
        fetchAdSettings();
      } else {
        const errorData = await response.json();
        alert(errorData.message || '광고 설정 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('광고 설정 삭제 중 오류가 발생했습니다.');
    }
  };

  const toggleEnabled = async (id: number, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/ads/${id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled: !currentStatus }),
      });

      if (response.ok) {
        fetchAdSettings();
      } else {
        alert('광고 활성화 상태 변경에 실패했습니다.');
      }
    } catch (error) {
      console.error('Toggle error:', error);
      alert('광고 활성화 상태 변경 중 오류가 발생했습니다.');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingAd(null);
    setFormData({
      name: '',
      position: 'top',
      adCode: '',
      enabled: true,
      postTypes: 'all',
      displayRules: '',
    });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '오늘';
    if (diffDays === 2) return '어제';
    if (diffDays <= 7) return `${diffDays - 1}일 전`;
    return date.toLocaleDateString('ko-KR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">광고 설정</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Google AdSense 및 기타 광고를 관리할 수 있습니다.
            </p>
          </div>
          
          <button
            onClick={openModal}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-sm"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            새 광고 설정
          </button>
        </div>
      </div>

      {/* 광고 설정 목록 */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {adSettings.length > 0 ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {adSettings.map((ad) => (
              <div key={ad.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {ad.name}
                      </h3>
                      <button
                        onClick={() => toggleEnabled(ad.id, ad.enabled)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                          ad.enabled
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {ad.enabled ? (
                          <>
                            <CheckCircleIcon className="w-3 h-3 mr-1" />
                            활성
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="w-3 h-3 mr-1" />
                            비활성
                          </>
                        )}
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                      <span className="flex items-center">
                        <MegaphoneIcon className="w-4 h-4 mr-1" />
                        {positionOptions.find(p => p.value === ad.position)?.label}
                      </span>
                      <span className="flex items-center">
                        <Cog6ToothIcon className="w-4 h-4 mr-1" />
                        {ad.postTypes === 'all' ? '모든 포스트' : '특정 포스트'}
                      </span>
                      <span className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {formatDate(ad.updatedAt)}
                      </span>
                    </div>

                    {ad.displayRules && (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mb-3">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          <strong>표시 규칙:</strong> {ad.displayRules}
                        </p>
                      </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
                        {ad.adCode.length > 100 ? `${ad.adCode.substring(0, 100)}...` : ad.adCode}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(ad)}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors duration-200"
                      title="편집"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      title="삭제"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <MegaphoneIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              광고 설정이 없습니다.
            </p>
            <button
              onClick={openModal}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              첫 광고 설정 추가하기
            </button>
          </div>
        )}
      </div>

      {/* 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {editingAd ? '광고 설정 수정' : '새 광고 설정'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  광고 이름
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="예: 포스트 상단 광고"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  표시 위치
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value as AdSetting['position'] })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  {positionOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  광고 코드
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.adCode}
                  onChange={(e) => setFormData({ ...formData, adCode: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white font-mono text-sm"
                  placeholder="Google AdSense 코드를 여기에 붙여넣으세요..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  표시 규칙 (선택사항)
                </label>
                <textarea
                  rows={3}
                  value={formData.displayRules}
                  onChange={(e) => setFormData({ ...formData, displayRules: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="특정 조건에서만 표시하고 싶은 경우 규칙을 입력하세요..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enabled"
                  checked={formData.enabled}
                  onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="enabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  즉시 활성화
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingAd ? '수정' : '생성'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}