import React, { useState } from 'react';
import './App.css';
import generarCronograma from './algorithm';

function App() {
  const [N, setN] = useState(14); // Días trabajando
  const [M, setM] = useState(7); // Días descansando
  const [induccion, setInduccion] = useState(5); // Días inducción (1-5)
  const [totalDias, setTotalDias] = useState(90); // Total días perforación
  const [cronograma, setCronograma] = useState(null); // Resultado del algoritmo
  const [errores, setErrores] = useState([]); // Lista de errores
  const [isLoading, setIsLoading] = useState(false); // Estado para spinner

  const calcularCronograma = () => {
    setIsLoading(true);
    // Simular procesamiento asíncrono para UX
    setTimeout(() => {
      const result = generarCronograma(N, M, induccion, totalDias);
      if (result.error) {
        setErrores(result.error);
        setCronograma(null);
      } else {
        setErrores([]);
        setCronograma(result);
      }
      setIsLoading(false);
    }, 500); // 500ms para mostrar spinner
  };

  const renderTabla = () => {
    if (!cronograma) return null;

    const { s1, s2, s3 } = cronograma;
    const pCounts = [];
    let s3Activo = false;
    for (let i = 0; i < totalDias; i++) {
      let count = 0;
      if (s1[i] === 'P') count++;
      if (s2[i] === 'P') count++;
      if (s3[i] === 'P') count++;
      pCounts.push(count);
      if (s3[i] === 'P') s3Activo = true;
    }

    return (
      <section aria-labelledby="cronograma-section">
        <div className="card shadow-sm">
          <div className="card-header bg-success text-white">
            <h2 id="cronograma-section" className="h5 mb-0">Cronograma Generado</h2>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-bordered table-sm mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Supervisor</th>
                    {Array.from({ length: totalDias }, (_, i) => <th key={i} scope="col">Día {i}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">S1</th>
                    {s1.map((estado, i) => <td key={i} className={`estado ${estado}`}>{estado || '-'}</td>)}
                  </tr>
                  <tr>
                    <th scope="row">S2</th>
                    {s2.map((estado, i) => <td key={i} className={`estado ${estado}`}>{estado || '-'}</td>)}
                  </tr>
                  <tr>
                    <th scope="row">S3</th>
                    {s3.map((estado, i) => <td key={i} className={`estado ${estado}`}>{estado || '-'}</td>)}
                  </tr>
                  <tr>
                    <th scope="row">#P</th>
                    {pCounts.map((count, i) => (
                      <td key={i} className={s3Activo && count !== 2 ? 'table-danger' : ''}>
                        {count}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div className="container mt-5">
      <header className="text-center mb-4">
        <h1 className="display-4">Cronograma de Supervisores de Perforación</h1>
        <p className="lead">Genera y visualiza cronogramas automáticos cumpliendo reglas mineras.</p>
      </header>

      <section aria-labelledby="config-section">
        <div className="card shadow-sm mb-4">
          <div className="card-header bg-primary text-white">
            <h2 id="config-section" className="h5 mb-0">Configuración del Cronograma</h2>
          </div>
          <div className="card-body">
            <form>
              <fieldset className="row g-3">
                <div className="col-md-6">
                  <label htmlFor="regimen-n" className="form-label">Régimen N (días trabajando)</label>
                  <input
                    id="regimen-n"
                    type="number"
                    className="form-control"
                    value={N}
                    onChange={(e) => setN(Number(e.target.value))}
                    placeholder="Ej: 14"
                    min="1"
                    aria-describedby="regimen-n-help"
                  />
                  <div id="regimen-n-help" className="form-text">Número de días en el ciclo de trabajo.</div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="regimen-m" className="form-label">Régimen M (días descansando)</label>
                  <input
                    id="regimen-m"
                    type="number"
                    className="form-control"
                    value={M}
                    onChange={(e) => setM(Number(e.target.value))}
                    placeholder="Ej: 7"
                    min="1"
                    aria-describedby="regimen-m-help"
                  />
                  <div id="regimen-m-help" className="form-text">Número de días en el ciclo de descanso.</div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="induccion" className="form-label">Días de inducción (1-5)</label>
                  <input
                    id="induccion"
                    type="number"
                    className="form-control"
                    value={induccion}
                    min="1"
                    max="5"
                    onChange={(e) => setInduccion(Number(e.target.value))}
                    placeholder="Ej: 5"
                    aria-describedby="induccion-help"
                  />
                  <div id="induccion-help" className="form-text">Días de capacitación inicial para nuevos supervisores.</div>
                </div>
                <div className="col-md-6">
                  <label htmlFor="total-dias" className="form-label">Total días de perforación</label>
                  <input
                    id="total-dias"
                    type="number"
                    className="form-control"
                    value={totalDias}
                    onChange={(e) => setTotalDias(Number(e.target.value))}
                    placeholder="Ej: 90"
                    min="1"
                    aria-describedby="total-dias-help"
                  />
                  <div id="total-dias-help" className="form-text">Duración total del período a cubrir.</div>
                </div>
              </fieldset>
              <div className="d-grid mt-3">
                <button
                  className="btn btn-lg btn-primary"
                  onClick={calcularCronograma}
                  disabled={isLoading}
                  aria-describedby="button-help"
                >
                  {isLoading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Calculando...
                    </>
                  ) : (
                    'Calcular Cronograma'
                  )}
                </button>
                <div id="button-help" className="form-text text-center">Genera el cronograma basado en los parámetros.</div>
              </div>
            </form>
          </div>
        </div>
      </section>

      {errores.length > 0 && (
        <section aria-labelledby="errores-section">
          <div className="alert alert-danger" role="alert">
            <h2 id="errores-section" className="alert-heading h5">Errores Detectados</h2>
            <ul className="mb-0">
              {errores.map((err, i) => <li key={i}>{err}</li>)}
            </ul>
          </div>
        </section>
      )}

      {renderTabla()}
    </div>
  );
}

export default App;
