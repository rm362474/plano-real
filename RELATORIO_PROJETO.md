# Relatório do Projeto - PlanoReal

## 1. Resumo Executivo

**PlanoReal** é uma solução que utiliza Inteligência Artificial para gerar planos de aula personalizados e realistas para professores da rede pública de ensino. O sistema transforma um processo que tradicionalmente leva horas em uma tarefa de poucos minutos ou segundos, considerando a realidade específica de cada contexto educacional: recursos disponíveis, perfil da turma, objetivos pedagógicos e duração da aula.

**Objetivo**: Reduzir o tempo gasto na criação de planos de aula, permitindo que professores se concentrem no que realmente importa - o ensino e o aprendizado dos alunos.

**Impacto esperado**: Melhoria na qualidade dos planos de aula, redução do estresse docente, e consequente melhoria no aproveitamento das aulas pelos alunos.

---

## 2. Problema Identificado

Professores da rede pública enfrentam desafios constantes na criação de planos de aula:

- **Tempo limitado**: Professores precisam criar planos regularmente, mas têm pouco tempo disponível devido à carga de trabalho
- **Planos genéricos**: Muitas soluções existentes geram planos que não consideram a realidade específica de cada escola e turma
- **Recursos variáveis**: Escolas têm recursos diferentes (algumas só têm quadro e giz, outras têm laboratórios), mas planos genéricos não consideram isso
- **Perfil das turmas**: Cada turma tem características únicas (agitada, com defasagem, bilíngue, etc.) que precisam ser consideradas
- **Documentação obrigatória**: Escolas exigem planos documentados, mas a criação manual é trabalhosa

**Justificativa**: Resolver esse problema impacta diretamente a qualidade do ensino público, pois professores com mais tempo e planos adequados conseguem oferecer aulas mais eficientes e engajadas.

---

## 3. Descrição da Solução

O PlanoReal funciona através de um fluxo simples e direto:

1. **Entrada de dados**: O professor preenche um formulário web com:
   - Assunto e disciplina
   - Série/ano dos alunos
   - Duração da aula
   - Objetivos pedagógicos desejados
   - Recursos disponíveis na escola
   - Perfil específico da turma

2. **Processamento**: O sistema envia essas informações para uma API de IA (OpenRouter), que gera um plano estruturado considerando todas as especificidades informadas.

3. **Resultado**: O professor recebe um plano completo em formato visual e pode baixá-lo em PDF para documentação.

**Diferencial**: O sistema não assume recursos ou características ideais. Se a escola só tem quadro e giz, o plano será criado para funcionar com isso. Se a turma é agitada, o plano incluirá estratégias específicas para manter o engajamento.

---

## 4. Processo de Desenvolvimento

O desenvolvimento seguiu uma abordagem focada em MVP (Minimum Viable Product):

### Etapas realizadas:

1. **Definição do escopo**: Identificação das funcionalidades essenciais para validar o conceito
3. **Integração com IA**: Desenvolvimento do backend para comunicação com OpenRouter e construção de prompts eficazes
4. **Geração de PDF**: Implementação da funcionalidade de download para facilitar a documentação
5. **Validação e tratamento de erros**: Implementação de validações tanto no frontend quanto no backend

### Decisões de design:

- **Foco na simplicidade**: Interface limpa, sem distrações, focada na tarefa principal
- **Validação robusta**: Validação em múltiplas camadas para garantir dados consistentes
- **Feedback claro**: Estados de loading e mensagens de erro claras para o usuário
- **Sem autenticação no MVP**: Decisão consciente de focar no core da funcionalidade primeiro

---

## 5. Detalhes Técnicos

### Arquitetura

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │  HTTP   │   Backend   │  HTTP   │  OpenRouter │
│   (React)   │ ──────> │  (Express)  │ ──────> │     API     │
│  Porta 3000 │         │  Porta 3001 │         │    (IA)     │
└─────────────┘         └─────────────┘         └─────────────┘
      │                        │
      │                        │
      └──────── PDF ───────────┘
      (jsPDF - download)
```

### Arquitetura Visual

```
┌─────────────────────────────────────────────────────────┐
│                    USUÁRIO (Professor)                  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │   Interface Web        │
         │   (React + Vite)       │
         │   - Formulário         │
         │   - Exibição do plano  │
         │   - Download PDF       │
         └───────────┬────────────┘
                     │ HTTP/REST
                     ▼
         ┌───────────────────────┐
         │   Backend API         │
         │   (Node.js + Express) │
         │   - Validação         │
         │   - Construção prompt │
         │   - Parse resposta    │
         └───────────┬────────────┘
                     │ HTTP
                     ▼
         ┌───────────────────────┐
         │   OpenRouter API      │
         │   (Modelos de IA)     │
         │   - Geração do plano  │
         └───────────────────────┘
