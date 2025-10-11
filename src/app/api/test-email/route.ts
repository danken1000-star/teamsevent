import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
  try {
    console.log('=== EMAIL TEST START ===');
    console.log('API Key exists:', !!process.env.RESEND_API_KEY);
    console.log('API Key length:', process.env.RESEND_API_KEY?.length);
    
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ 
        error: 'RESEND_API_KEY not found' 
      }, { status: 500 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const result = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'danken1000@gmail.com', // Deine Test-Email
      subject: 'Test from TeamsEvent',
      html: '<p>If you see this, Resend works! 🎉</p>'
    });

    console.log('Email sent:', result);
    
    return NextResponse.json({ 
      success: true, 
      result 
    });
  } catch (error: any) {
    console.error('Email error:', error);
    return NextResponse.json({ 
      error: error.message,
      details: error 
    }, { status: 500 });
  }
}