import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Pill, Clock, Calendar as CalendarIcon, StickyNote } from 'lucide-react';
import { patientAPI } from '../../services/api';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to parse structured prescription text
  const parsePrescription = (prescriptionText) => {
    if (!prescriptionText) return null;
    
    const parsed = {
      medicines: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: '',
      followUp: ''
    };
    
    const lines = prescriptionText.split('\n');
    let currentSection = '';
    
    lines.forEach(line => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('MEDICINES:')) {
        currentSection = 'medicines';
        parsed.medicines = trimmedLine.replace('MEDICINES:', '').trim();
      } else if (trimmedLine.startsWith('DOSAGE:')) {
        currentSection = 'dosage';
        parsed.dosage = trimmedLine.replace('DOSAGE:', '').trim();
      } else if (trimmedLine.startsWith('FREQUENCY:')) {
        currentSection = 'frequency';
        parsed.frequency = trimmedLine.replace('FREQUENCY:', '').trim();
      } else if (trimmedLine.startsWith('DURATION:')) {
        currentSection = 'duration';
        parsed.duration = trimmedLine.replace('DURATION:', '').trim();
      } else if (trimmedLine.startsWith('INSTRUCTIONS:')) {
        currentSection = 'instructions';
        parsed.instructions = trimmedLine.replace('INSTRUCTIONS:', '').trim();
      } else if (trimmedLine.startsWith('FOLLOW-UP:')) {
        currentSection = 'followUp';
        parsed.followUp = trimmedLine.replace('FOLLOW-UP:', '').trim();
      } else if (trimmedLine && currentSection) {
        // Continue multi-line content
        if (currentSection === 'medicines') {
          parsed.medicines += ' ' + trimmedLine;
        } else if (currentSection === 'instructions') {
          parsed.instructions += ' ' + trimmedLine;
        }
      }
    });
    
    return parsed;
  };

  // Check if prescription is in new structured format
  const isStructuredPrescription = (prescriptionText) => {
    return prescriptionText && (
      prescriptionText.includes('MEDICINES:') || 
      prescriptionText.includes('DOSAGE:') ||
      prescriptionText.includes('FREQUENCY:')
    );
  };

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
                  <h4 className="text-md font-medium text-gray-900 mb-4">Prescription Details</h4>
                  
                  {/* Check if prescription is in new structured format */}
                  {isStructuredPrescription(prescription.prescription) ? (
                    <div className="space-y-4">
                      {(() => {
                        const parsed = parsePrescription(prescription.prescription);
                        return (
                          <>
                            {/* Medicines */}
                            {parsed.medicines && (
                              <div className="flex items-start space-x-3">
                                <Pill className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Medicines:</p>
                                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{parsed.medicines}</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Dosage and Frequency */}
                            <div className="grid grid-cols-2 gap-4">
                              {parsed.dosage && (
                                <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-xs font-medium text-blue-600">D</span>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Dosage:</p>
                                    <p className="text-sm text-gray-600">{parsed.dosage}</p>
                                  </div>
                                </div>
                              )}
                              
                              {parsed.frequency && (
                                <div className="flex items-start space-x-3">
                                  <Clock className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-sm font-medium text-gray-700">Frequency:</p>
                                    <p className="text-sm text-gray-600">{parsed.frequency}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                            
                            {/* Duration */}
                            {parsed.duration && (
                              <div className="flex items-start space-x-3">
                                <CalendarIcon className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Duration:</p>
                                  <p className="text-sm text-gray-600">{parsed.duration}</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Instructions */}
                            {parsed.instructions && (
                              <div className="flex items-start space-x-3">
                                <StickyNote className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Instructions:</p>
                                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{parsed.instructions}</p>
                                </div>
                              </div>
                            )}
                            
                            {/* Follow-up */}
                            {parsed.followUp && (
                              <div className="flex items-start space-x-3">
                                <Calendar className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-sm font-medium text-gray-700">Follow-up:</p>
                                  <p className="text-sm text-gray-600">{parsed.followUp}</p>
                                </div>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  ) : (
                    /* Old format display */
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
                  )}
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
