import moment from 'moment-timezone';

const timeZoneAbbreviations: Record<string, string> = {
  'America/New_York': 'EST',
  'America/Chicago': 'CST',
  'America/Denver': 'MST',
  'America/Los_Angeles': 'PST',
  // Add more timezones as needed
};

// Enhanced formatter with timezone abbreviation
export const formatDateTimeWithMoment = (
  dateString: string | Date,
  fieldName: string = '',
  timeZone: string = 'America/New_York'
): string => {
  if (!dateString) return '';
  
  const m = moment(dateString);
  if (!m.isValid()) return 'Invalid Date';

  // Check if field name contains 'dob' (case insensitive)
  const isDobField = fieldName.toLowerCase().includes('dob');

  if (isDobField) {
    // Format for date of birth (date only)
    return m.format('MM-DD-YYYY');
  } else {
    // Format for other date fields (with time and timezone)
    const zoneAbbr = timeZoneAbbreviations[timeZone] || 
                     moment.tz.zone(timeZone)?.abbr(m.valueOf()) || 
                     timeZone.split('/').pop()?.substring(0, 3) || 
                     'UTC';
    
    return m.tz(timeZone).format('MM-DD-YYYY hh:mm A [') + zoneAbbr + ']';
  }
};
  
