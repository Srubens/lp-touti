import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db-promo',
    password: 'saga2016', 
    port: 5432,
});

export async function GET(request) {
  try {
    const result = await pool.query(`
      SELECT escolhahorario, COUNT(*) as total 
      FROM promocao 
      GROUP BY escolhahorario 
      HAVING COUNT(*) >= 2
    `);

    console.log('Resultado da query:', result.rows); // Debug log

    const horariosOcupados = {};
    result.rows.forEach(row => {
      horariosOcupados[row.escolhahorario] = parseInt(row.total);
    });

    return NextResponse.json({ 
      success: true, 
      horariosOcupados,
      horariosDesabilitados: result.rows.map(row => row.escolhahorario)
    });

  } catch (error) {
    console.error('Erro detalhado:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    
    return NextResponse.json({ 
      success: false, 
      error: `Erro ao verificar horários: ${error.message}` 
    }, { status: 500 });
  }
}