import { Resend } from 'resend';
import { EmailTemplate } from '@/Components/EmailTemplate';

const resend = new Resend('re_3YqJBhDG_83Bt9hxa6DySDRt8J95fFGxm');

export async function POST(request) {
  try {
    const formData = await request.json();
    const { data, error } = await resend.emails.send({
      from: 'Touti <onboarding@resend.dev>',
      to: formData.email,
      subject: 'Bem-vindo à Touti!',
      html: EmailTemplate(formData)
    });

    if (error) {
      return Response.json({ error });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Error sending email' });
  }
}