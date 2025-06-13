export const config = {
  runtime: 'edge',
};

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const formData = await request.json();
    
    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'practiceArea', 'message'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return new Response(
          JSON.stringify({ error: `${field} is required` }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    // Format the email content
    const emailContent = `
      New Contact Form Submission
      
      Name: ${formData.firstName} ${formData.lastName}
      Email: ${formData.email}
      Phone: ${formData.phone || 'Not provided'}
      Practice Area: ${formData.practiceArea}
      
      Message:
      ${formData.message}
    `;

    // Send email using Vercel's Email API
    // Note: This requires setting up Vercel's Email add-on and configuring environment variables
    const emailResponse = await fetch('https://api.vercel.com/v6/email', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.VERCEL_EMAIL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'contact-form@justice-associates.com',
        to: 'info@justice-associates.com', // Change this to your receiving email
        subject: `New Contact Form: ${formData.practiceArea}`,
        text: emailContent,
      }),
    });

    if (!emailResponse.ok) {
      console.error('Email sending failed:', await emailResponse.text());
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
