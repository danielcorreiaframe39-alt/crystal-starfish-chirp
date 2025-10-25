import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getQuizzes, getTraits, addQuiz } from '@/lib/api';
import { Quiz, Trait } from '@/types/supabase';
import QuizForm from '@/components/QuizForm';
import QuizzesList from '@/components/QuizzesList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';

const QuizzesPage = () => {
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [traits, setTraits] = useState<Trait[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchQuizzesAndTraits();
    }
  }, [user]);

  const fetchQuizzesAndTraits = async () => {
    setIsLoading(true);
    try {
      const [quizzesData, traitsData] = await Promise.all([
        getQuizzes(),
        getTraits(),
      ]);
      setQuizzes(quizzesData || []);
      setTraits(traitsData || []);
    } catch (error) {
      showError('Failed to fetch data.');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddQuiz = async (
    name: string,
    description: string,
    selectedTraitIds: string[]
  ) => {
    if (!user) return;
    const toastId = showLoading('Creating quiz...');
    try {
      const newQuiz = await addQuiz({ name, description, created_by: user.id }, selectedTraitIds);
      if (newQuiz) {
        setQuizzes([newQuiz, ...quizzes]);
        showSuccess('Quiz created successfully!');
      }
    } catch (error) {
      showError('Failed to create quiz.');
      console.error('Error creating quiz:', error);
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Quizzes</h1>
      <div className="mb-6">
        <QuizForm traits={traits} onSubmit={handleAddQuiz} />
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <QuizzesList quizzes={quizzes} />
      )}
    </div>
  );
};

export default QuizzesPage;