---
title: "Exemplos de $.when()"
description: "jQuery.when() é uma função super útil para executar 2 ou mais ajax ao mesmo tempo e disparar um calback no final."
pubDate: "2014-04-14"
categories:
  - "javascript"
  - "jquery"
tags:
  - "ajax"
  - "async"
  - "deferreds"
  - "javascript"
  - "jquery"
  - "tutorial"
---

### Atualizaçao: [Mais exemplos e completão.](https://github.com/codexico/blog/blob/master/when/full-1-pt.md)

## Caso Simples: dois ajax ao mesmo tempo

90% das vezes é isso que a gente precisa.

```js
$.when($.ajax("/value1"), $.ajax("/value2")).done(function (data1, data2) {
  console.log("os dois ajax terminaram");
  console.log(
    "agora dá para chamar alguma função que usa as duas respostas dos ajax",
  );
});
```

Muito prático, por exemplo para carregar um html, os dados necessários para preenchê-lo e depois inserir na página.

O que acontece é que o [$.when](http://api.jquery.com/jquery.when/) recebe como parâmetros objetos chamados  
"[Deferreds](http://api.jquery.com/jQuery.Deferred/)", uma tradução seria "adiados", ou seja, objetos que não retornam  
imediatamente, são adiados, em algum momento "prometem" que irão terminar.

Quando as promises terminam o "done" é executado.

## Outros Exemplos

Grande parte dos erros que acontecem ao usar $.when() são por usar alguma função que não retorna uma promise.

```js
function getFacebookData() {
  // criamos uma deferred para resolver somente quando termina o FB
  var dfd = new $.Deferred();
  // o FB acontece async e não retorna uma promise
  FB.api('/me', {fields: 'last_name'}, function(response) {
    console.log(response);
    // aqui avisamos ao $.when que o FB terminou
    dfd.resolve(response);
  });
  // retorna ao $.when uma promessa de que em algum momento a função vai terminar
  return dfd.promise();
}

function getTimeout() {
  // criamos uma deferred para resolver somente quando terminar o timeout
  var dfd = new $.Deferred();
  setTimeout(function() {
    // alguma coisa complexa acontecendo aqui
    // avisa ao $.when que terminou o getTimeout()
    dfd.resolve("fim");
  }, 1000);
  // retorna ao $.when uma promessa de que em algum momento a função vai terminar
  return dfd.promise();
}

// $.ajax retorna uma promise, mas não uma função com $.ajax dentro
function complexAjax(x) {
  var options = {
    url: '/url1',
    data: { param1: x }
  }
  // não é necessário criar a dfd aqui,
  // podemos retornar a própria promise do ajax
  return $.ajax(options);
}
$.when(
  getFacebookData(),
  getTimeout(),
  complexAjax('teste')
  .done(function (fbResponse, dataFromTimeout, ajaxData) {
  // as funções terminaram
});
```

Muitas funções do jQuery retornam uma promise, $.ajax() e $.animate() por exemplo.

Quando uma função não retorna a promessa, como o FB, podemos simplesmente criar uma e retornar quando quisermos.

Esse foi um resumão do funcionamento das deferreds, eu estava escrevendo um tutorial mas estava ficando muito grande, acho que os exemplos acima já resolvem muitos problemas, depois eu posto o completão com detalhes de Promise, Deferreds, when, then, done, async, etc.

### Referências

[Deferreds - http://api.jquery.com/jQuery.Deferred/](http://api.jquery.com/jQuery.Deferred/)

[$.when - http://api.jquery.com/jquery.when/](http://api.jquery.com/jquery.when/)
