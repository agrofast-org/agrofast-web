# Relatório de Testes — Agrofast Web

## Resumo Geral

| Arquivo de teste | Testes | Status |
|------------------|-------:|--------|
| `lib/utils.test.ts` | 29 | ✅ Todos passando |
| `lib/validations.test.ts` | 11 | ✅ Todos passando |
| `lib/nested.test.ts` | 16 | ✅ Todos passando |
| `service/env.test.ts` | 13 | ✅ Todos passando |
| `hooks/use-countdown.test.ts` | 10 | ✅ Todos passando |
| `hooks/use-debounce.test.ts` | 8 | ✅ Todos passando |
| **Total** | **87** | |

**Framework:** Vitest 2.1.9 + @testing-library/react 16 + happy-dom  
**Cobertura:** `npm run test:coverage`

---

## `src/__tests__/lib/utils.test.ts` — 29 testes

Testa funções utilitárias de `src/lib/utils.ts`.  
Mock: `@/service/env` (`isDevelopment → false`, `isIpAddress → false`, `getCurrentOrigin → http://localhost:3030`).

### `cn()` — 5 testes

| Teste | Descrição |
|-------|-----------|
| combina classes simples | `cn('a', 'b')` → `"a b"` |
| remove classes duplicadas com tailwind-merge | `cn('p-4', 'p-2')` → `"p-2"` (última vence) |
| ignora valores falsy | `cn('a', false, undefined, null)` → `"a"` |
| suporta expressões condicionais | `cn({ 'text-red': true, 'text-blue': false })` → `"text-red"` |
| retorna string vazia quando não há classes | `cn()` → `""` |

### `numberInputMask()` — 8 testes

| Teste | Entrada | Saída esperada |
|-------|---------|---------------|
| undefined | `undefined` | `""` |
| string vazia | `""` | `""` |
| apenas espaços | `"   "` | `""` |
| número BR 10 dígitos | `"1199998888"` | `"(11) 9999-8888"` |
| número BR 11 dígitos (celular) | `"11999998888"` | `"(11) 99999-8888"` |
| remove não-numéricos | `"(11) 9999-8888"` | `"(11) 9999-8888"` |
| limita a 19 chars de entrada | string com 25 dígitos | trunca antes de formatar |
| número internacional | `"5511999998888"` | `"+55 (11) 99999-8888"` |

### `isNumeric()` — 7 testes

| Teste | Entrada | Resultado |
|-------|---------|-----------|
| string numérica | `"12345"` | `true` |
| dígito único | `"0"` | `true` |
| com letras | `"123abc"` | `false` |
| mista | `"12 34"` | `false` |
| string vazia | `""` | `false` |
| ponto decimal | `"1.5"` | `false` |
| espaço | `" "` | `false` |

### `parseQueryDate()` — 4 testes

Converte datas do formato de query string (`DD-MM-YYYY`) para ISO (`YYYY-MM-DD`).

| Teste | Entrada | Saída esperada |
|-------|---------|---------------|
| formato DD-MM-YYYY | `"31-12-2025"` | `"2025-12-31"` |
| zeros à esquerda no mês | `"05-01-2024"` | `"2024-01-05"` |
| caso 01-06-2024 | `"01-06-2024"` | `"2024-06-01"` |
| formato ISO YYYY-MM-DD na saída | qualquer data válida | string no formato `YYYY-MM-DD` |

### Helpers de URL — 5 testes

| Teste | Função | Descrição |
|-------|--------|-----------|
| retorna string não vazia | `getBaseUrl()` | URL base não vazia |
| retorna URL válida com protocolo | `getBaseUrl()` | começa com `http://` ou `https://` |
| retorna URL com path /web | `getWebUrl()` | termina com `/web` |
| retorna URL com path /legal | `getLegalUrl()` | termina com `/legal` |
| retorna string não vazia | `getPortfolioUrl()` | URL de portfólio não vazia |

