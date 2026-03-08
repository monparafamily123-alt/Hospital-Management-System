import React, { useState, useEffect } from 'react';
import { FileText, Calendar, User, Search, Filter, Plus, Eye, Download } from 'lucide-react';
import { doctorAPI } from '../../services/api';
import { jsPDF } from 'jspdf';

const Prescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Helper function to parse prescription text into table format
  const parsePrescriptionText = (prescriptionText) => {
    if (!prescriptionText) return [];
    
    const medicines = [];
    const lines = prescriptionText.split('\n');
    
    lines.forEach(line => {
      // Match pattern like "1. Paracetamol 500mg - 1 tablet - 3 times a day - 5 days - Take after food"
      const match = line.match(/^\d+\.\s*(.+?)\s*-\s*(.+?)\s*-\s*(.+?)\s*-\s*(.+?)\s*-\s*(.+)$/);
      if (match) {
        medicines.push({
          name: match[1].trim(),
          dosage: match[2].trim(),
          frequency: match[3].trim(),
          duration: match[4].trim(),
          instructions: match[5].trim()
        });
      }
    });
    
    return medicines;
  };

  // Helper function to extract follow-up instructions
  const extractFollowUp = (prescriptionText) => {
    if (!prescriptionText) return '';
    
    const match = prescriptionText.match(/FOLLOW-UP:\s*(.+)$/);
    return match ? match[1].trim() : '';
  };

  // Function to download prescription as PDF
  const downloadPrescriptionPDF = (prescription) => {
    try {
      console.log('📥 Downloading prescription PDF:', prescription);
      
      // Create new PDF document
      const pdf = new jsPDF();
      
      // Set font
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      
      // Add header
      pdf.text('MEDICAL PRESCRIPTION', 105, 20, { align: 'center' });
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('Hospital Management System', 105, 28, { align: 'center' });
      
      // Add line
      pdf.setLineWidth(0.5);
      pdf.line(20, 35, 190, 35);
      
      // Patient Information Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PATIENT INFORMATION', 20, 50);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      let yPos = 60;
      pdf.text(`Name: ${prescription.patient_name || 'Unknown Patient'}`, 20, yPos);
      yPos += 8;
      pdf.text(`Date: ${prescription.date || new Date().toLocaleDateString()}`, 20, yPos);
      yPos += 8;
      pdf.text(`Time: ${prescription.time || '10:00 AM'}`, 20, yPos);
      yPos += 8;
      pdf.text('Doctor: Dr. Sahil Kumar', 20, yPos);
      yPos += 8;
      pdf.text('Department: General Medicine', 20, yPos);
      
      // Add line
      yPos += 10;
      pdf.line(20, yPos, 190, yPos);
      yPos += 10;
      
      // Symptoms Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SYMPTOMS / REASON FOR VISIT', 20, yPos);
      yPos += 10;
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const symptoms = prescription.reason || 'General consultation';
      const splitSymptoms = pdf.splitTextToSize(symptoms, 170);
      pdf.text(splitSymptoms, 20, yPos);
      yPos += splitSymptoms.length * 5 + 10;
      
      // Add line
      pdf.line(20, yPos, 190, yPos);
      yPos += 10;
      
      // Prescription Details Section
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('PRESCRIPTION DETAILS', 20, yPos);
      yPos += 10;
      
      // Parse medicines and create table
      const medicines = parsePrescriptionText(prescription.prescription);
      
      if (medicines.length > 0) {
        // Table headers
        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'bold');
        pdf.text('S.No.', 20, yPos);
        pdf.text('Medicine Name', 35, yPos);
        pdf.text('Dosage', 85, yPos);
        pdf.text('Frequency', 110, yPos);
        pdf.text('Duration', 140, yPos);
        pdf.text('Instructions', 165, yPos);
        
        yPos += 8;
        pdf.line(20, yPos, 190, yPos);
        yPos += 5;
        
        // Table data
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        
        medicines.forEach((medicine, index) => {
          if (yPos > 250) {
            pdf.addPage();
            yPos = 20;
          }
          
          pdf.text(`${index + 1}`, 20, yPos);
          pdf.text(medicine.name, 35, yPos);
          pdf.text(medicine.dosage, 85, yPos);
          pdf.text(medicine.frequency, 110, yPos);
          pdf.text(medicine.duration, 140, yPos);
          pdf.text(medicine.instructions, 165, yPos);
          yPos += 7;
        });
      } else {
        // Display as text if no parsed medicines
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        const prescriptionText = prescription.prescription || 'No prescription details available';
        const splitText = pdf.splitTextToSize(prescriptionText, 170);
        pdf.text(splitText, 20, yPos);
        yPos += splitText.length * 5;
      }
      
      yPos += 10;
      
      // Follow-up Section
      const followUp = extractFollowUp(prescription.prescription);
      if (followUp) {
        pdf.line(20, yPos, 190, yPos);
        yPos += 10;
        pdf.setFontSize(12);
        pdf.setFont('helvetica', 'bold');
        pdf.text('FOLLOW-UP INSTRUCTIONS', 20, yPos);
        yPos += 10;
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        pdf.text(followUp, 20, yPos);
        yPos += 10;
      }
      
      // Footer
      if (yPos > 240) {
        pdf.addPage();
        yPos = 20;
      }
      
      yPos += 20;
      pdf.line(20, yPos, 190, yPos);
      yPos += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Prescription ID: #${prescription.id}`, 20, yPos);
      pdf.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPos + 6);
      
      // Signature
      pdf.text('Dr. Sahil Kumar', 150, yPos);
      pdf.text('Signature', 150, yPos + 6);
      pdf.line(150, yPos + 12, 190, yPos + 12);
      
      // Save the PDF
      const patientName = (prescription.patient_name || 'Patient').replace(/\s+/g, '_');
      const date = prescription.date || new Date().toISOString().split('T')[0];
      pdf.save(`Prescription_${patientName}_${date}.pdf`);
      
      console.log('✅ Prescription PDF downloaded successfully');
      return true;
    } catch (error) {
      console.error('❌ Error downloading prescription PDF:', error);
      alert('Error downloading prescription PDF. Please try again.');
      return false;
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      console.log('📋 Fetching prescriptions...');
      const response = await doctorAPI.getPrescriptions();
      console.log('✅ Prescriptions response:', response);
      setPrescriptions(response.data || []);
    } catch (error) {
      console.error('❌ Error fetching prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPrescriptions = prescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patient_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.symptoms?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.prescription?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || prescription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <h1 className="text-3xl font-bold text-gray-900">Prescriptions</h1>
        <p className="text-gray-600 mt-2">Manage and view patient prescriptions</p>
      </div>

      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 flex items-center">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              className="input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Filter className="h-5 w-5 text-gray-400 mr-3" />
            <select
              className="input-field"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Symptoms
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Prescription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPrescriptions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p className="text-lg font-medium">No prescriptions found</p>
                      <p className="text-sm">Prescriptions will appear here when you complete appointments</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredPrescriptions.map((prescription) => (
                  <tr key={prescription.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {formatDate(prescription.appointment_date)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-5 w-5 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{prescription.patient_name}</div>
                          <div className="text-xs text-gray-500">{prescription.patient_email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {prescription.symptoms || 'No symptoms recorded'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {prescription.prescription || 'No prescription written'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewPrescription(prescription)}
                          className="text-primary-600 hover:text-primary-900"
                          title="View Prescription"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900"
                          title="Download Prescription"
                          onClick={() => downloadPrescriptionPDF(prescription)}
                        >
                          <Download className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prescription Modal - Invoice Style */}
      {showModal && selectedPrescription && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-6 border w-full max-w-4xl shadow-xl rounded-md bg-white">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 border-b pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">MEDICAL PRESCRIPTION</h2>
                <p className="text-sm text-gray-600">Hospital Management System</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            {/* Patient and Doctor Info */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">PATIENT DETAILS</h3>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">Name:</span> {selectedPrescription.patient_name}</p>
                  <p className="text-sm"><span className="font-medium">Date:</span> {selectedPrescription.date || '2026-03-08'}</p>
                  <p className="text-sm"><span className="font-medium">Time:</span> {selectedPrescription.time || '10:00 AM'}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">DOCTOR DETAILS</h3>
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">Name:</span> Dr. Sahil Kumar</p>
                  <p className="text-sm"><span className="font-medium">Specialization:</span> General Medicine</p>
                  <p className="text-sm"><span className="font-medium">License:</span> MD-12345</p>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">SYMPTOMS / REASON FOR VISIT</h3>
              <div className="bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                <p className="text-gray-800">{selectedPrescription.reason || 'General consultation'}</p>
              </div>
            </div>

            {/* Prescription Table */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">PRESCRIPTION DETAILS</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">S.No.</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Medicine Name</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Dosage</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Frequency</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Duration</th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">Instructions</th>
                  </tr>
                </thead>
                <tbody>
                  {parsePrescriptionText(selectedPrescription.prescription).map((medicine, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm">{index + 1}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-medium">{medicine.name}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{medicine.dosage}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{medicine.frequency}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{medicine.duration}</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">{medicine.instructions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Follow-up */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">FOLLOW-UP INSTRUCTIONS</h3>
              <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                <p className="text-gray-800">{extractFollowUp(selectedPrescription.prescription) || 'No follow-up required'}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Prescription ID: #{selectedPrescription.id}</p>
                  <p className="text-sm text-gray-600">Generated on: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Dr. Sahil Kumar</p>
                  <p className="text-xs text-gray-600">Signature</p>
                  <div className="mt-2 border-t-2 border-gray-800 w-32"></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6 border-t pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
              <button 
                className="btn btn-primary flex items-center"
                onClick={() => downloadPrescriptionPDF(selectedPrescription)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prescriptions;
