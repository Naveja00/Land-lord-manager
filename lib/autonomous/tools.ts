export async function checkCalendar(_message: string) {
  return 'Late checkout is available until 1:00 PM for tomorrow.';
}

export async function sendSms(alert: string) {
  return `SMS sent to cleaning crew: ${alert}`;
}

export async function googleMaps(zipCode: string) {
  return [
    `Neighborhood Kitchen (near ${zipCode})`,
    `Corner Bistro (${zipCode})`,
    `Riverside Cafe (${zipCode})`
  ];
}
