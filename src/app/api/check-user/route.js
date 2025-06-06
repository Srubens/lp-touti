import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db-promo',
    password: 'saga2016',
    port: 5432,
  });

export async function POST(request) {
  const client = await pool.connect();
  
  try {
    const { email, cpf } = await request.json();

    const query = 'SELECT * FROM promocao WHERE email = $1 OR cpf = $2';
    const result = await client.query(query, [email, cpf]);

    if (result.rows.length > 0) {
      const existingUser = result.rows[0];
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
    client.release();
  }
}