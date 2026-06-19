import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(req: Request) {
  try {
    const { name, email, details } = await req.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    // Ensure environment variables exist
    const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!clientEmail || !privateKey) {
      console.error("Missing Google Service Account credentials in .env");
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // Authenticate with Google API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });
    const spreadsheetId = '19RIcl7PhtqtJQFnZoBrT_DSoMIhOxQU9dUJaI8A2HCI';

    // Append to Sheet1
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [new Date().toISOString(), name, email, details || 'Unknown']
        ]
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Waitlist API Error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist.' }, { status: 500 });
  }
}
