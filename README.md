# Treino Hipertrofia

App pessoal de treino para ganho de massa muscular. Funciona no navegador do celular, instala na tela inicial e roda offline.

## Funções

* Hoje: mostra o treino do dia, registra carga e repetições por série e dispara o timer de descanso.
* Sugestão de carga por dupla progressão: bateu o topo da faixa de reps em todas as séries, o app manda subir a carga.
* Semana: define o treino de cada dia e conta as séries semanais por grupo muscular (referência de 10 a 20).
* Treinos: edita exercícios, séries, faixa de reps, descanso, observações e vídeos.
* Busca (aba Treinos): encontre qualquer exercício pelo nome ou grupo muscular, sem precisar de acento. Mostra em que dia ele aparece e abre o vídeo.
* Vídeos: envie vários arquivos do celular de uma vez em Treinos. O app liga cada vídeo ao exercício pelo nome do arquivo. Também aceita link do YouTube, Google Drive ou da pasta videos/ deste repositório.
* Foco do mês (aba Semana): escolha os grupos a priorizar. Eles ganham 1 série por exercício e abrem o treino. Os demais mantêm as séries e a carga.
* Meus dados (aba Medidas): altura, peso e data de nascimento. A idade é calculada sozinha e o peso vem das medidas mais recentes.
* Medidas: registre peso, gordura e circunferências todo mês e veja a variação contra o mês anterior e contra o início.
* Evolução das cargas (aba Histórico): gráfico da maior carga por exercício, variação desde o início, 1RM estimado e registro manual de cargas.
* Recorde: o treino avisa quando você supera sua maior carga no exercício.
* Histórico: treinos salvos com séries e volume total, mais backup em JSON.

## Como usar

1. Publique a pasta com GitHub Pages (Settings > Pages > branch e pasta raiz).
2. Abra o link no celular.
3. iPhone: Compartilhar > Adicionar à Tela de Início. Android: menu > Instalar app.

Para testar no computador: `python3 -m http.server` na pasta e abra http://localhost:8000.

Os dados ficam no próprio aparelho. Use Exportar backup na aba Histórico com frequência.
