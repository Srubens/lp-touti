import { Resend } from 'resend';

const resend = new Resend('re_3YqJBhDG_83Bt9hxa6DySDRt8J95fFGxm');

export async function POST(request) {
  try {
    const { nome, email, escolhahorario, cupom } = await request.json();
    const { data, error } = await resend.emails.send({
      from: 'Touti <onboarding@resend.dev>',
      to: email,
      subject: 'Bem-vindo à Touti!',
      html: `
        <h1>Olá ${nome}!</h1>
        <p>Seja bem-vindo à Touti!</p>
        <p>Seu horário agendado: ${escolhahorario}</p>
        <p>Seu cupom de desconto: <strong>${cupom}</strong></p>
      `
    });

    if (error) {
      return Response.json({ error });
    }

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Error sending email' });
  }
}