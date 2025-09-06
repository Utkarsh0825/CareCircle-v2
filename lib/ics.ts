export interface IcsEvent {
  title: string
  start: Date
  end: Date
  description?: string
  location?: string
}

export function makeIcs(event: IcsEvent): string {
  const formatDate = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  }

  const escapeText = (text: string): string => {
    return text
      .replace(/[\\;,]/g, '\\$&')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
  }

  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//CareCircle//Task Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${Date.now()}@carecircle.local`,
    `DTSTAMP:${formatDate(new Date())}`,
    `DTSTART:${formatDate(event.start)}`,
    `DTEND:${formatDate(event.end)}`,
    `SUMMARY:${escapeText(event.title)}`,
    ...(event.description ? [`DESCRIPTION:${escapeText(event.description)}`] : []),
    ...(event.location ? [`LOCATION:${escapeText(event.location)}`] : []),
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n')

  return ics
}

export function downloadIcs(icsContent: string, filename: string = 'event.ics'): void {
  try {
    // Use a safer download approach without DOM manipulation
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    
    // Use window.open as a fallback to avoid DOM manipulation
    const newWindow = window.open(url, '_blank')
    if (newWindow) {
      newWindow.document.title = filename
      setTimeout(() => {
        newWindow.close()
        URL.revokeObjectURL(url)
      }, 1000)
    } else {
      // If popup blocked, just copy to clipboard
      navigator.clipboard?.writeText(icsContent).then(() => {
        alert('ICS content copied to clipboard. Please save it as a .ics file.')
      }).catch(() => {
        console.warn('Could not copy to clipboard')
      })
      URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('Failed to download ICS file:', error)
    // Fallback: just alert the user
    alert('Download failed. Please try again.')
  }
}

