import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  ArrowLeft, 
  Edit3, 
  Check, 
  X, 
  Users,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface AnswerGroup {
  id: string;
  answer: string;
  studentCount: number;
  priority: 'handwriting' | 'review' | 'ready';
  students: string[];
  score: number;
  maxScore: number;
  comments: string[];
  needsAttention?: boolean;
}

interface GradingInterfaceProps {
  group: AnswerGroup;
  onBack: () => void;
  onUpdateGroup: (updates: Partial<AnswerGroup>) => void;
}

export function GradingInterface({ group, onBack, onUpdateGroup }: GradingInterfaceProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedScore, setEditedScore] = useState(group.score.toString());
  const [editedComment, setEditedComment] = useState(group.comments[0] || '');
  const [showHandwritingDialog, setShowHandwritingDialog] = useState(group.priority === 'handwriting');
  const [showApplyDialog, setShowApplyDialog] = useState(false);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    const updates: Partial<AnswerGroup> = {
      score: parseInt(editedScore),
      comments: [editedComment],
      priority: 'ready',
      needsAttention: false
    };
    
    onUpdateGroup(updates);
    setIsEditing(false);
    setShowApplyDialog(true);
  };

  const handleCancel = () => {
    setEditedScore(group.score.toString());
    setEditedComment(group.comments[0] || '');
    setIsEditing(false);
  };

  const handleHandwritingConfirmation = (value: string) => {
    // Simulate the AI recalculating based on the corrected handwriting
    const updates: Partial<AnswerGroup> = {
      score: value === '9' ? 8 : 5,
      comments: [value === '9' ? 'Đúng! Tính toán chính xác.' : 'Sai số tại bước này.'],
      priority: 'ready',
      needsAttention: false
    };
    
    onUpdateGroup(updates);
    setShowHandwritingDialog(false);
  };

  const handleApplyToAll = (applyToAll: boolean) => {
    // In a real app, this would update all students in the group
    setShowApplyDialog(false);
    
    if (applyToAll) {
      // Simulate applying to all students
      console.log(`Applied correction to all ${group.studentCount} students`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Quay lại Dashboard</span>
            </Button>
            
            <div>
              <h1 className="text-2xl text-gray-900">Chấm chi tiết</h1>
              <p className="text-gray-600">{group.studentCount} học sinh</p>
            </div>
          </div>
          
          <Badge className={`${
            group.priority === 'handwriting' 
              ? 'bg-orange-100 text-orange-800 border-orange-300' 
              : group.priority === 'review' 
                ? 'bg-yellow-100 text-yellow-800 border-yellow-300' 
                : 'bg-green-100 text-green-800 border-green-300'
          } border`}>
            <Users className="mr-1 h-3 w-3" />
            {group.studentCount} học sinh
          </Badge>
        </div>

        {/* Student Paper Simulation */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Bài làm đại diện: {group.students[0]}</h3>
              <Badge variant="outline">Bài số 1/{group.studentCount}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Simulated Paper */}
            <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">Câu hỏi: Tính đạo hàm của f(x) = x² + 2x + 1</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    Bước 1
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">f'(x) = d/dx(x²) + d/dx(2x) + d/dx(1)</p>
                    <div className="text-green-600 text-sm mt-1 flex items-center">
                      <Check className="h-4 w-4 mr-1" />
                      Đúng công thức đạo hàm
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    Bước 2
                  </div>
                  <div className="flex-1">
                    <div className="relative">
                      <p className="text-gray-900">f'(x) = 2x + 2 + 0</p>
                      {group.priority === 'handwriting' && (
                        <div className="absolute -top-1 -right-1">
                          <div className="bg-orange-500 rounded-full p-1 animate-pulse cursor-pointer"
                               onClick={() => setShowHandwritingDialog(true)}>
                            <HelpCircle className="h-4 w-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    {group.priority !== 'handwriting' && (
                      <div className="text-green-600 text-sm mt-1 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Tính toán chính xác
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    Kết quả
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">f'(x) = 2x + 2</p>
                    {group.priority !== 'handwriting' && (
                      <div className="text-green-600 text-sm mt-1 flex items-center">
                        <Check className="h-4 w-4 mr-1" />
                        Đáp án chính xác
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Grading Section */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-blue-900">Đánh giá của AI</h4>
                  {!isEditing && group.priority !== 'handwriting' && (
                    <Button variant="outline" size="sm" onClick={handleEdit}>
                      <Edit3 className="h-4 w-4 mr-1" />
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="score">Điểm số</Label>
                        <Input
                          id="score"
                          type="number"
                          min="0"
                          max={group.maxScore}
                          value={editedScore}
                          onChange={(e) => setEditedScore(e.target.value)}
                        />
                        <p className="text-sm text-gray-600 mt-1">Tối đa: {group.maxScore} điểm</p>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="comment">Nhận xét</Label>
                      <Textarea
                        id="comment"
                        value={editedComment}
                        onChange={(e) => setEditedComment(e.target.value)}
                        placeholder="Nhập nhận xét cho bài làm này..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button onClick={handleSave}>
                        <Check className="h-4 w-4 mr-1" />
                        Lưu
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        <X className="h-4 w-4 mr-1" />
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-blue-700">Điểm số:</span>
                      <span className="font-medium text-blue-900">
                        {group.score}/{group.maxScore}
                      </span>
                    </div>
                    
                    <div>
                      <p className="text-sm text-blue-700 mb-1">Nhận xét:</p>
                      <p className="text-blue-900">{group.comments[0]}</p>
                    </div>
                    
                    {group.priority === 'review' && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3 flex items-start space-x-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <p className="text-sm text-yellow-800">
                          AI không chắc chắn về đánh giá này. Vui lòng kiểm tra và chỉnh sửa nếu cần.
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Student List */}
            <Card>
              <CardHeader>
                <h4 className="font-medium">Học sinh trong nhóm này ({group.studentCount})</h4>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {group.students.map((student, index) => (
                    <Badge key={index} variant="outline" className="justify-center">
                      {student}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* Handwriting Confirmation Dialog */}
        <Dialog open={showHandwritingDialog} onOpenChange={setShowHandwritingDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận chữ viết tay</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                AI khó đọc số này trong bài làm. Bạn có thể xác nhận giúp?
              </p>
              
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="text-lg font-mono border-2 border-dashed border-gray-300 p-2 rounded inline-block">
                  2x + ?
                </p>
                <p className="text-sm text-gray-600 mt-2">Số được khoanh tròn trong bài làm</p>
              </div>
              
              <p className="text-center font-medium">Đây là số 4 hay số 9?</p>
              
              <div className="flex space-x-4 justify-center">
                <Button 
                  onClick={() => handleHandwritingConfirmation('4')}
                  className="text-2xl font-mono px-8 py-4"
                >
                  4
                </Button>
                <Button 
                  onClick={() => handleHandwritingConfirmation('9')}
                  className="text-2xl font-mono px-8 py-4"
                >
                  9
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Apply to All Dialog */}
        <Dialog open={showApplyDialog} onOpenChange={setShowApplyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Áp dụng cho tất cả?</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Đáp án này có trong nhóm với {group.studentCount} học sinh. 
                Bạn có muốn áp dụng chỉnh sửa này cho tất cả {group.studentCount} bài không?
              </p>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={() => handleApplyToAll(true)}
                  className="flex-1"
                >
                  Áp dụng cho tất cả
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => handleApplyToAll(false)}
                  className="flex-1"
                >
                  Chỉ bài này
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}