```

### Stack Tecnológica

**Frontend:**
- React
- Vite
- jsPDF (geração de PDF)
- CSS puro (sem frameworks)

**Backend:**
- Node.js
- Express
- CORS
- dotenv

**Integrações:**
- OpenRouter API (acesso a modelos de IA)
- Modelo padrão: `xiaomi/mimo-v2-flash:free` (gratuito)

### Estrutura do Projeto

```
plano-real/
├── backend/
│   ├── env.example        # Template de configuração
│   ├── package.json
│   └── server.js          # Servidor Express e lógica de IA
├── frontend/
│   ├── src/
│   │   └── components/
│   │       ├── Formulario.jsx    # Formulário de entrada
│   │       └── PlanoAula.jsx     # Exibição e PDF
│   │   ├── App.jsx        # Componente principal
│   │   ├── index.css      # Estilos globais
│   │   └── main.jsx       # Ponto de entrada React
│   ├── env.example        # Template de configuração
│   ├── index.html         # HTML principal
│   ├── package.json
│   └── vite.config.js
├── package.json            # Scripts de desenvolvimento
├── .gitignore              # Arquivos ignorados pelo Git
├── README.md               # Documentação principal
├── README_PITCH.md         # Script para vídeo de pitch
├── README_MVP_TECNICO.md   # Script para vídeo técnico
└── RELATORIO_PROJETO.md    # Relatório completo do projeto
```

### Endpoints da API

- `POST /api/gerar-plano`: Recebe dados do formulário e retorna plano gerado pela IA
- `GET /health`: Health check do servidor

### Fluxo de Dados

1. Usuário preenche formulário no frontend
2. Frontend valida dados localmente
3. Dados são enviados para `/api/gerar-plano`
4. Backend valida e sanitiza dados
5. Backend constrói prompt detalhado para IA
6. Prompt é enviado para OpenRouter
7. Resposta da IA (JSON) é parseada e validada
8. Plano é retornado ao frontend
9. Frontend exibe plano e permite download em PDF

---

## 6. Links Úteis

### Repositório
- **GitHub**: https://github.com/rm362474/plano-real

> **Observação**: Para saber como rodar e configurar o projeto, basta ler as orientações do README.md do projeto no repositório do GitHub.

### APIs e Serviços Utilizados
- **OpenRouter**: https://openrouter.ai - Plataforma de acesso a modelos de IA

---

## 7. Aprendizados e Próximos Passos

### Aprendizados

1. **Importância do MVP focado**: Focar apenas no essencial permitiu validar o conceito rapidamente sem se perder em funcionalidades secundárias.

2. **Validação de dados é crítica**: A validação em múltiplas camadas (frontend e backend) previne erros e melhora a experiência do usuário.

3. **Prompts bem estruturados**: A qualidade do prompt enviado à IA é fundamental para obter resultados úteis e realistas.

4. **Considerar a realidade do usuário**: O diferencial do projeto está em considerar recursos limitados e perfis específicos, não assumir condições ideais.

5. **Simplicidade na interface**: Uma interface limpa e focada é mais eficaz que uma interface com muitas opções.

### Próximos Passos

**Funcionalidades a implementar:**

1. **Sistema de autenticação**: Login e cadastro de usuários para permitir salvamento de planos e histórico
2. **Interface de configuração**: UI para configurar chave de API e modelo de IA sem editar arquivos
3. **Persistência de dados**: Banco de dados para armazenar planos gerados e permitir edição posterior
4. **Deploy em produção**: Hospedagem do sistema para acesso público sem necessidade de instalação local
5. **Biblioteca de planos**: Repositório compartilhado onde professores podem acessar e adaptar planos de outros educadores
6. **Avaliação de planos**: Sistema de feedback para professores avaliarem a eficácia dos planos gerados

**Melhorias técnicas:**

- Otimização do tempo de resposta da API
- Cache de planos similares
- Suporte a múltiplos modelos de IA
- Testes automatizados
- Documentação da API (Swagger/OpenAPI)

---

## Conclusão

O PlanoReal demonstra que é possível usar Inteligência Artificial para resolver problemas reais da educação pública de forma prática e acessível. O MVP valida o conceito e está pronto para evoluir com base no feedback dos usuários e nas necessidades identificadas.

O projeto priorizou a funcionalidade essencial sobre recursos secundários, resultando em uma solução focada, funcional e pronta para crescer.
