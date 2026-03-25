import { google } from 'googleapis';
import User from '@/models/User';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXTAUTH_URL
);

/**
 * Ensures the OAuth client has valid credentials for the given user.
 * Returns true if successful, false if the user doesn't have Google Calendar connected.
 */
async function setCredentials(userId) {
  const user = await User.findById(userId);
  if (!user || !user.googleRefreshToken) {
    return false;
  }

  oauth2Client.setCredentials({
    refresh_token: user.googleRefreshToken,
    access_token: user.googleAccessToken, // might be expired, OAuth2 client handles refresh
  });

  // Attach a listener to save the new access token when it's refreshed
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      user.googleAccessToken = tokens.access_token;
      if (tokens.refresh_token) {
        user.googleRefreshToken = tokens.refresh_token;
      }
      await user.save();
    }
  });

  return true;
}

export async function addEventToCalendar(userId, task) {
  if (!task.dueDate) return null;
  
  const hasCreds = await setCredentials(userId);
  if (!hasCreds) return null;

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // Assume task.dueDate is an ISO string or Date object
  // If we only have a date (no time), we can create an all-day event
  // Let's assume due dates are just dates for now in this app, or specific times if set.
  // For simplicity, we'll create a 1-hour event if it's a specific time, 
  // or an all-day event if it's just a date.
  
  const d = new Date(task.dueDate);
  const isAllDay = d.getHours() === 0 && d.getMinutes() === 0;

  const event = {
    summary: task.title,
    description: task.description || '',
  };

  if (isAllDay) {
    // All day event format: YYYY-MM-DD
    const dateStr = d.toISOString().split('T')[0];
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);
    const endStr = nextDay.toISOString().split('T')[0];

    event.start = { date: dateStr };
    event.end = { date: endStr };
  } else {
    // Specific time event
    event.start = { dateTime: d.toISOString() };
    const end = new Date(d);
    end.setMinutes(end.getMinutes() + (task.estimatedMinutes || 60));
    event.end = { dateTime: end.toISOString() };
  }

  try {
    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });
    return response.data.id; // Return the Google Calendar event ID
  } catch (error) {
    console.error('Error adding event to Google Calendar:', error);
    return null;
  }
}

export async function updateEventInCalendar(userId, googleEventId, task) {
  if (!googleEventId) return null;
  
  const hasCreds = await setCredentials(userId);
  if (!hasCreds) return null;

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  // If status is done, we might want to just delete it, or mark it complete. 
  // Let's just update the title to indicate completion.
  let summary = task.title;
  if (task.status === 'done') {
    summary = `✅ ${task.title}`;
  }

  const d = new Date(task.dueDate);
  const isAllDay = d.getHours() === 0 && d.getMinutes() === 0;

  const event = {
    summary: summary,
    description: task.description || '',
  };

  if (isAllDay) {
    const dateStr = d.toISOString().split('T')[0];
    const nextDay = new Date(d);
    nextDay.setDate(nextDay.getDate() + 1);
    const endStr = nextDay.toISOString().split('T')[0];

    event.start = { date: dateStr };
    event.end = { date: endStr };
  } else {
    event.start = { dateTime: d.toISOString() };
    const end = new Date(d);
    end.setMinutes(end.getMinutes() + (task.estimatedMinutes || 60));
    event.end = { dateTime: end.toISOString() };
  }

  try {
    const response = await calendar.events.update({
      calendarId: 'primary',
      eventId: googleEventId,
      resource: event,
    });
    return response.data.id;
  } catch (error) {
    console.error('Error updating event in Google Calendar:', error);
    return null;
  }
}

export async function deleteEventFromCalendar(userId, googleEventId) {
  if (!googleEventId) return;

  const hasCreds = await setCredentials(userId);
  if (!hasCreds) return;

  const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

  try {
    await calendar.events.delete({
      calendarId: 'primary',
      eventId: googleEventId,
    });
  } catch (error) {
    console.error('Error deleting event from Google Calendar:', error);
  }
}
