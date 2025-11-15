import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use('/api', routes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    message: '🏃‍♂️ Running Journey API está no ar!',
    version: '1.0.0',
    status: 'online',
    docs: 'http://localhost:3333/api/status'
  });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`📊 Status: http://localhost:${PORT}/api/status`);
});