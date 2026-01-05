// algorithm.js - Algoritmo para generar cronograma de supervisores
// Traducción del pseudocódigo a JavaScript

// Función para generar ciclo base fijo para S1
function generarCicloS1(N, M, D_ind, total_days) {
  const ciclo_length = N + M;
  const schedule_S1 = new Array(total_days).fill('');

  for (let dia = 0; dia < total_days; dia++) {

    const ciclo_dia = dia % ciclo_length;

    if (dia < D_ind) {
      schedule_S1[dia] = 'I'; // Inducción inicial

    } else if (ciclo_dia < N - 1) {
      schedule_S1[dia] = 'P'; // Perfora mayoría del tiempo trabajando
    } else if (ciclo_dia === N - 1) {
      schedule_S1[dia] = 'S'; // Supervisa último día trabajando
    } else {
      schedule_S1[dia] = 'D'; // Descansa
    }

  }
 
  return schedule_S1;
}

// Función para calcular día de bajada de S1 y entrada de S3
function calcularEntradaS3(N, D_ind) {
  const dia_bajada_S1 = D_ind + N;
  const dia_subida_S3 = dia_bajada_S1;
  const dia_empieza_perforar_S3 = dia_subida_S3 + D_ind;
  return { dia_subida_S3, dia_empieza_perforar_S3 };
}

// Función para generar ciclo base para S3
function generarCicloS3(N, M, D_ind, dia_subida_S3, dia_empieza_perforar_S3, total_days) {
  const ciclo_length = N + M;
  const schedule_S3 = new Array(total_days).fill('');

  for (let dia = dia_subida_S3; dia < total_days; dia++) {
    const ciclo_dia = (dia - dia_subida_S3) % ciclo_length;

    if (dia < dia_subida_S3 + D_ind) {
      schedule_S3[dia] = 'I'; // Inducción después de subir
    } else if (ciclo_dia < N - 1) {
      schedule_S3[dia] = 'P'; // Perfora una vez capacitado
    } else if (ciclo_dia === N - 1) {
      schedule_S3[dia] = 'S'; // Supervisa
    } else {
      schedule_S3[dia] = 'D'; // Descansa
    }
  }
  return schedule_S3;
}

// Función para generar ciclo base para S2
function generarCicloS2(N, M, total_days) {
  const ciclo_length = N + M;
  const schedule_S2 = new Array(total_days).fill('');

  for (let dia = 0; dia < total_days; dia++) {
    const ciclo_dia = dia % ciclo_length;

    if (ciclo_dia < N - 1) {
      schedule_S2[dia] = 'P'; // Perfora en trabajando
    } else if (ciclo_dia === N - 1) {
      schedule_S2[dia] = 'S'; // Supervisa
    } else {
      schedule_S2[dia] = 'D'; // Descansa
    }
  }
 

  return schedule_S2;
}

// Función para contar perforadores por día
function contarPerforadoresPorDia(schedule_S1, schedule_S2, schedule_S3, dia) {
  let conteo = 0;
  if (schedule_S1[dia] === 'P') conteo++;
  if (schedule_S2[dia] === 'P') conteo++;
  if (schedule_S3[dia] === 'P') conteo++;
  return conteo;
}

// Función para ajustar cronograma
function ajustarCronograma(schedule_S1, schedule_S2, schedule_S3, total_days) {
  let dias_invalidos = [];
  for (let dia = 0; dia < total_days; dia++) {
    const conteo = contarPerforadoresPorDia(schedule_S1, schedule_S2, schedule_S3, dia);
    if (conteo !== 2) dias_invalidos.push(dia);
  }
  console.log("****dias_invalidos**",dias_invalidos.length)
  // Agregar límite de seguridad para evitar bucle infinito
  const MAX_ITERACIONES = 10000;
  let iteraciones = 0;

  while (dias_invalidos.length > 0 && iteraciones < MAX_ITERACIONES) {
    let huboCambios = false;  // Bandera para detectar si se hicieron cambios reales
    iteraciones++;  // Contador de iteraciones

    for (const dia of dias_invalidos) {

      console.log("****schedule_S2[dia] **",schedule_S2[dia] )

      const conteo = contarPerforadoresPorDia(schedule_S1, schedule_S2, schedule_S3, dia);
      if (conteo < 2) {
        if (schedule_S2[dia] !== 'P') {
          schedule_S2[dia] = 'P'; // Ajuste: S2 cubre hueco
          huboCambios = true;  // Marcar que hubo un cambio
        }
        if (schedule_S3[dia] !== 'P' && schedule_S3[dia] !== 'S') {
          schedule_S3[dia] = 'P'; // Ajuste: S3 cubre hueco si en I o D
          huboCambios = true;  // Marcar que hubo un cambio
        }
      } else if (conteo > 2) {
        if (schedule_S2[dia] === 'P' && (schedule_S1[dia] === 'P' || schedule_S3[dia] === 'P')) {
          schedule_S2[dia] = 'D'; // Ajuste: S2 se acorta
          huboCambios = true;  // Marcar que hubo un cambio
        }
      }
    }

    // Salida segura si no hubo cambios en esta iteración
    if (!huboCambios) break;

    dias_invalidos = [];
    for (let dia = 0; dia < total_days; dia++) {
      const conteo = contarPerforadoresPorDia(schedule_S1, schedule_S2, schedule_S3, dia);
      if (conteo !== 2) dias_invalidos.push(dia);
    }
  }
  return { schedule_S1, schedule_S2, schedule_S3 };
}

// Función principal
function generarCronograma(N, M, D_ind, total_days) {

  let schedule_S1 = generarCicloS1(N, M, D_ind, total_days);


  const { dia_subida_S3, dia_empieza_perforar_S3 } = calcularEntradaS3(N, D_ind);

  let schedule_S3 = generarCicloS3(N, M, D_ind, dia_subida_S3, dia_empieza_perforar_S3, total_days);



  let schedule_S2 = generarCicloS2(N, M, total_days);

  ({ schedule_S1, schedule_S2, schedule_S3 } = ajustarCronograma(schedule_S1, schedule_S2, schedule_S3, total_days));


  // Validaciones
  const errores = [];
  let s3_activo = false;
  for (let dia = 0; dia < total_days; dia++) {
    const conteo = contarPerforadoresPorDia(schedule_S1, schedule_S2, schedule_S3, dia);


    if (s3_activo && conteo !== 2) {
      errores.push(`Día ${dia}: ${conteo} perforando`);
    }
    if (schedule_S3[dia] === 'P') s3_activo = true;
  }

  if (errores.length > 0) {
    return { error: errores };
  }
  return { s1: schedule_S1, s2: schedule_S2, s3: schedule_S3 };
}

export default generarCronograma;