# Como usar $.when()


Ou em outras palavras, que porcaria é essa de
Promise, Deferreds, when, then, done, async, etc?


## Caso Simples

*90% das vezes é isso que a gente precisa.*

**Dois ajax ao mesmo tempo:**

```javascript
$.when($.ajax('/value1'), $.ajax('/value2')).done(function (data1, data2) {
  console.log('os dois ajax terminaram');
  console.log('agora dá para chamar alguma função que usa as duas respostas dos ajax');
});
```

Muito prático, por exemplo para carregar um html,
os dados necessários para preenchê-lo e depois inserir na página.



## Ainda Simples

**Dois ajax e uma função que usa os resultados:**

```javascript
function soma(a, b) {
  console.log(a + b);
}

$.when($.ajax('/value1'), $.ajax('/value2')).done(function (data1, data2) {
  soma(data1, data2);
});
```

## Antigamente era assim

Lembra como era pra fazer uma coisa dessas?
Normalmente tinha 2 maneiras, callbak hell ou timeouts.


### Callback Hell

Ajax um depois do outro até acabarem todos.
Quando um termina chama o outro e assim por diante...

O segundo ajax executa somente após o fim do primeiro,
e só quando o segundo termina a função é chamada,
algo assim:


*old school beginner*
**Dois ajax e uma função que usa os resultados:**

```javascript
var value1, value2;

$.ajax(
  {
    url: '/value1',
    success: function (data) {
      // fim do primeiro ajax
      value1 = data;

      // inicio do segundo ajax
      $.ajax(
        {
          url: '/value2',
          success: function (data) {
            // fim do segundo ajax
            value2 = data;

            soma(value1, value2);
          }
      });
    }
});
```

### Timeouts

No método dos timeouts os ajax eram disparados e
uma função de timeout ficava rodando até que os ajax
fossem concluídos:

*old school expert*
**Dois ajax e uma função que usa os resultados:**

```javascript
var value1, value2,
    ajax1End = false,
    ajax2End = false;

function waitForValues() {
  setTimeout(function() {
    if (ajax1End && ajax2End) {
      // os dois terminaram
      soma(value1, value2);

    } else {
      // ainda não terminaram,
      // espera mais um pouco e tenta novamente
      waitForValues();
    }
  }, 10);
}

//inicia os ajax
$.ajax(
  {
    url: '/value1',
    success: function (data) {
      value1 = data;
      ajax1End = true;
    }
});
$.ajax(
  {
    url: '/value2',
    success: function (data) {
      value2 = data;
      ajax2End = true;
    }
});

//começa a observar se os ajax terminaram
waitForValues();
```


## Caso Simples, quando as coisas ficam complexas

O primeiro exemplo ficou bacana porque os ajax eram simples,
quando ficam mais complexos a coisa fica bagunçada:

**Dois ajax com opções:**

```javascript
$.when(
  $.ajax({
    url: '/url1',
    dataType: 'json',
    data: {
      name: 'Ana',
      id: 1234,
      text: 'lorem',
      number: 42
    },
    cache: false,
    type: 'POST'
  }),
  $.ajax({
    url: '/url2',
    dataType: 'json',
    data: {
      name: 'Maria',
      id: 4321,
      text: 'ipsum',
      number: 42
    },
    cache: false,
    type: 'POST'
  }))
.done(function (data1, data2) {
  console.log('os dois ajax terminaram');
  console.log('agora dá para chamar alguma função que usa as duas respostas dos ajax');
});
```

Já está estranho, e pode ficar ainda mais, imagina se fossem 3 ajax,
concatenação nas urls e dados e por aí vai.
A primeira coisa é separar os ajax em funções certo?


*Errado*
**Dois ajax com opções e separados em funções:**

```javascript
function ajax1() {
  $.ajax({
    url: '/url1',
    dataType: 'json',
    data: {
      name: 'Ana',
      id: 1234,
      text: 'lorem',
      number: 42
    },
    cache: false,
    type: 'POST'
  });
}

function ajax2() {
  $.ajax({
    url: '/url2',
    dataType: 'json',
    data: {
      name: 'Maria',
      id: 4321,
      text: 'ipsum',
      number: 42
    },
    cache: false,
    type: 'POST'
  });
}
Assim o when fica mais simples
$.when(
  ajax1(),
  ajax2()
)
.done(function (data1, data2) {
  console.log('os dois ajax só começaram');
  console.log(data1); // undefined
  console.log(data2); // undefined
});
```

Os logs retornam undefined.

O que acontece é que o 'when' dispara o 'done' quando suas funções terminam.
Como os ajax são async as funções retornaram undefined imediatamente
e então o 'done' disparou antes dos ajax que estavam executando em paralelo.


É a mesma coisa que passar strings ou funções vazias para o 'when',
alguns testes:

**Exemplos de funções que não retornam promises:**

```javascript
console.time('testes');
console.time('teste timeout');
function homeopatia() {
  // essa função não faz nada
}
function acupuntura() {
  // essa função também não faz nada, só uma picadinha
  return 'ai';
}
function esperaUmPouco() {
  setTimeout(function() {
    console.log('terminou o timeout');
    console.timeEnd('teste timeout');
  }, 1000);
}
$.when(
  ajax1(),
  {},
  'x',
  12,
  function () {},
  homeopatia(),
  acupuntura(),
  esperaUmPouco()
)
.done(function () {
  console.log('done');

  $.each(arguments, function(i, value) {console.log(value)});

  console.timeEnd('testes');
});
```

```javascript
done

undefined
Object {}
x
12
function () {}
undefined
ai
undefined

testes: 27.239ms
terminou o timeout
teste timeout: 1003.675ms
```





























Agora a teoria: