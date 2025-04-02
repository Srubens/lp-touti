import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request) {
  let connection;
  try {
    const { email, cpf } = await request.json();
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'db-promo'
    });

    const [rows] = await connection.execute(
      'SELECT * FROM promocao WHERE email = ? OR cpf = ?',
      [email, cpf]
    );

    if (rows.length > 0) {
      const existingUser = rows[0];
      let message = '';
      
      if (existingUser.email === email && existingUser.cpf === cpf) {
        message = 'Email e CPF já cadastrados no sistema';
      } else if (existingUser.email === email) {
        message = 'Email já cadastrado no sistema';
      } else {
        message = 'CPF já cadastrado no sistema';
      }

      return NextResponse.json({ exists: true, message });
    }

    return NextResponse.json({ exists: false });
  } catch (error) {
    console.error('Erro na verificação:', error);
    return NextResponse.json(
      { error: true, message: 'Erro ao verificar dados' },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}