---

## `src/__tests__/lib/validations.test.ts` — 11 testes

Testa `validateBrowserAgent(token: string): boolean` de `src/lib/validations.ts`.  
A função valida se o token segue o formato UUID v4 (`xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx`).

| Teste | Entrada | Resultado |
|-------|---------|-----------|
| UUID v4 válido | `"550e8400-e29b-41d4-a716-446655440000"` | `true` |
| UUID com maiúsculas | `"550E8400-E29B-41D4-A716-446655440000"` | `true` |
| UUID com minúsculas | uuid v4 lowercase | `true` |
| string vazia | `""` | `false` |
| UUID incompleto (segmento faltando) | `"550e8400-e29b-41d4"` | `false` |
| segmentos de tamanho errado | `"550e840-e29b4-41d4-a716-446655440000"` | `false` |
| texto aleatório | `"not-a-uuid"` | `false` |
| caractere inválido `g` | UUID com letra `g` | `false` |
| UUID sem hífens | 32 hex chars sem hífens | `false` |
| hífens em posições erradas | `"550e84-00e29b-41d4a7-16446655-440000"` | `false` |
| múltiplos UUIDs válidos | 3 UUIDs diferentes | `true` para todos |

---

## `src/__tests__/lib/nested.test.ts` — 16 testes

Testa as funções `parseNested()` e `toNested()` de `src/lib/nested.ts`.

### `parseNested()` — 9 testes

Converte objeto aninhado em objeto flat com chaves separadas por ponto.

| Teste | Entrada | Saída esperada |
|-------|---------|---------------|
| sem aninhamento | `{ a: '1', b: '2' }` | `{ a: '1', b: '2' }` |
| 1 nível de aninhamento | `{ a: { b: '1' } }` | `{ 'a.b': '1' }` |
| múltiplos níveis | `{ a: { b: { c: '1' } } }` | `{ 'a.b.c': '1' }` |
| input vazio | `{}` | `{ '': '' }` ¹ |
| valor `null` | `{ a: null }` | `{ a: null }` |
| valor `boolean` | `{ a: true }` | `{ a: true }` |
| valor numérico | `{ a: 42 }` | `{ a: 42 }` |
| objeto vazio aninhado | `{ key: {} }` | `{ key: '' }` |
| múltiplos campos | `{ a: '1', b: { c: '2' } }` | `{ a: '1', 'b.c': '2' }` |

> ¹ Comportamento da implementação interna (`flat[''] = ''` para objeto raiz vazio).

### `toNested()` — 7 testes

Converte objeto flat com chaves de ponto em objeto aninhado.

| Teste | Entrada | Saída esperada |
|-------|---------|---------------|
| objeto flat simples | `{ a: '1' }` | `{ a: '1' }` |
| chave com ponto | `{ 'a.b': '1' }` | `{ a: { b: '1' } }` |
| múltiplos níveis | `{ 'a.b.c': '1' }` | `{ a: { b: { c: '1' } } }` |
| input vazio | `{}` | `{}` (0 chaves) |
| chaves sem ponto | `{ a: '1', b: '2' }` | `{ a: '1', b: '2' }` |
| chaves numéricas | `{ '0': 'a', '1': 'b' }` | array `['a', 'b']` |
| inverso de parseNested | objeto simples | roundtrip sem perda |

---

## `src/__tests__/service/env.test.ts` — 13 testes

Testa `src/service/env.ts` — detecção de ambiente e origem da requisição.

### `isProduction()` — 1 teste

| Teste | Descrição |
|-------|-----------|
| retorna false em teste/desenvolvimento | `NODE_ENV=test` → `false` |

### `isDevelopment()` — 1 teste

| Teste | Descrição |
|-------|-----------|
| retorna false em ambiente de teste | `NODE_ENV=test` → `false` |

### `isIpAddress()` — 9 testes

