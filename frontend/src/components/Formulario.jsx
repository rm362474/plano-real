import { useState } from "react";

function Formulario({ onSubmit, loading }) {
  const [formData, setFormData] = useState({
    assunto: "",
    serie: "",
    duracao: "",
    objetivo: [],
    recursos: [],
    perfilTurma: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e, type) => {
    const { value, checked } = e.target;
    const NENHUM_RECURSO_ALEM_PROFESSOR = "Nenhum recurso além do professor";
    setFormData((prev) => {
      const prevList = prev[type];
      const nextList = checked
        ? [...prevList, value]
        : prevList.filter((item) => item !== value);

      if (type === "recursos") {
        if (value === NENHUM_RECURSO_ALEM_PROFESSOR) {
          return {
            ...prev,
            recursos: checked ? [NENHUM_RECURSO_ALEM_PROFESSOR] : [],
          };
        }

        return {
          ...prev,
          recursos: nextList.filter((r) => r !== NENHUM_RECURSO_ALEM_PROFESSOR),
        };
      }

      return {
        ...prev,
        [type]: nextList,
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação: pelo menos um objetivo deve ser selecionado
    if (formData.objetivo.length === 0) {
      alert("Por favor, selecione pelo menos um objetivo pedagógico.");
      return;
    }

    onSubmit(formData);
  };

  const recursosOptions = [
    "Nenhum recurso além do professor",
    "Quadro e giz/caneta",
    "Quadro branco e pincel",
    "Papel impresso",
    "Livro didático",
    "Projetor",
    "Datashow",
    "Computador",
    "Internet",
    "Celular dos alunos",
    "Tablet",
    "Material manipulável",
    "Cartazes e murais",
    "Vídeos",
    "Áudio (música, podcasts)",
    "Jogos educativos",
    "Laboratório",
    "Biblioteca",
    "Quadra esportiva",
    "Pátio",
  ];

  const perfilTurmaOptions = [
    "Turma agitada",
    "Turma participativa",
    "Turma calma",
    "Turma numerosa",
    "Turma pequena",
    "Dificuldade de leitura",
    "Dificuldade de escrita",
    "Dificuldade de concentração",
    "Alto engajamento",
    "Baixo engajamento",
    "Níveis mistos de conhecimento",
    "Turma com necessidades especiais",
    "Turma bilíngue",
    "Alunos com defasagem",
    "Alunos avançados",
  ];

  const serieOptions = [
    "1º ano EF",
    "2º ano EF",
    "3º ano EF",
    "4º ano EF",
    "5º ano EF",
    "6º ano EF",
    "7º ano EF",
    "8º ano EF",
    "9º ano EF",
    "1º ano EM",
    "2º ano EM",
    "3º ano EM",
  ];

  const objetivoOptions = [
    "Introdução ao tema",
    "Compreensão básica",
    "Aprofundamento do conteúdo",
    "Revisão",
    "Fixação de conteúdo",
    "Aplicação prática",
    "Síntese e conclusão",
    "Preparação para avaliação",
    "Desenvolvimento de habilidades",
    "Interdisciplinaridade",
  ];

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="assunto">Assunto da aula *</label>
        <input
          type="text"
          id="assunto"
          name="assunto"
          value={formData.assunto}
          onChange={handleChange}
          placeholder="Ex: Revolução Industrial em História, Frações em Matemática"
          required
        />
        <small
          style={{
            color: "var(--color-text-light)",
            fontSize: "0.875rem",
            display: "block",
            marginTop: "0.5rem",
          }}
        >
          Informe o tema e a disciplina (ex: "Fotossíntese em Ciências" ou
          "Segunda Guerra Mundial em História")
        </small>
      </div>

      <div className="form-group">
        <label htmlFor="serie">Ano/Série *</label>
        <select
          id="serie"
          name="serie"
          value={formData.serie}
          onChange={handleChange}
          required
        >
          <option value="">Selecione uma série</option>
          {serieOptions.map((serie) => (
            <option key={serie} value={serie}>
              {serie}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="duracao">Duração da aula (minutos) *</label>
        <input
          type="number"
          id="duracao"
          name="duracao"
          value={formData.duracao}
          onChange={handleChange}
          placeholder="Ex: 45, 50, 100"
          min="1"
          max="480"
          required
        />
        <small
          style={{
            color: "var(--color-text-light)",
            fontSize: "0.875rem",
            display: "block",
            marginTop: "0.5rem",
          }}
        >
          Informe a duração em minutos (ex: 45, 50, 100)
        </small>
      </div>

      <div className="form-group">
        <label>Objetivos pedagógicos *</label>
        <div className="checkbox-group">
          {objetivoOptions.map((objetivo) => (
            <div key={objetivo} className="checkbox-item">
              <input
                type="checkbox"
                id={`objetivo-${objetivo}`}
                value={objetivo}
                checked={formData.objetivo.includes(objetivo)}
                onChange={(e) => handleCheckboxChange(e, "objetivo")}
              />
              <label
                htmlFor={`objetivo-${objetivo}`}
                style={{ marginBottom: 0, fontWeight: "normal" }}
              >
                {objetivo}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Recursos disponíveis</label>
        <div className="checkbox-group">
          {recursosOptions.map((recurso) => (
            <div key={recurso} className="checkbox-item">
              <input
                type="checkbox"
                id={`recurso-${recurso}`}
                value={recurso}
                checked={formData.recursos.includes(recurso)}
                onChange={(e) => handleCheckboxChange(e, "recursos")}
              />
              <label
                htmlFor={`recurso-${recurso}`}
                style={{ marginBottom: 0, fontWeight: "normal" }}
              >
                {recurso}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label>Perfil da turma</label>
        <div className="checkbox-group">
          {perfilTurmaOptions.map((perfil) => (
            <div key={perfil} className="checkbox-item">
              <input
                type="checkbox"
                id={`perfil-${perfil}`}
                value={perfil}
                checked={formData.perfilTurma.includes(perfil)}
                onChange={(e) => handleCheckboxChange(e, "perfilTurma")}
              />
              <label
                htmlFor={`perfil-${perfil}`}
                style={{ marginBottom: 0, fontWeight: "normal" }}
              >
                {perfil}
              </label>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Gerando plano..." : "Gerar Plano de Aula"}
      </button>
    </form>
  );
}

export default Formulario;
