import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request) {
  let connection;
  try {
    const formData = await request.json();
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'db-promo'
    });

    const [result] = await connection.execute(
      'INSERT INTO promocao (nome, cpf, email, ddd, celular, uf, cidade, dtdata, aceito_termos, cupom, escolhahorario, clienteTouti) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        formData.nome,
        formData.cpf,
        formData.email,
        formData.ddd,
        formData.celular,
        formData.estado,
        formData.cidade,
        formData.data,
        formData.aceitaTermos ? 1 : 0,
        formData.cupom,
        formData.escolhahorario,
        formData.clienteTouti === 'sim' ? 'sim' : 'não'
      ]
    );

    return NextResponse.json({ 
      success: true
    });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao cadastrar usuário' },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}