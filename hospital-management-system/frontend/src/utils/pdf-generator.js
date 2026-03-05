// PDF Generator for Prescriptions
export const generatePrescriptionPDF = (prescription) => {
  try {
    console.log('📥 Generating prescription PDF:', prescription);
    
    // Create a formatted prescription content
    const prescriptionContent = `
╔══════════════════════════════════════════════════════════════════════════════╗
║                              HOSPITAL PRESCRIPTION                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  PATIENT INFORMATION                                                           ║
║  ─────────────────                                                             ║
║  Name: ${prescription.patient_name?.padEnd(65)} ║
║  Date: ${new Date(prescription.appointment_date).toLocaleDateString().padEnd(63)} ║
║  Doctor: ${prescription.doctor_name?.padEnd(62)} ║
║  Department: ${(prescription.doctor_department || 'General').padEnd(57)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  PRESCRIPTION DETAILS                                                          ║
║  ─────────────────                                                             ║
║                                                                              ║
${prescription.prescription?.split('\n').map(line => `║  ${line.padEnd(74)} ║`).join('\n') || '║  No prescription details available'.padEnd(77) + ' ║'}
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  DOCTOR'S SIGNATURE                                                           ║
║  ─────────────────                                                             ║
║                                                                              ║
║  _______________________                                                       ║
║  ${prescription.doctor_name?.padEnd(65)} ║
║                                                                              ║
╠══════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  Generated on: ${new Date().toLocaleString().padEnd(58)} ║
║  Hospital Management System                                                   ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
    `.trim();

    return prescriptionContent;
  } catch (error) {
    console.error('❌ Error generating PDF content:', error);
    return 'Error generating prescription';
  }
};

// Enhanced PDF download with better formatting
export const downloadPrescriptionAsText = (prescription) => {
  try {
    const content = generatePrescriptionPDF(prescription);
    
    // Create blob with proper encoding
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    
    // Create download link
    const a = document.createElement('a');
    a.href = url;
    a.download = `Prescription_${prescription.patient_name}_${new Date(prescription.appointment_date).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Cleanup
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    console.log('✅ Prescription downloaded successfully');
    return true;
  } catch (error) {
    console.error('❌ Error downloading prescription:', error);
    return false;
  }
};

// Simple text-based download (fallback)
export const downloadSimplePrescription = (prescription) => {
  try {
    const content = `
HOSPITAL PRESCRIPTION
====================

Patient Name: ${prescription.patient_name}
Date: ${new Date(prescription.appointment_date).toLocaleDateString()}
Doctor: ${prescription.doctor_name}
Department: ${prescription.doctor_department || 'General'}

PRESCRIPTION:
${prescription.prescription || 'No prescription details available'}

====================
Generated on: ${new Date().toLocaleString()}
Hospital Management System
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription_${prescription.patient_name}_${new Date(prescription.appointment_date).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    console.log('✅ Simple prescription downloaded');
    return true;
  } catch (error) {
    console.error('❌ Error downloading simple prescription:', error);
    return false;
  }
};

// Add to window for easy testing
if (typeof window !== 'undefined') {
  window.generatePrescriptionPDF = generatePrescriptionPDF;
  window.downloadPrescriptionAsText = downloadPrescriptionAsText;
  window.downloadSimplePrescription = downloadSimplePrescription;
  
  console.log('🔧 PDF generation functions available:');
  console.log('  - generatePrescriptionPDF(prescription) - Generate formatted content');
  console.log('  - downloadPrescriptionAsText(prescription) - Download as text file');
  console.log('  - downloadSimplePrescription(prescription) - Simple text download');
}
