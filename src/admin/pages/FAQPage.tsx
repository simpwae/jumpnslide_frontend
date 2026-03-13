import React, { useState } from 'react';
import {
  PlusIcon,
  EditIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon } from
'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { FAQS } from '../../data';
import { useLanguage } from '../context/LanguageContext';
export function FAQPage() {
  const { t, isRTL } = useLanguage();
  const [faqs, setFaqs] = useState(FAQS);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  // Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this FAQ?')) {
      setFaqs((prev) => prev.filter((item) => item.id !== id));
    }
  };
  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;
    const newFaq = {
      id: `new-${Date.now()}`,
      question: newQuestion,
      answer: newAnswer
    };
    setFaqs([newFaq, ...faqs]);
    setNewQuestion('');
    setNewAnswer('');
    setShowAddForm(false);
  };
  const startEdit = (faq: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(faq.id);
    setEditQuestion(faq.question);
    setEditAnswer(faq.answer);
    // Ensure it's expanded when editing
    setExpanded((prev) => ({
      ...prev,
      [faq.id]: true
    }));
  };
  const handleSaveEdit = (id: string) => {
    if (!editQuestion.trim() || !editAnswer.trim()) return;
    setFaqs((prev) =>
    prev.map((f) =>
    f.id === id ?
    {
      ...f,
      question: editQuestion,
      answer: editAnswer
    } :
    f
    )
    );
    setEditingId(null);
  };
  const handleCancelEdit = () => {
    setEditingId(null);
  };
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-slate-100">
            {t('faq.title')}
          </h2>
          <p className="text-sm text-slate-400 mt-1">{t('faq.desc')}</p>
        </div>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <PlusIcon className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
          {t('faq.add')}
        </Button>
      </div>

      {showAddForm &&
      <Card className="border-brand-blue/50 shadow-lg shadow-brand-blue/10">
          <CardContent className="p-6">
            <form onSubmit={handleAddFaq} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  {t('faq.question')}
                </label>
                <input
                type="text"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required />
              
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  {t('faq.answer')}
                </label>
                <textarea
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                required />
              
              </div>
              <div
              className={`flex justify-end space-x-3 ${isRTL ? 'space-x-reverse' : ''} pt-2`}>
              
                <Button
                type="button"
                variant="ghost"
                onClick={() => setShowAddForm(false)}>
                
                  {t('common.cancel')}
                </Button>
                <Button type="submit">{t('common.save')}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      }

      {faqs.length === 0 ?
      <Card>
          <CardContent className="p-8 text-center text-slate-400">
            {t('faq.empty')}
          </CardContent>
        </Card> :

      <div className="space-y-4">
          {faqs.map((faq) =>
        <Card
          key={faq.id}
          className="overflow-hidden transition-all duration-200 hover:border-slate-700">
          
              {editingId === faq.id ?
          <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      {t('faq.question')}
                    </label>
                    <input
                type="text"
                value={editQuestion}
                onChange={(e) => setEditQuestion(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue"
                required />
              
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      {t('faq.answer')}
                    </label>
                    <textarea
                value={editAnswer}
                onChange={(e) => setEditAnswer(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-blue resize-none"
                required />
              
                  </div>
                  <div
              className={`flex justify-end space-x-3 ${isRTL ? 'space-x-reverse' : ''} pt-2`}>
              
                    <Button
                type="button"
                variant="ghost"
                onClick={handleCancelEdit}>
                
                      {t('common.cancel')}
                    </Button>
                    <Button onClick={() => handleSaveEdit(faq.id)}>
                      {t('common.save')}
                    </Button>
                  </div>
                </div> :

          <div className="p-1">
                  <div
              className="flex items-center justify-between p-4 cursor-pointer select-none"
              onClick={() => toggleExpand(faq.id)}>
              
                    <h3 className="font-medium text-slate-200 pr-4">
                      {faq.question}
                    </h3>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <div
                  className="flex items-center space-x-1 rtl:space-x-reverse mr-4 rtl:mr-0 rtl:ml-4"
                  onClick={(e) => e.stopPropagation()}>
                  
                        <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={(e) => startEdit(faq, e)}>
                    
                          <EditIcon className="w-4 h-4 text-slate-400 hover:text-slate-200" />
                        </Button>
                        <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-rose-400/10"
                    onClick={() => handleDelete(faq.id)}>
                    
                          <TrashIcon className="w-4 h-4 text-rose-400" />
                        </Button>
                      </div>
                      {expanded[faq.id] ?
                <ChevronUpIcon className="w-5 h-5 text-slate-500" /> :

                <ChevronDownIcon className="w-5 h-5 text-slate-500" />
                }
                    </div>
                  </div>

                  {expanded[faq.id] &&
            <div className="px-4 pb-5 pt-1 text-slate-400 border-t border-slate-800/50 mt-1">
                      <p className="leading-relaxed">{faq.answer}</p>
                    </div>
            }
                </div>
          }
            </Card>
        )}
        </div>
      }
    </div>);

}