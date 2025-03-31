import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function POST(request) {
  let connection;
  try {
    const formData = await request.json();
    //console.log('Dados recebidos:', formData); // Log para debug

    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'db-promo'
    });

    // Garantir que todos os valores sejam strings ou números
    const values = [
      String(formData.nome || ''),
      String(formData.cpf || ''),
      String(formData.email || ''),
      String(formData.ddd || ''),
      String(formData.celular || ''),
      String(formData.estado || ''),
      String(formData.cidade || ''),
      String(formData.data || ''),
      String(formData.aceitaTermos || 'não'),
      String(formData.cupom || ''),
      String(formData.escolhahorario || ''),
      String(formData.clienteTouti || 'não'),
      String(formData.saurus || ''),
      String(formData.endereco || '')
    ];

    const [result] = await connection.execute(
      'INSERT INTO promocao (nome, cpf, email, ddd, celular, uf, cidade, dtdata, aceito_termos, cupom, escolhahorario, clienteTouti, saurus, endereco) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      values
    );

    return NextResponse.json({ success: true });
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