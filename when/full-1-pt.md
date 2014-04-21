# Como usar $.when()

Se quiser somente alguns exemplos rápidos veja o
[resumão](http://codexico.com.br/blog/jquery/exemplos-de-jquery-when/).


**Ou em outras palavras, que porcaria é essa de
Promise, Deferreds, when, then, done, async, etc?**



> [*Deferreds*](http://api.jquery.com/jQuery.Deferred/), uma tradução seria "adiados", são objetos que não retornam imediatamente, são adiados, retornam uma *Promise*, "promessa", de que em algum momento irão terminar.



## Caso Simples

*90% das vezes é isso que a gente precisa.*

**Ex-1) Dois ajax ao mesmo tempo:**

```javascript
$.when(
  $.ajax('/value1'),
  $.ajax('/value2'))
.done(function (data1, data2) {
  // os dois ajax terminaram
  // agora dá para chamar alguma função que usa as duas respostas dos ajax
  console.log(data1, data2);
});
```

Muito prático, por exemplo para carregar um html,
os dados necessários para preenchê-lo e depois inserir na página.



## Ainda Simples

**Ex-2) Dois ajax e uma função que usa os resultados:**

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

2 maneiras eram comuns, callbak hell ou timeouts.


### Callback Hell

Ajax um depois do outro até acabarem todos.
Quando um termina chama o outro e assim por diante...

O segundo ajax executa somente após o fim do primeiro,
e só quando o segundo termina a função é chamada.

O maior problema é que a performance fica prejudicada, o
tempo de execução fica a soma dos tempos de cada ajax, se
algum demorar trava todos os outros.



**Ex-3) Dois ajax e uma função que usa os resultados:** (*old school beginner*)

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



**Ex-4) Dois ajax e uma função que usa os resultados:** (*old school expert*)

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

**Ex-5) Dois ajax com opções:**

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


*Errado!!!*

**Ex-6) Dois ajax com opções e separados em funções:**

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
//Assim o when fica mais simples
$.when(
  ajax1(),
  ajax2()
)
.done(function (data1, data2) {
  // os dois ajax só começaram
  console.log(data1); // undefined
  console.log(data2); // undefined
});
```

Os logs retornam undefined.

O que acontece é que o 'when' dispara o 'done' quando suas funções terminam.
Como os ajax são async, as funções retornaram undefined imediatamente,
então o 'done' disparou antes dos ajax, enquanto ainda estavam executando em paralelo.


É a mesma coisa que passar strings ou funções vazias para o 'when',
alguns testes:

**Ex-7) Exemplos de funções que não retornam promises:**

```javascript
console.time('testes');
console.time('teste timeout');
function ajax1() {
  // sabemos pelo Ex-1 que funciona no $.when
  $.ajax('/value1');
  // mas não se a função ajax1() não avisar ao $.when
}

function homeopatia() {
  // essa função não faz nada
}

function acupuntura() {
  // essa função também não faz nada, só uma picadinha
  return 'ai';
  // mesmo retornando algo, ainda não é o que o $.when espera
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

  // log dos argumentos, em uma linha para não poluir o código
  console.log([].slice.call(arguments));

  console.timeEnd('testes');
});
```

E esta é a saída no console:

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

O primeiro log já é o -done-, que gostaríamos que fosse executado
somente após os testes.


> Os parâmetros passados ao when precisam retornar a promessa de que vão terminar, senão o when não encontra a promise e considera que já terminou.

> Muitas funções do jQuery retornam uma promise, $.ajax() e $.animate() por exemplo.


A solução é criar a própria deferred e retornar a promise.


*Certo!!!*

**Ex-8) Dois ajax com opções e separados em funções:**

```javascript
function ajax1() {
  // criamos uma deferred para resolver somente quando
  // terminar o código que quisermos executar
  var dfd = new $.Deferred();

  $.ajax('/value1').done(function () {
    // aqui avisamos ao $.when que o código terminou
    dfd.resolve(response);
  });

  // retorna ao $.when uma promessa de que em algum momento a função vai terminar
  return dfd.promise();
}
function ajax2() {
  // o $.ajax() já retorna uma promise, não é necessário
  // criar uma deferred nesse caso
  return $.ajax('/value1');
}
function esperaUmPouco() {
  // criamos uma deferred para resolver somente quando
  // terminar o código que quisermos executar
  var dfd = new $.Deferred();

  setTimeout(function() {
    console.log('terminou o timeout');
    // aqui avisamos ao $.when que o timeout terminou
    // e também podemos passar conteúdo
    dfd.resolve('fim do timeout');
  }, 1000);

  // retorna ao $.when uma promessa de que em
  // algum momento a função vai terminar
  return dfd.promise();
}

$.when(
  ajax1(),
  ajax2(),
  esperaUmPouco()
)
.done(function (a, b, c) {
  // os dois ajax terminaram corretamente
  console.log(a); // response
  console.log(b); // - o que quer que o ajax tenha trazido
  console.log(c); // fim do timeout
});
```


Acho que foi tudo.

Um último exemplo, uma vez tive que fazer uma chamada à uma api e pegar os dados (posts do user no facebook no último mês) e depois fazer outras chamadas com esses dados (shares e likes desses posts), processar as respostas (pegar somente amigos no último mês), enviá-las para o back (que fazia algum cálculo doidão) e finalmente com a resposta mostrar algo para o usuário. Isso é só uma parte, ainda tinha muito mais regras e tipos de dados para buscar.

Imagina fazer isso sem deferreds?


*Ficou +- assim:*

**Ex-9) when dentro de when:**

```javascript
function getPosts() {
  var dfd = new $.Deferred();
  // é só um exemplo, ahhh como seria legal se a api
  // do facebook fosse consistente...
  FB.api('getPosts', function(response) {
    dfd.resolve(response);
  });
  return dfd.promise();
}
function getFriends() {
  var dfd = new $.Deferred();
  FB.api('getFriends', function(response) {
    dfd.resolve(response);
  });
  return dfd.promise();
}
function getLikes(posts, friends) {
  var dfd = new $.Deferred();
  FB.api('batchGetLikesFromPosts', function(response) {
    dfd.resolve(response);
  });
  return dfd.promise();
}
function getLikesPostsAndFriends() {
  var dfd = new $.Deferred();

  $.when(
    getPosts,
    getFriends()
  )
  .done(function (posts, friends) {
    // when dentro de when pode?
    // pode, com atenção, dava até pra ter
    // criado uma outra função aqui para ficar mais legível
    $.when(
      getLikes(posts, friends);
    )
    .done(function (likes) {
      // repare que é o único resolve da função inteira
      dfd.resolve(posts, friends, likes);
    });
  });

  return dfd.promise();
}


// e esse na verdade é o código, o resto conseguimos
// separar em funções, poderiam até estar em outro arquivo
$.when(
  getLikesPostsAndFriends(),
  getEvents(),
  getVideos()
)
.done(function (posts, friends, ...) {

  $.ajax({
    url: '/analyzeData',
    data: {posts, friends, ...}
  }).done(function (reponse) {
    $('#resposta').html(response);
  });
});
```



Últimos detalhes, não fiz nenhum tratamento de erro no tutorial, mas é fácil, quando acontece algum erro, ao invés de executar o done, é chamado o [fail](http://api.jquery.com/deferred.fail/).




### Referências


[Deferreds](http://api.jquery.com/jQuery.Deferred/) - http://api.jquery.com/jQuery.Deferred/

[$.when](http://api.jquery.com/jquery.when/) - http://api.jquery.com/jquery.when/




