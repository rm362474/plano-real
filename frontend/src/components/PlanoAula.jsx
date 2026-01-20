import { useRef } from "react";
import jsPDF from "jspdf";

function PlanoAula({ plano, onReset }) {
  const planoRef = useRef(null);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    doc.setFontSize(18);
    doc.text("Plano de Aula", margin, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    doc.text("Objetivo da Aula", margin, yPosition);
    yPosition += 8;
    doc.setFontSize(11);
    const objetivoLines = doc.splitTextToSize(
      plano.objetivo_da_aula || "",
      pageWidth - 2 * margin,
    );
    objetivoLines.forEach((line) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(line, margin, yPosition);
      yPosition += 6;
    });
    yPosition += 5;

    doc.setFontSize(14);
    if (yPosition > 260) {
      doc.addPage();
      yPosition = margin;
    }
    doc.text("Estrutura da Aula", margin, yPosition);
    yPosition += 8;

    if (plano.estrutura && Array.isArray(plano.estrutura)) {
      plano.estrutura.forEach((etapa) => {
        if (yPosition > 260) {
          doc.addPage();
          yPosition = margin;
        }

        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text(
          `${etapa.etapa} (${etapa.tempo_minutos} min)`,
          margin,
          yPosition,
        );
        yPosition += 7;

        doc.setFontSize(11);
        doc.setFont(undefined, "normal");
        const descLines = doc.splitTextToSize(
          etapa.descricao || "",
          pageWidth - 2 * margin,
        );
        descLines.forEach((line) => {
          if (yPosition > 270) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(line, margin, yPosition);
          yPosition += 6;
        });
        yPosition += 3;
      });
    }

    if (plano.atividade_principal) {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = margin;
      }
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Atividade Principal", margin, yPosition);
      yPosition += 8;
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      const atividadeLines = doc.splitTextToSize(
        plano.atividade_principal,
        pageWidth - 2 * margin,
      );
      atividadeLines.forEach((line) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    if (plano.avaliacao_rapida) {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = margin;
      }
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Avaliação Rápida", margin, yPosition);
      yPosition += 8;
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      const avaliacaoLines = doc.splitTextToSize(
        plano.avaliacao_rapida,
        pageWidth - 2 * margin,
      );
      avaliacaoLines.forEach((line) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
      yPosition += 5;
    }

    if (plano.observacoes_para_o_professor) {
      if (yPosition > 260) {
        doc.addPage();
        yPosition = margin;
      }
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("Observações para o Professor", margin, yPosition);
      yPosition += 8;
      doc.setFontSize(11);
      doc.setFont(undefined, "normal");
      const obsLines = doc.splitTextToSize(
        plano.observacoes_para_o_professor,
        pageWidth - 2 * margin,
      );
      obsLines.forEach((line) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = margin;
        }
        doc.text(line, margin, yPosition);
        yPosition += 6;
      });
    }

    doc.save("plano-de-aula.pdf");
  };

  return (
    <div className="plano-aula" ref={planoRef}>
      <h2>Plano de Aula Gerado</h2>

      <div className="plano-section">
        <h3>Objetivo da Aula</h3>
        <p>{plano.objetivo_da_aula}</p>
      </div>

      <div className="plano-section">
        <h3>Estrutura da Aula</h3>
        {plano.estrutura &&
          Array.isArray(plano.estrutura) &&
          plano.estrutura.map((etapa, index) => (
            <div key={index} className="etapa-item">
              <div className="etapa-title">{etapa.etapa}</div>
              <div className="etapa-tempo">
                Tempo: {etapa.tempo_minutos} minutos
              </div>
              <div className="etapa-descricao">{etapa.descricao}</div>
            </div>
          ))}
      </div>

      {plano.atividade_principal && (
        <div className="plano-section">
          <h3>Atividade Principal</h3>
          <div className="info-box">
            <p>{plano.atividade_principal}</p>
          </div>
        </div>
      )}

      {plano.avaliacao_rapida && (
        <div className="plano-section">
          <h3>Avaliação Rápida</h3>
          <div className="info-box">
            <p>{plano.avaliacao_rapida}</p>
          </div>
        </div>
      )}

      {plano.observacoes_para_o_professor && (
        <div className="plano-section">
          <h3>Observações para o Professor</h3>
          <div className="info-box">
            <p>{plano.observacoes_para_o_professor}</p>
          </div>
        </div>
      )}

      <button onClick={downloadPDF} className="btn btn-primary">
        Baixar PDF
      </button>
      <button
        onClick={onReset}
        className="btn btn-secondary"
        style={{ width: "100%" }}
      >
        Gerar Novo Plano
      </button>
    </div>
  );
}

export default PlanoAula;
