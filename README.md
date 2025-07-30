![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.2.0-purple?logo=vite)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?logo=typescript)
![Zustand](https://img.shields.io/badge/Zustand-4.5.2-orange)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4.1-cyan?logo=tailwindcss)
![Firebase](https://img.shields.io/badge/Firebase-10.12.2-yellow?logo=firebase)

Um aplicativo web moderno e responsivo para gerenciamento de finanças pessoais. Permite que os usuários controlem suas receitas e despesas de forma simples e intuitiva, com autenticação segura e dados armazenados de forma única para cada usuário.

<!-- Você pode adicionar um screenshot do seu app aqui -->
<!-- ![Screenshot do App](URL_DA_IMAGEM_AQUI) -->

---

## ✨ Funcionalidades

- **Autenticação Segura:** Login com contas Google através do Firebase Authentication.
- **CRUD de Transações:** Crie, leia, atualize e delete transações de receita ou despesa.
- **Dashboard Intuitivo:** Visualize um resumo do seu saldo total, total de receitas e total de despesas.
- **Dados por Usuário:** Cada usuário tem acesso apenas às suas próprias transações, garantindo privacidade e segurança.
- **Design Responsivo:** Interface adaptável para uma ótima experiência em desktops, tablets e celulares.
- **Notificações em Tempo Real:** Feedback visual para o usuário ao adicionar, atualizar ou remover transações.

---

## 🚀 Tecnologias Utilizadas

- **Frontend:**
  - **React:** Biblioteca para construção da interface de usuário.
  - **Vite:** Ferramenta de build extremamente rápida para desenvolvimento moderno.
  - **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
  - **React Router:** Para gerenciamento de rotas na aplicação.
- **Estilização:**
  - **Tailwind CSS:** Framework CSS utility-first para estilização rápida e customizável.
- **Gerenciamento de Estado:**
  - **Zustand:** Gerenciador de estado minimalista e poderoso para React.
- **Backend e Autenticação:**
  - **Firebase Authentication:** Para um sistema de login seguro e fácil de implementar.
  - **Sheet2API + Google Sheets:** Utilizado como um banco de dados simples e eficaz para armazenar os dados das transações.
- **Comunicação com API:**
  - **Axios:** Cliente HTTP baseado em Promises para fazer requisições à API.
- **Notificações:**
  - **React Hot Toast:** Para exibir notificações (toasts) elegantes e customizáveis.

---

## 🏁 Como Executar o Projeto

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

### Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [Yarn](https://yarnpkg.com/) ou [npm](https://www.npmjs.com/)
- Uma conta Google para configurar o Firebase e o Google Sheets.

### 1. Clone o Repositório

```bash
git clone https://github.com/seu-usuario/budget-manager.git
cd budget-manager
```

### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure as Variáveis de Ambiente

Este projeto requer chaves de API para o Firebase e a URL da sua API do Sheet2API.

1.  Crie um arquivo chamado `.env.local` na raiz do projeto.
2.  Copie o conteúdo do exemplo abaixo e cole no seu arquivo `.env.local`.

    ```env
    # .env.local

    # URL da sua API gerada pelo Sheet2API
    VITE_SHEET2API_URL=SUA_URL_DO_SHEET2API_AQUI

    # Configurações do seu projeto Firebase
    VITE_FIREBASE_API_KEY=SUA_API_KEY_AQUI
    VITE_FIREBASE_AUTH_DOMAIN=SEU_AUTH_DOMAIN_AQUI
    VITE_FIREBASE_PROJECT_ID=SEU_PROJECT_ID_AQUI
    VITE_FIREBASE_STORAGE_BUCKET=SEU_STORAGE_BUCKET_AQUI
    VITE_FIREBASE_MESSAGING_SENDER_ID=SEU_MESSAGING_SENDER_ID_AQUI
    VITE_FIREBASE_APP_ID=SEU_APP_ID_AQUI
    ```

3.  Substitua os valores `SUA_..._AQUI` pelas suas chaves reais obtidas no console do Firebase e no site do Sheet2API.

### 4. Execute o Projeto

```bash
npm run dev
# ou
yarn dev
```

O aplicativo estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).

---

## 🔧 Configuração do Backend (Google Sheets + Sheet2API)

Este projeto utiliza uma Planilha Google como banco de dados, acessada através do Sheet2API.

1.  **Crie uma Planilha Google:**

    - Acesse [sheets.google.com](https://sheets.google.com) e crie uma nova planilha.
    - Na primeira linha (cabeçalho), adicione as seguintes colunas **exatamente** com estes nomes:

    ```
    id | userId | description | amount | date | category | type
    ```

2.  **Configure o Sheet2API:**

    - Acesse [sheet2api.com](https://sheet2api.com).
    - Crie uma nova API conectando-a à Planilha Google que você acabou de criar.
    - O Sheet2API irá gerar uma URL de API. Copie esta URL e cole no seu arquivo `.env.local` na variável `VITE_SHEET2API_URL`.

3.  **Formatação da Coluna (Importante):**
    - Na sua Planilha Google, selecione a coluna `amount` inteira.
    - Vá em `Formatar` > `Número` e escolha o formato **Número** ou **Moeda**. Isso evita que os valores sejam interpretados como datas.

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
