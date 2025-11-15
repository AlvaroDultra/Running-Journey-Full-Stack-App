# 🏃‍♂️ Running Journey

<div align="center">

![Running Journey](https://img.shields.io/badge/Running-Journey-purple?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

**Transforme seus quilômetros em uma jornada pelo Brasil!** 🗺️

[Demo](#) • [Documentação](#funcionalidades) • [Instalação](#instalação)

</div>

---

## 📖 Sobre o Projeto

**Running Journey** é uma aplicação full-stack que transforma sua rotina de corridas em uma jornada virtual pelo Brasil! Registre seus quilômetros diários e acompanhe em tempo real por quais cidades você já "passou" baseado nas distâncias reais entre elas.

### ✨ Principais Funcionalidades

- 🔐 **Autenticação completa** - Sistema de login e cadastro com JWT
- 🏃 **Registro de corridas** - Adicione suas corridas com distância, data e observações
- 📊 **Dashboard interativo** - Visualize suas estatísticas em tempo real
- 🗺️ **Cálculo de posição** - Descubra em qual cidade você está baseado nos km percorridos
- 🏙️ **Integração com IBGE** - Dados reais de cidades brasileiras
- 📈 **Estatísticas detalhadas** - Acompanhe seu progresso, médias e recordes
- 📱 **Design responsivo** - Interface moderna e adaptável

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **TypeScript** - Superset JavaScript com tipagem
- **Prisma ORM** - ORM moderno para Node.js
- **PostgreSQL** - Banco de dados relacional
- **JWT** - Autenticação via tokens
- **Bcrypt** - Criptografia de senhas
- **Axios** - Cliente HTTP

### Frontend
- **React** - Biblioteca para interfaces
- **TypeScript** - Tipagem estática
- **Vite** - Build tool moderna e rápida
- **React Router** - Roteamento
- **Zustand** - Gerenciamento de estado
- **Axios** - Requisições HTTP
- **CSS3** - Estilização customizada

### APIs Externas
- **IBGE API** - Dados de municípios brasileiros
- **Nominatim (OSM)** - Geocoding e coordenadas
- **OpenRouteService** - Cálculo de rotas (futuro)

---

## 📦 Estrutura do Projeto
```
running-journey/
├── backend/
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   │   └── prisma.ts
│   │   ├── controllers/
│   │   │   ├── authController.ts
│   │   │   ├── corridaController.ts
│   │   │   └── cidadeController.ts
│   │   ├── middlewares/
│   │   │   └── auth.ts
│   │   ├── routes/
│   │   │   ├── index.ts
│   │   │   ├── authRoutes.ts
│   │   │   ├── corridaRoutes.ts
│   │   │   └── cidadeRoutes.ts
│   │   ├── services/
│   │   │   ├── authService.ts
│   │   │   ├── corridaService.ts
│   │   │   ├── cidadeService.ts
│   │   │   └── rotaService.ts
│   │   ├── utils/
│   │   │   └── hashPassword.ts
│   │   └── server.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   │   ├── Login.tsx
    │   │   ├── Dashboard.tsx
    │   │   └── RegistrarCorrida.tsx
    │   ├── services/
    │   │   └── api.ts
    │   ├── store/
    │   │   └── authStore.ts
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   └── main.tsx
    ├── package.json
    └── vite.config.ts
```

---

## 🔧 Instalação

### Pré-requisitos

- Node.js (v18 ou superior)
- PostgreSQL (v14 ou superior)
- npm ou yarn

### 1️⃣ Clone o repositório
```bash
git clone https://github.com/seu-usuario/running-journey.git
cd running-journey
```

### 2️⃣ Configure o Backend
```bash
# Entrar na pasta do backend
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas credenciais do PostgreSQL

# Executar migrations
npx prisma migrate dev

# Iniciar servidor de desenvolvimento
npm run dev
```

O backend estará rodando em `http://localhost:3333`

### 3️⃣ Configure o Frontend
```bash
# Voltar para raiz e entrar no frontend
cd ../frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

---

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend` com as seguintes variáveis:
```env
# Database
DATABASE_URL="postgresql://usuario:senha@localhost:5432/running_journey?schema=public"

# Server
PORT=3333
NODE_ENV=development

# JWT
JWT_SECRET=seu_secret_super_secreto_aqui
JWT_EXPIRES_IN=7d

# OpenRouteService API (opcional)
OPENROUTE_API_KEY=
```

---

## 📊 Funcionalidades

### 🔐 Autenticação
- Cadastro de novos usuários
- Login com email e senha
- Tokens JWT com expiração configurável
- Proteção de rotas privadas

### 🏃 Gestão de Corridas
- Registrar corridas com distância, data e observações
- Validação de distâncias (0.1km - 200km)
- Histórico completo de corridas
- Edição e exclusão de corridas

### 📈 Estatísticas
- Quilometragem total acumulada
- Número total de corridas
- Média de km por corrida
- Maior e menor corrida
- Datas da primeira e última corrida

### 🗺️ Localização Virtual
- Definição de cidade de origem
- Cálculo automático de cidade atual baseado nos km
- Integração com dados reais do IBGE
- Coordenadas geográficas precisas

---

## 🎯 Como Usar

### 1. Cadastro e Login
- Acesse a aplicação em `http://localhost:5173`
- Crie uma conta com nome, email e senha
- Faça login com suas credenciais

### 2. Defina sua Cidade de Origem
- No dashboard, clique em "Definir Cidade de Origem"
- Busque e selecione sua cidade
- Este será seu ponto de partida!

### 3. Registre suas Corridas
- Clique em "➕ Registrar Corrida"
- Informe a distância percorrida
- Adicione observações (opcional)
- Salve e veja seu progresso!

### 4. Acompanhe sua Jornada
- Veja suas estatísticas no dashboard
- Descubra em qual cidade você está
- Acompanhe quantos km faltam para a próxima cidade

---

## 🧪 Testes

### Backend
```bash
cd backend

# Testar endpoints com curl
curl http://localhost:3333/api/status | jq

# Cadastrar usuário
curl -X POST http://localhost:3333/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","email":"teste@email.com","senha":"123456"}' | jq
```

---

## 🤝 Contribuindo

Contribuições são sempre bem-vindas!

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

---

## 📝 Roadmap

- [ ] Página de histórico detalhado
- [ ] Gráficos de evolução temporal
- [ ] Mapa interativo com a rota percorrida
- [ ] Sistema de metas e objetivos
- [ ] Integração com OpenRouteService para rotas reais
- [ ] Rankings entre usuários
- [ ] Notificações de conquistas
- [ ] Exportar dados (CSV, PDF)
- [ ] Modo escuro
- [ ] App mobile (React Native)

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Álvaro**

- LinkedIn: [Seu LinkedIn](#)
- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- Email: seu@email.com

---

## 🙏 Agradecimentos

- [IBGE](https://servicodados.ibge.gov.br/) - API de dados geográficos
- [OpenStreetMap/Nominatim](https://nominatim.org/) - Geocoding gratuito
- Comunidade open-source por todas as bibliotecas incríveis!

---

<div align="center">

**⭐ Se este projeto te ajudou, deixe uma estrela!**

Feito com ❤️ e muita ☕

</div>
