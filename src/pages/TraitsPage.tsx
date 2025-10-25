import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getTraits, addTrait, deleteTrait } from '@/lib/api';
import { Trait } from '@/types/supabase';
import TraitForm from '@/components/TraitForm';
import TraitsList from '@/components/TraitsList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';

const TraitsPage = () => {
  const { user } = useAuth();
  const [traits, setTraits] = useState<Trait[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTraits();
    }
  }, [user]);

  const fetchTraits = async () => {
    setIsLoading(true);
    try {
      const data = await getTraits();
      setTraits(data || []);
    } catch (error) {
      showError('Failed to fetch traits.');
      console.error('Error fetching traits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTrait = async (name: string, description: string) => {
    if (!user) return;
    const toastId = showLoading('Adding trait...');
    try {
      const newTrait = await addTrait({ name, description, created_by: user.id });
      if (newTrait) {
        setTraits([newTrait, ...traits]);
        showSuccess('Trait added successfully!');
      }
    } catch (error) {
      showError('Failed to add trait.');
      console.error('Error adding trait:', error);
    } finally {
      dismissToast(toastId);
    }
  };

  const handleDeleteTrait = async (id: string) => {
    const toastId = showLoading('Deleting trait...');
    try {
      await deleteTrait(id);
      setTraits(traits.filter((trait) => trait.id !== id));
      showSuccess('Trait deleted successfully!');
    } catch (error) {
      showError('Failed to delete trait.');
      console.error('Error deleting trait:', error);
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Traits</h1>
      <div className="mb-6">
        <TraitForm onSubmit={handleAddTrait} />
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <TraitsList traits={traits} onDelete={handleDeleteTrait} />
      )}
    </div>
  );
};

export default TraitsPage;