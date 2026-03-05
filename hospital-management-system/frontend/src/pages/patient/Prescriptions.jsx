import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User } from 'lucide-react';
import { patientAPI } from '../../services/api';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await patientAPI.getPrescriptions();
      setPrescriptions(response.data);
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Prescriptions</h1>
        <p className="text-gray-600 mt-2">View your medical prescriptions</p>
      </div>

      <div className="card">
        <div className="space-y-4">
          {prescriptions.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No prescriptions found</p>
              <p className="text-sm text-gray-400">Your doctor will add prescriptions here after your appointments</p>
            </div>
          ) : (
            prescriptions.map((prescription) => (
              <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 text-gray-600 mr-2" />
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{prescription.doctor_name}</h3>
                        <p className="text-sm text-gray-500">{prescription.doctor_department}</p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(prescription.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Prescription Details</h4>
                  <div className="space-y-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Diagnosis:</p>
                      <p className="text-sm text-gray-600">{prescription.diagnosis || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Medication:</p>
                      <p className="text-sm text-gray-600">{prescription.medication || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Dosage:</p>
                      <p className="text-sm text-gray-600">{prescription.dosage || 'Not specified'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Notes:</p>
                      <p className="text-sm text-gray-600">{prescription.notes || 'No additional notes'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
