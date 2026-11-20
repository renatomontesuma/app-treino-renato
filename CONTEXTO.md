# Contexto do projeto (leia antes de mudar algo)

Este arquivo resume tudo o que foi decidido na primeira sessão de desenvolvimento, feita na nuvem. Uma nova sessão deve ler este arquivo e o README antes de qualquer alteração.

## O que é o app

App pessoal de treino para hipertrofia (ganho de massa muscular). Página web instalável no celular (PWA), sem servidor e sem login. Tudo em HTML, CSS e JavaScript puro, sem build.

* `index.html`, `style.css`, `app.js`: o app.
* `sw.js`: cache offline. Suba a versão do cache (`treino-vN`) e `APP_BUILD` em `app.js` (mesmo número) a cada mudança de arquivo do app. A versão aparece no fim da aba Histórico. O app procura versão nova sempre que volta à tela e recarrega sozinho (durante um treino só mostra um aviso). Isso existe porque o iPhone retoma o app do segundo plano sem recarregar.
* `manifest.json`, `icons/`: instalação na tela inicial. Ícone do usuário (WENUTRI fitness), gerado de `icone.png` (1080 px, fora do Git) com ffmpeg: `apple-touch-icon.png` 180 px para o iPhone, 192 e 512 px e uma versão `maskable` com margem para o Android. `icon.svg` é o ícone antigo, sem uso.
* Publicação: GitHub Pages ativo (repositório público) a partir do branch `claude/eager-thompson-l53kq5`, pasta raiz. Endereço: https://renatomontesuma.github.io/app-treino-renato/

## Onde ficam os dados

* `localStorage`, chave `treino-hipertrofia-v1`: plano, semana, histórico de cargas, medidas, foco do mês e perfil (`profile`: altura em cm e data de nascimento; o peso vem de `measures`).
* IndexedDB `treino-videos`: vídeos enviados pelo celular (chave = id do exercício) e vídeos longos (chave `src_...`).
* Os dados ficam só no aparelho. Backup em JSON na aba Histórico.

## Preferências do usuário (respeitar sempre)

* Padrão de séries: 3 séries de 6 a 10 repetições em todos os exercícios.
* Exceção: Abdominal na máquina, 5 séries de 60 repetições, sem carga. Faz todos os dias: está no fim de todos os treinos. `ensureDailyAbs()` roda a cada abertura do app e coloca o abdominal em qualquer treino que não tenha.
* Supinos e roscas com halteres: registrar o peso de cada halter.
* Treina de segunda a sábado. Domingo às vezes (treino opcional).
* Quer usar vídeos próprios gravados na academia. Enquanto não grava, usa vídeo de exemplo do YouTube.
* Medidas do braço: relaxado (`bracoD`, `bracoE`) e contraído com o braço levantado, pose de mostrar o bíceps (`bracoDC`, `bracoEC`). Medidas antigas de braço ficaram como relaxado.
* Textos do app e respostas em português, linguagem simples e direta.

## Semana atual (plano versão 7)

| Dia | Treino |
| --- | --- |
| Segunda | Empurrar: peito, ombros e tríceps |
| Terça | Puxar: costas e bíceps |
| Quarta | Pernas completo |
| Quinta | Superiores |
| Sexta | Inferiores e abdômen |
| Sábado | Ombros e braços |
| Domingo | Descanso, com treino opcional de abdômen e panturrilhas |

Cada grupo treina 2 vezes por semana, com pelo menos 48 h entre os estímulos.

## Trocas feitas para refletir os aparelhos da academia

* Supino reto com barra e supino inclinado com barra → Supino reto com halteres.
* Remada curvada → Remada cavalinho apoiada.
* Remada baixa → Remada sentada articulada.
* Puxada frontal (polia) → Puxada articulada (máquina de anilhas).
* Desenvolvimento com halteres → Desenvolvimento na máquina, na segunda (Empurrar) e no sábado (Ombros e braços).
* Rosca alternada → Rosca simultânea sentado.
* Prancha removida.

## Migrações do plano salvo no celular

O celular guarda o plano antigo. Cada mudança no plano padrão precisa de uma migração em `load()` (`app.js`), controlada por `planVersion` (`PLAN_VERSION`, hoje 11):

* v2: séries 3 × 6–10 e abdominal 5 × 60.
* v3: links do YouTube (`VIDEOS_INTERNET`) só onde não há link.
* v4, v5, v6: trocas de exercício via `swapExercises()`. O histórico antigo fica separado (exId com prefixo) porque cargas de aparelhos diferentes não se comparam. Vídeo próprio, trecho do personal e link manual são mantidos.
* v7: semana de 6 dias, treino "Ombros e braços" e domingo opcional (`state.optional`).
* v8: Puxada frontal → Puxada articulada, para bater com o vídeo próprio `puxada-articulada`.
* v9: Abdominal na máquina no fim de todos os treinos que não tinham, copiando séries, link, trecho e observação do abdominal existente.
* v10: só no treino `ombros-bracos`, Desenvolvimento com halteres → Desenvolvimento na máquina, com histórico antigo separado (prefixo `halteres_`).
* v11: Desenvolvimento com halteres → Desenvolvimento na máquina em todos os treinos (na prática, a segunda).

