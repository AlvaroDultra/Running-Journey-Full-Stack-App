import { PrismaClient } from '@prisma/client';

// Criar instância única do Prisma Client
const prisma = new PrismaClient({
  log: ['error', 'warn'], // Log apenas erros e avisos
});

// Conectar ao banco
prisma.$connect()
  .then(() => {
    console.log('✅ Conectado ao banco de dados PostgreSQL');
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar no banco:', error);
    process.exit(1);
  });

// Fechar conexão ao encerrar o processo
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;