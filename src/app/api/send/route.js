import { Resend } from 'resend';
import { EmailTemplate } from '@/Components/EmailTemplate';

const resend = new Resend('re_3YqJBhDG_83Bt9hxa6DySDRt8J95fFGxm');

export async function POST(request) {
  try {
    const formData = await request.json();
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      return Response.json({ error: 'Email inválido' }, { status: 400 });
    }

    const { data, error } = await resend.emails.send({
      from: 'Seu Nome <contato@seudominio.com>',
      to: formData.email,
      subject: 'Bem-vindo!',
      html: EmailTemplate(formData),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true }, { status: 200 });
  } catch (error) {
    return Response.json({ error: 'Erro ao enviar email' }, { status: 500 });
  }
}