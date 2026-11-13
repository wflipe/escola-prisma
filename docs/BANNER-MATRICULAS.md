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
│ Da Educação Infantil │           │ [Garantir a vaga] [Visita →]  │✓ Fund. II  │ │
│ ao Ensino Médio...   │           │ Atendimento pelo WhatsApp...  │✓ E. Médio  │ │
│ [Garantir a vaga   ] │           │                          2027 └────────────┘ │
│ [Agendar uma visita] │           └──────────────────────────────────────────────┘
│ ✓ Ed. Inf ✓ Fund. I  │
│ ✓ Fund.II ✓ E. Médio │
└──────────────────────┘
```

## Arquivos

| Arquivo | Função |
| --- | --- |
| `src/content/site/matriculas.json` | **Todo o texto do banner.** É o único arquivo que precisa ser editado no dia a dia. |
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
| `cta.text` / `cta.whatsappAssunto` | ... | Botão principal (azul) e o assunto da mensagem do WhatsApp. |
| `ctaSecundario` | ... | Botão branco. Apague o bloco para esconder. |
| `observacao` | ... | Texto pequeno abaixo dos botões. Apague para esconder. |

**Virada de ano:** troque `2027` em `titulo`, `tituloDestaque` e `cta.whatsappAssunto`.

Depois de editar: commit → push → a Vercel publica sozinha. Confira no deploy de preview.

## Rastreamento (GA4)

| Botão | `data-ga4-event` | `data-ga4-location` |
| --- | --- | --- |
| Principal | `click_matricula` | `banner_matriculas` |
| Secundário | `click_agendar_visita` | `banner_matriculas` |

## Ideias para depois (não implementadas)

- **Aviso fino no topo** ("Matrículas 2027 abertas →") na TopBar, levando a `#matriculas`.
- **Data limite** ou "últimas vagas" no `texto`, somente se for verdade. Urgência falsa prejudica a confiança.
- **Foto real** da fachada nova ou de alunos ao lado das etapas (formato `.webp` em `src/assets/images/`).
