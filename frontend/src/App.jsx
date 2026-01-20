import { useState } from "react";
import Formulario from "./components/Formulario";
import PlanoAula from "./components/PlanoAula";

function App() {
  const [planoAula, setPlanoAula] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setPlanoAula(null);

    try {
      const response = await fetch(`${API_URL}/api/gerar-plano`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erro ao gerar plano de aula");
      }

      const data = await response.json();
      setPlanoAula(data);
    } catch (err) {
      setError(err.message || "Erro ao gerar plano de aula. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPlanoAula(null);
    setError(null);
  };

  return (
    <div className="container">
      <h1>PlanoReal</h1>
      <p
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "var(--color-text-light)",
        }}
      >
        Planejador de Aula Realista para Professores
      </p>

      {error && <div className="error">{error}</div>}

      {!planoAula ? (
        <>
          <div className="card">
            <Formulario onSubmit={handleSubmit} loading={loading} />
          </div>
        </>
      ) : (
        <>
          <div className="card">
            <PlanoAula plano={planoAula} onReset={handleReset} />
          </div>
        </>
      )}

      {loading && <div className="loading">Gerando seu plano de aula...</div>}
    </div>
  );
}

export default App;