| Teste | Entrada | Resultado |
|-------|---------|-----------|
| IPv4 simples | `"192.168.1.1"` | `true` |
| localhost numérico | `"127.0.0.1"` | `true` |
| apenas dígitos e pontos | `"10.0.0.1"` | `true` |
| hostname de domínio | `"example.com"` | `false` |
| localhost (texto) | `"localhost"` | `false` |
| domínio com subdomínio | `"api.example.com"` | `false` |
| string vazia | `""` | `false` |
| apenas números sem pontos | `"12345"` | `true` |
| IP com letras | `"192.168.abc"` | `false` |

### `getCurrentOrigin()` — 2 testes

| Teste | Descrição |
|-------|-----------|
| retorna protocolo + host | No browser: `window.location.protocol + '//' + window.location.host` |
| fallback SSR | Quando `window` não existe → `"http://localhost:3000"` |

---

## `src/__tests__/hooks/use-countdown.test.ts` — 10 testes

Testa o hook `useCountdown` de `src/hooks/use-countdown.ts`.  
Usa `vi.useFakeTimers()` + `renderHook` + `act` para simular passagem de tempo.

| Teste | Descrição |
|-------|-----------|
| inicializa com o tempo fornecido | `useCountdown(10)` → `time === 10` |
| inicia executando quando autoStart é true | Por padrão `autoStart=true` → timer começa imediatamente |
| não inicia quando autoStart é false | `autoStart=false` → timer parado no início |
| decrementa o tempo a cada segundo | `vi.advanceTimersByTime(1000)` → `time` diminui em 1 |
| para em zero quando o tempo acaba | Após N segundos → `time === 0`, não vai negativo |
| chama onComplete quando o tempo chega a zero | `onComplete` callback é invocado ao zerar |
| pausa o contador ao chamar `pause()` | Após `pause()`, `advanceTimersByTime` não muda `time` |
| reseta para o tempo inicial ao chamar `reset()` | `reset()` → `time` volta ao valor original |
| reseta para um novo tempo com `reset(newTime)` | `reset(20)` → `time === 20` |
| não chama onComplete antes do tempo zerar | `onComplete` nunca chamado com tempo restante |

---

## `src/__tests__/hooks/use-debounce.test.ts` — 8 testes

Testa o hook `useDebounce` de `src/hooks/use-debounce.ts`.  
Usa `vi.useFakeTimers()` + `renderHook` + `act`.

| Teste | Descrição |
|-------|-----------|
| não chama a função antes do delay | Função não executada antes de `delay` ms |
| chama a função após o delay | Função executada exatamente após `delay` ms |
| cancela chamadas anteriores quando chamado novamente | Nova invocação dentro do delay reinicia o timer |
| passa argumentos corretamente | Arguments são repassados à função original |
| indica `debouncing=true` enquanto aguarda | `debouncing` é `true` entre a chamada e o delay |
| indica `debouncing=false` após o delay | `debouncing` volta a `false` após execução |
| `cancel()` impede a execução da função | `cancel()` antes do delay → função nunca executada |
| delay negativo tratado como 0 | `delay=-100` → função executa imediatamente |

---

## Integração Contínua (GitHub Actions)

Workflow: [`.github/workflows/nextjs.yml`](../.github/workflows/nextjs.yml)

| Job | Comando | Gatilho |
|-----|---------|---------|
| `test` — Vitest | `npm test` | push/PR em `master` |
| `build` — Next.js | `npm run build` | após `test` passar (`needs: test`) |

O build só é executado se **todos os 87 testes passarem**.

---

## Como Executar

```bash
# Rodar todos os testes (modo single-run)
npm test

# Rodar em modo watch (desenvolvimento)
npm run test:watch

# Rodar com cobertura de código
npm run test:coverage
```

Configuração: [`vitest.config.ts`](../vitest.config.ts)  
Setup: [`src/__tests__/setup.ts`](../src/__tests__/setup.ts)
