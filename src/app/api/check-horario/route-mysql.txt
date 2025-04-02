import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export async function GET(request) {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'db-promo'
    });

    // Buscar todos os horários e suas contagens
    const [rows] = await connection.execute(
      'SELECT escolhahorario, COUNT(*) as total FROM promocao GROUP BY escolhahorario HAVING total >= 2'
    );

    const horariosOcupados = {};
    rows.forEach(row => {
      horariosOcupados[row.escolhahorario] = row.total;
    });

    return NextResponse.json({ 
      success: true, 
      horariosOcupados,
      horariosDesabilitados: rows.map(row => row.escolhahorario)
    });

  } catch (error) {
    console.error('Erro detalhado:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Erro ao verificar horários disponíveis' 
    }, { status: 500 });
  } finally {
    if (connection) await connection.end();
  }
}