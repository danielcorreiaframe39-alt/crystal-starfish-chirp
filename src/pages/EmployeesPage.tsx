import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getEmployees, addEmployee } from '@/lib/api';
import { Employee } from '@/types/supabase';
import EmployeeForm from '@/components/EmployeeForm';
import EmployeesList from '@/components/EmployeesList';
import LoadingSpinner from '@/components/LoadingSpinner';
import { showError, showSuccess, showLoading, dismissToast } from '@/utils/toast';

const EmployeesPage = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [user]);

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data || []);
    } catch (error) {
      showError('Failed to fetch employees.');
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmployee = async (name: string, email: string) => {
    if (!user) return;
    const toastId = showLoading('Adding employee...');
    try {
      const newEmployee = await addEmployee({ name, email, company_id: user.id });
      if (newEmployee) {
        setEmployees([newEmployee, ...employees]);
        showSuccess('Employee added successfully!');
      }
    } catch (error) {
      showError('Failed to add employee.');
      console.error('Error adding employee:', error);
    } finally {
      dismissToast(toastId);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Employees</h1>
      <div className="mb-6">
        <EmployeeForm onSubmit={handleAddEmployee} />
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <EmployeesList employees={employees} />
      )}
    </div>
  );
};

export default EmployeesPage;