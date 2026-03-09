// Test frontend time formatting logic
function formatTime(time) {
  if (!time || time === 'Not specified' || !time.includes(':')) {
    return time;
  }
  
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

function formatDate(appointment) {
  if (appointment.appointment_date) {
    const date = new Date(appointment.appointment_date);
    const time = appointment.appointment_time || appointment.time || 'Not specified';
    
    // Convert time to 12-hour format
    let formattedTime = time;
    if (time && time !== 'Not specified' && time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      formattedTime = `${displayHour}:${minutes} ${ampm}`;
    }
    
    return `${date.toLocaleDateString()} at ${formattedTime}`;
  } else if (appointment.date) {
    // Fallback for different field names
    const date = new Date(appointment.date);
    const time = appointment.time || 'Not specified';
    
    // Convert time to 12-hour format
    let formattedTime = time;
    if (time && time !== 'Not specified' && time.includes(':')) {
      const [hours, minutes] = time.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      formattedTime = `${displayHour}:${minutes} ${ampm}`;
    }
    
    return `${date.toLocaleDateString()} at ${formattedTime}`;
  } else {
    return 'Date not available';
  }
}

console.log('🧪 Testing Frontend Time Format (hh:mm AM/PM)...\n');

// Test with sample appointments
const sampleAppointments = [
  {
    appointment_date: '2026-03-09T18:30:00.000Z',
    appointment_time: '00:17:00',
    date: undefined,
    time: undefined
  },
  {
    appointment_date: '2026-03-06T18:30:00.000Z',
    appointment_time: '14:11:00',
    date: undefined,
    time: undefined
  },
  {
    appointment_date: '2026-03-09T09:30:00.000Z',
    appointment_time: '09:30:00',
    date: undefined,
    time: undefined
  },
  {
    appointment_date: '2026-03-09T23:45:00.000Z',
    appointment_time: '23:45:00',
    date: undefined,
    time: undefined
  },
  {
    appointment_date: '2026-03-09T12:00:00.000Z',
    appointment_time: '12:00:00',
    date: undefined,
    time: undefined
  }
];

console.log('📊 Frontend Format Results:');
sampleAppointments.forEach((apt, index) => {
  console.log(`\nAppointment ${index + 1}:`);
  console.log(`  - Original time: ${apt.appointment_time}`);
  console.log(`  - Frontend formatted: ${formatDate(apt)}`);
});

console.log('\n🕐 Time Conversion Examples:');
const testTimes = ['00:17:00', '14:11:00', '09:30:00', '23:45:00', '12:00:00'];
testTimes.forEach(time => {
  const formatted = formatTime(time);
  console.log(`    ${time} → ${formatted}`);
});

console.log('\n🎉 Frontend time format test completed!');
