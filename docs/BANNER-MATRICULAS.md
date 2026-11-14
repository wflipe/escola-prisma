# Banner "Matrículas abertas"

Implementado em 13/11/2026 na branch `fix/correcoes-e-banner-matriculas`.

## Decisões

| Decisão | Escolha | Por quê |
| --- | --- | --- |
| Posição | Faixa logo **depois do Hero** (`#matriculas`) | É vista por todo visitante ao rolar e não cobre o conteúdo. O Google penaliza pop-ups que cobrem a página no celular ("intersticiais intrusivos"). |
| Formato | **Horizontal** no tablet/computador (a partir de 768px) e **vertical** no celular | A troca é automática, só com CSS (sem JavaScript): o banner se ajusta à largura da tela. |
| Arte | Feita no próprio site (HTML + CSS), sem imagem | O texto é legível para Google e IAs, carrega instantaneamente, é nítido em qualquer tela e muda editando um arquivo de texto. |
| Cores | Degradê dourado `#F9B91A` → laranja `#F67A21`, texto azul-marinho `#152E65` | São as cores da marca (logo). O azul sobre o dourado/laranja tem bom contraste de leitura. |

## Layout

```
CELULAR (vertical)                 COMPUTADOR (horizontal)
┌──────────────────────┐           ┌──────────────────────────────────────────────┐
│ ● MATRÍCULAS ABERTAS │           │ ● MATRÍCULAS ABERTAS          ┌────────────┐ │
│ Matrículas 2027      │           │ Matrículas 2027 abertas       │✓ Ed. Inf.  │ │
│ abertas              │           │ Da Educação Infantil ao...    │✓ Fund. I   │ │
│ Da Educação Infantil │           │ [Garanta a vaga…] [Visita]    │✓ Fund. II  │ │
│ ao Ensino Médio...   │           │ Atendimento pelo WhatsApp...  │✓ E. Médio  │ │
│ [  Garanta a vaga  ] │           │                          2027 └────────────┘ │
│ [Agendar uma visita] │           └──────────────────────────────────────────────┘
│ ✓ Ed. Inf ✓ Fund. I  │
│ ✓ Fund.II ✓ E. Médio │
└──────────────────────┘
```

## Arquivos

| Arquivo | Função |
| --- | --- |
| `src/content/site/matriculas.json` | **Todo o texto do banner e da faixa do topo.** É o único arquivo que precisa ser editado no dia a dia. |
| `src/components/layout/EnrollmentStrip.astro` | Faixa fina no topo do site (ver seção abaixo). |
| `src/components/sections/EnrollmentBanner.astro` | Estrutura e estilos (vertical/horizontal). |
| `src/pages/index.astro` | Posição do banner na página (logo após `<Hero />`). |

## Como editar

Em `src/content/site/matriculas.json`:

| Campo | Exemplo | O que faz |
| --- | --- | --- |
| `ativo` | `true` / `false` | **`false` esconde o banner** quando as matrículas fecharem, sem apagar nada. |
| `selo` | `Matrículas abertas` | Etiqueta azul com o ponto verde piscando. |
| `titulo` | `Matrículas 2027 abertas` | Título principal. |
| `tituloDestaque` | `2027` | Parte do título em itálico branco. Também aparece como marca d'água grande ao fundo. |
| `texto` | ... | Parágrafo de apoio. |
| `etapas` | lista | Etapas com vaga. Remova as que lotarem. |
| `cta.text` | `Garanta a vaga do seu filho` | Texto do botão principal (azul) no computador/tablet. |
| `cta.textCurto` | `Garanta a vaga` | Texto do botão principal no celular (abaixo de 640px), igual à faixa do topo. Apague para usar sempre o `text`. |
| `cta.whatsappAssunto` | ... | Assunto da mensagem do WhatsApp do botão principal. |
| `ctaSecundario` | ... | Botão branco. Apague o bloco para esconder. |
| `observacao` | ... | Texto pequeno abaixo dos botões. Apague para esconder. |

**Virada de ano:** troque `2027` em `titulo`, `tituloDestaque` e `cta.whatsappAssunto`.

Depois de editar: commit → push → a Vercel publica sozinha. Confira no deploy de preview.

## Rastreamento (GA4)

| Botão | `data-ga4-event` | `data-ga4-location` |
| --- | --- | --- |
| Principal | `click_matricula` | `banner_matriculas` |
| Secundário | `click_agendar_visita` | `banner_matriculas` |

## Faixa no topo do site

Uma faixa fina dourado → laranja **acima da barra azul**, em todas as telas:

```
COMPUTADOR:  ● MATRÍCULAS 2027 ABERTAS · Garanta a vaga do seu filho →
CELULAR:     ● MATRÍCULAS 2027 ABERTAS · Garanta a vaga →
```

- **Por que uma faixa própria e não dentro da barra azul:** o aviso precisa de contraste para ser notado (texto branco no azul se confunde com o resto do topo). Além disso, no celular a barra azul já está ocupada pelos botões "Serviço aos Pais" e "Portal do Aluno".
- **Clique:** leva ao banner (`/#matriculas`), que explica e tem os botões de WhatsApp. O banner tem `scroll-margin-top` para não ficar escondido atrás do cabeçalho fixo.
- **Rola com a página** (não é fixa), para não ocupar espaço o tempo todo no celular.
- **Arquivo:** `src/components/layout/EnrollmentStrip.astro`, incluído no `BaseLayout` antes da `TopBar`.
- **Texto:** bloco `faixaTopo` em `matriculas.json`:

| Campo | Exemplo | O que faz |
| --- | --- | --- |
| `faixaTopo.ativo` | `true` / `false` | Liga/desliga só a faixa (o banner continua). |
| `faixaTopo.texto` | `Matrículas 2027 abertas` | Texto em destaque (maiúsculas). |
| `faixaTopo.chamada` | `Garanta a vaga do seu filho` | Chamada no computador/tablet. |
| `faixaTopo.chamadaCurta` | `Garanta a vaga` | Chamada no celular. |
| `faixaTopo.link` | `/#matriculas` | Destino do clique. |

> Desligar o banner (`"ativo": false` no topo do arquivo) desliga **também** a faixa.

Evento de clique: `click_faixa_matriculas` (local `faixa_topo`).

## Ideias para depois (não implementadas)

- **Data limite** ou "últimas vagas" no `texto`, somente se for verdade. Urgência falsa prejudica a confiança.
- **Foto real** da fachada nova ou de alunos ao lado das etapas (formato `.webp` em `src/assets/images/`).
