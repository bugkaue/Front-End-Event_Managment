# Projeto de Gestão com React e ASP.NET Core

Este projeto é uma aplicação de gestão desenvolvida em **React** para o frontend e **ASP.NET Core** para o backend. A aplicação é capaz de consumir APIs REST utilizando hooks personalizados, `tanstack query` e `axios`. Possui autenticação para diferentes tipos de usuários, rotas protegidas, gráficos dinâmicos e um design moderno utilizando **Tailwind CSS** e outras bibliotecas.

---

## Funcionalidades Principais

### 🔑 **Autenticação**
- **Admin Auth** e **Auth de Usuário**:
  - Gerenciamento de tokens JWT para autenticação e autorização.
  - Utilização de **AuthContext** para manter o estado de autenticação.
- **Rotas Protegidas**:
  - Implementação de `ProtectedRoute` tanto para admin quanto para usuários.
  - Validação de permissões antes de acessar páginas específicas.

### 🔄 **Consumo de API**
- Hooks personalizados criados para consumir dados da API.
- Utilização de **axios** para chamadas HTTP.
- **Tanstack Query** para gerenciamento de estados assíncronos e cache.

### 📊 **Visualizações e Gráficos**
- Uso de **Chart.js** para criar gráficos interativos no dashboard.
- Biblioteca **Moment.js** para manipulação e formatação de datas.

### 💻 **Design e Layout**
- Interface construída com **Tailwind CSS** para um design responsivo e moderno.
- Navegação integrada com:
  - **React Router** para gerenciamento de rotas.
  - Sidebar e Navigation reutilizáveis para admin e usuário.

### 🚨 **Feedbacks ao Usuário**
- Mensagens de confirmação e alertas utilizando **SweetAlert**.
- Estado de componentes gerenciado com **useState** para criar experiências dinâmicas.

### ⚙️ **Outras Funcionalidades**
- Criação de layouts consistentes para a navegação entre componentes.
- Administração centralizada para permissões e configurações.
- Manipulação eficiente de dados e ações críticas com confirmações via SweetAlert.

---

## Tecnologias Utilizadas

### **Frontend**
- React.js
- Tailwind CSS
- Axios
- Tanstack Query
- React Router
- Chart.js
- Moment.js
- SweetAlert2
- Lucid React

### **Backend**
- ASP.NET Core (C#)
- JWT para autenticação

---

## Como Executar o Projeto

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
