import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

if (!process.env.OPENROUTER_API_KEY) {
  console.error("ERRO: OPENROUTER_API_KEY não configurada!");
  console.error("Configure a variável OPENROUTER_API_KEY no arquivo .env");
  console.error(
    "Copie backend/env.example para backend/.env e preencha os valores",
  );
  process.exit(1);
}

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "xiaomi/mimo-v2-flash:free";

app.use(cors());

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  next();
});

app.use(express.json({ limit: "10mb" }));

const validateRequest = (body) => {
  const { assunto, serie, duracao, objetivo } = body;
  const errors = [];

  if (!assunto || typeof assunto !== "string" || assunto.trim().length === 0) {
    errors.push("Assunto da aula é obrigatório");
  }
  if (!serie || typeof serie !== "string" || serie.trim().length === 0) {
    errors.push("Série é obrigatória");
  }
  if (
    !duracao ||
    (typeof duracao !== "string" && typeof duracao !== "number") ||
    String(duracao).trim().length === 0
  ) {
    errors.push("Duração é obrigatória");
  }
  if (!objetivo || !Array.isArray(objetivo) || objetivo.length === 0) {
    errors.push("Pelo menos um objetivo pedagógico é obrigatório");
  }

  if (body.recursos && !Array.isArray(body.recursos)) {
    errors.push("Recursos deve ser um array");
  }
  if (body.perfilTurma && !Array.isArray(body.perfilTurma)) {
    errors.push("Perfil da turma deve ser um array");
  }

  return errors;
};

app.post("/api/gerar-plano", async (req, res) => {
  try {
    const validationErrors = validateRequest(req.body);
    if (validationErrors.length > 0) {
      return res
        .status(400)
        .json({ error: "Dados inválidos", details: validationErrors });
    }

    const { assunto, serie, duracao, objetivo, recursos, perfilTurma } =
      req.body;

    const sanitizeString = (str) => String(str).trim().slice(0, 500);

    const assuntoSanitizado = sanitizeString(assunto);
    const serieSanitizada = sanitizeString(serie);
    const duracaoNumero = parseInt(String(duracao).trim(), 10) || 45;
    const duracaoTexto = `${duracaoNumero} minutos`;
    const objetivoTexto =
      objetivo && objetivo.length > 0
        ? objetivo.join(", ")
        : "Não especificado";

    const recursosLista = Array.isArray(recursos) ? recursos : [];
    const recursosNormalizados = recursosLista
      .map((r) => sanitizeString(r))
      .filter(Boolean);

    // Se nenhum recurso foi selecionado, usar "Nenhum recurso além do professor" como padrão
    const nenhumRecursoSelecionado = recursosNormalizados.length === 0;

    const nenhumRecursoAlemProfessor =
      nenhumRecursoSelecionado ||
      recursosNormalizados.some((r) =>
        [
          "nenhum",
          "apenas professor",
          "somente professor",
          "nenhum recurso além do professor",
          "nenhum recurso alem do professor",
        ].includes(r.toLowerCase()),
      );

    const recursosTexto = nenhumRecursoAlemProfessor
      ? "Nenhum recurso disponível além do professor e sua voz (sem quadro, sem materiais adicionais, apenas a presença do professor e sua voz)."
      : recursosNormalizados.join(", ");
    const perfilTexto =
      perfilTurma && perfilTurma.length > 0
        ? perfilTurma.join(", ")
        : "Perfil padrão";

    const perfilLista = Array.isArray(perfilTurma) ? perfilTurma : [];
    const mencionaTurmaPequena = perfilLista.some(
      (p) => sanitizeString(p).toLowerCase() === "turma pequena",
    );
    const mencionaTurmaNumerosa = perfilLista.some(
      (p) => sanitizeString(p).toLowerCase() === "turma numerosa",
    );
    const tamanhoTurmaNaoInformado =
      !mencionaTurmaPequena && !mencionaTurmaNumerosa;
    const tamanhoTurmaTexto = tamanhoTurmaNaoInformado
      ? "Não informado (não assuma)."
      : mencionaTurmaPequena
        ? "Turma pequena."
        : "Turma numerosa.";

    const prompt = `Você é um assistente pedagógico especializado na realidade da escola pública brasileira.

Crie planos de aula REALISTAS considerando:
- Pouco tempo de preparo
- Recursos variáveis (use apenas os recursos informados)
- Diferentes níveis de engajamento e leitura

IMPORTANTE:
- Não assuma automaticamente que a turma é grande ou pequena. Use o "Perfil da turma" informado.
- Caso o usuário informe "nenhum recurso além do professor" ou nenhum recurso seja selecionado, proponha atividades usando APENAS a presença do professor e sua voz (sem quadro, sem materiais, sem recursos físicos).
- Se o tamanho da turma NÃO estiver informado, faça um plano escalável (funciona tanto para turma pequena quanto numerosa), descrevendo rapidamente como adaptar a dinâmica para cada caso.

CONTEXTO:
Assunto da aula: ${assuntoSanitizado}

Série: ${serieSanitizada}
Duração: ${duracaoTexto}
Objetivos pedagógicos: ${objetivoTexto}

Recursos disponíveis:
${recursosTexto}

Perfil da turma:
${perfilTexto}

Tamanho da turma:
${tamanhoTurmaTexto}

REGRAS:
- Identifique a disciplina e o tema a partir do "Assunto da aula" informado
- Não use recursos não informados
- Se "Nenhum recurso além do professor" estiver selecionado ou nenhum recurso for informado, use APENAS a presença do professor e sua voz (sem quadro, sem materiais físicos, sem recursos adicionais)
- Não exija internet ou celular se não disponíveis
- Linguagem simples e direta
- Adeque o formato das atividades ao "Perfil da turma" (ex.: turma pequena permite mais diálogo; turma grande exige mais organização)
- Se o tamanho da turma não estiver informado, evite organizar a aula em formatos que dependem do tamanho (ex.: círculo/roda obrigatória). Prefira estratégias neutras e inclua alternativas ("se turma pequena..." / "se turma numerosa...").
- Plano compatível com o tempo informado (${duracaoNumero} minutos)
- Considere todos os objetivos pedagógicos selecionados

RESPONDA EXCLUSIVAMENTE EM JSON, SEM TEXTO EXTRA:

{
  "objetivo_da_aula": "",
  "estrutura": [
    { "etapa": "Abertura", "tempo_minutos": "", "descricao": "" },
    { "etapa": "Desenvolvimento", "tempo_minutos": "", "descricao": "" },
    { "etapa": "Fechamento", "tempo_minutos": "", "descricao": "" }
  ],
  "atividade_principal": "",
  "avaliacao_rapida": "",
  "observacoes_para_o_professor": ""
}`;

    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "PlanoReal",
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenRouter API Error:", errorData);
      throw new Error("Erro ao chamar API de IA");
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    let planoJSON;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        planoJSON = JSON.parse(jsonMatch[0]);
      } else {
        planoJSON = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Erro ao parsear JSON:", parseError);
      console.error("Conteúdo recebido:", content);
      throw new Error("Resposta da IA não está em formato JSON válido");
    }

    res.json(planoJSON);
  } catch (error) {
    console.error("Erro no servidor:", error);
    res
      .status(500)
      .json({ error: error.message || "Erro ao gerar plano de aula" });
  }
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
