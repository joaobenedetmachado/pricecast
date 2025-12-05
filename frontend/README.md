# 🚀 PriceCast Frontend

Interface moderna em **Dark Mode** para predição de preços de criptomoedas usando LSTM.

## ✨ Funcionalidades

### 📊 **Predição de Preços**
- Configuração de parâmetros (dias, window size)
- Seleção de arquivo de dados
- Visualização em gráfico interativo (Recharts)
- Modelo LSTM para predições

### 📤 **Upload de Dados**
- Upload de arquivos CSV
- Validação de formato
- Integração automática com o sistema

### 🔄 **Atualização de Dados**
- Atualizar dados de moedas específicas
- Configuração de período/parte

### 📁 **Gerenciamento de Dados**
- Listagem de arquivos disponíveis
- Seleção rápida de datasets
- Visualização de caminhos completos

## 🎨 Stack Tecnológica

- **React 18** - UI Library
- **Vite** - Build Tool
- **Tailwind CSS v3** - Styling
- **shadcn/ui** - Component Library
- **Recharts** - Data Visualization
- **Axios** - HTTP Client
- **Lucide React** - Icons

## 📦 Estrutura do Projeto

```
frontend/
├── src/
│   ├── components/ui/      # shadcn/ui components
│   │   ├── button.jsx
│   │   ├── card.jsx
│   │   ├── input.jsx
│   │   ├── select.jsx
│   │   ├── badge.jsx
│   │   └── tabs.jsx
│   ├── pages/
│   │   └── main.jsx        # Main dashboard page
│   ├── services/
│   │   └── api.js          # API integration
│   ├── lib/
│   │   └── utils.js        # Utilities
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

## 🔌 Integração com API

A aplicação consome os seguintes endpoints da API FastAPI:

### `GET /data-avaiable`
Lista todos os arquivos CSV disponíveis para análise.

### `POST /predict`
Realiza predições usando modelo LSTM.
- **Parâmetros**: `csv_path`, `days`, `window_size`, `model`

### `POST /upload`
Upload de novos arquivos CSV.
- **Body**: FormData com arquivo

### `POST /update`
Atualiza dados de uma moeda específica.
- **Parâmetros**: `name`, `part`

## 🚀 Como Usar

### 1. Instalar Dependências
```bash
npm install
```

### 2. Configurar API
Certifique-se de que a API FastAPI está rodando em `http://localhost:8000`

Para alterar a URL da API, edite `src/services/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:8000'
```

### 3. Iniciar Desenvolvimento
```bash
npm run dev
```

### 4. Build para Produção
```bash
npm run build
```

## 🎨 Interface

### Dark Mode
A interface usa **dark mode por padrão** com:
- Gradientes modernos (slate-950 → slate-900)
- Bordas sutis (slate-800)
- Cores vibrantes para destaques
- Transições suaves

### Componentes Principais

#### **Header**
- Logo com gradiente
- Badge de status da API
- Botão de refresh

#### **Stats Cards**
- Arquivos disponíveis
- Dias de predição
- Modelo atual
- Window size

#### **Tabs de Navegação**
1. **Predição** - Configuração e visualização
2. **Upload** - Upload de arquivos
3. **Atualizar** - Atualizar dados de moedas
4. **Dados** - Gerenciar arquivos

#### **Gráfico de Predição**
- AreaChart com gradiente
- Tooltip interativo
- Responsivo
- Cores personalizadas

## 🎯 Próximos Passos

- [ ] Adicionar autenticação
- [ ] Implementar histórico de predições
- [ ] Adicionar mais tipos de gráficos
- [ ] Exportar resultados (CSV, PDF)
- [ ] Comparação de modelos
- [ ] Notificações em tempo real
- [ ] Modo claro/escuro toggle
- [ ] Testes unitários

## 🛠️ Desenvolvimento

### Adicionar Novos Componentes UI

```bash
# Criar novo componente em src/components/ui/
touch src/components/ui/novo-componente.jsx
```

### Modificar Tema

Edite as variáveis CSS em `src/index.css`:

```css
.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### Adicionar Novos Endpoints

Edite `src/services/api.js`:

```javascript
export const novaFuncao = async (params) => {
  const response = await api.post('/novo-endpoint', params)
  return response.data
}
```

## 📚 Recursos

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [Lucide Icons](https://lucide.dev)

---

**Desenvolvido com ❤️ para PriceCast**