Regra: nunca apagar histórico, vídeos ou links que o usuário colocou. Migrações só rodam sem treino em andamento.

## Vídeos

Prioridade no player: vídeo próprio (Meu vídeo) > vídeo do personal (clipe curto) > trecho do vídeo longo do personal > YouTube (Internet). O player mostra abas para alternar. Sem vídeo próprio, o botão diz "Personal" quando há vídeo do personal e "Exemplo" quando só há YouTube.

* Vídeo do personal: IndexedDB chave `pe_<id do exercício>`, flag `hasPersonal`. Enviado em Treinos > Enviar vídeos do personal (mesmo envio em lote, liga pelo nome do arquivo e repassa ao mesmo exercício em outros dias).
* `VÍDEOS PERSONAL` (fora do Git) segue o mesmo formato de `VÍDEOS RENATO`: uma subpasta por dia (`1 - SEGUNDA (Empurrar)` até `7 - DOMINGO opcional (...)`) com as versões processadas (960 px de altura, sem áudio) já com o nome do exercício do app, copiadas para cada dia em que o exercício aparece, e `_LISTA DO DIA.txt` (com vídeo do personal / sem, quando o app usa o YouTube). Os clipes originais (Instagram, com música) e o vídeo longo ficam em `ORIGINAIS (não enviar ao app)`. Processados: desenvolvimento-na-maquina, triceps-na-polia, triceps-frances, remada-cavalinho-apoiada (Remada T-bar), crucifixo-inverso, puxada-articulada e barra-fixa-ou-puxada (os dois da Puxada aberta), remada-unilateral (Remada serrote), elevacao-lateral-na-polia, crucifixo-na-polia (Crucifixo inclinado no cabo).
* Clipes do personal sem exercício igual no plano (não usados): Elevação lateral máquina, Extensão lombar no banco romano, Remada baixa no triângulo, Remada unilateral máquina, Rosca Scott máquina, Rosca bíceps na polia, Rosca no banco inclinado, Supino inclinado máquina, Supino reto articulado, Supino reto máquina, Tríceps corda na polia, Voador peitoral. IMG_6752.MP4 é o vídeo longo (15 min).

* Envio em lote (Treinos > Enviar meus vídeos) liga cada arquivo ao exercício pelo nome do arquivo e repassa o vídeo aos exercícios de mesmo nome em outros dias.
* Aba Semana > Exercícios de cada dia: lista completa por dia, com "Meu vídeo", "Exemplo" e "Gravar".
* Os vídeos do usuário NÃO vão para o Git. O repositório é público e os vídeos mostram o rosto dele e outros alunos. Pasta local: `VÍDEOS RENATO` (fora do Git).
* `VÍDEOS RENATO` tem uma subpasta por dia (`1 - SEGUNDA (Empurrar)` até `7 - DOMINGO opcional (...)`). Vídeo de exercício que aparece em mais de um dia vai copiado para cada dia. Cada pasta tem `_LISTA DO DIA.txt` com o que está gravado e o que falta (e o nome de arquivo esperado). Ao salvar um vídeo novo, coloque nas pastas certas e atualize as listas. Se o plano mudar de dia, reorganize as pastas.

Vídeos próprios já processados (6): supino-reto-com-halteres, puxada-articulada, remada-cavalinho-apoiada, remada-sentada-articulada, rosca-martelo, rosca-simultanea-sentado. Todos têm exercício com o mesmo nome no app (conferido no plano v8). Regra: o nome do arquivo é o nome do exercício no app, sem acento, em minúsculas e com hífens.

### Como processar um vídeo do iPhone

Os vídeos chegam em HEVC, muitas vezes em HDR (HLG), com 20 a 30 MB. Converter para H.264 SDR, sem áudio, com nome do exercício:

```
ffmpeg -i entrada.mov -an -vf "zscale=t=linear:npl=203,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,scale=-2:720,fps=30,format=yuv420p" -c:v libx264 -preset slow -crf 26 -profile:v high -movflags +faststart -color_primaries bt709 -color_trc bt709 -colorspace bt709 nome-do-exercicio.mp4
```

* Se o vídeo não for HDR (`color_transfer=bt709` no ffprobe), remova o trecho de `zscale`/`tonemap`.
* Corte o início com `-ss` se houver espera ou câmera se movendo. Corte o fim se houver marca do CapCut (tela preta no final).
* Resultado esperado: 1 a 4 MB por vídeo.

Na análise, comentar enquadramento (de lado, corpo inteiro, celular na altura do quadril), pessoas ao fundo e execução, sempre lembrando de confirmar a técnica com o personal.

## Pendências

* Gravar os 26 exercícios que ainda usam vídeo de exemplo (lista em Treinos > Falta gravar).
* Glúteos, panturrilhas e trapézio abaixo de 10 séries semanais. Avaliar com o usuário. (Abdômen resolvido: abdominal todos os dias.)


## Testes

Não há suíte de testes no repositório. Na sessão original, os testes foram feitos com Playwright (Chromium, perfil de iPhone 13) servindo a pasta com `python3 -m http.server`. Teste fluxos completos: instalação nova, migração de um plano salvo antigo, envio de vídeos e sessão de treino.
