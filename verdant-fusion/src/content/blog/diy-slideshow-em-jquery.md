---
title: "DIY - slideshow em jQuery"
description: 'Pare com a "pluginite"! Para coisas simples não precisa de plugin, faça você mesmo (diy), neste post é feito como exemplo um slideshow em jQuery rapidinho e em poucas linhas.'
pubDate: "2010-12-15"
categories:
  - "jquery"
tags:
  - "diy"
  - "html5"
  - "jquery"
  - "plugin"
  - "slideshow"
---

# Faça você mesmo um slideshow em jQuery

Demos:

- [zero](http://codexico.com.br/projetos/slideshow/zero.html) - somente o html
- [um](http://codexico.com.br/projetos/slideshow/um.html) - sem animação
- [dois](http://codexico.com.br/projetos/slideshow/dois.html) - a mesma animação para os dois lados
- [três](http://codexico.com.br/projetos/slideshow/tres.html) - transições completas, uma para cada lado
- [quatro](http://codexico.com.br/projetos/slideshow/quatro.html) - plugin

15 de dezembro de 2010

Neste artigo vamos descobrir que não é necessário ir atrás de plugins toda vez que precisamos fazer algo em jQuery. A biblioteca tem muitas ferramentas e quando a tarefa é simples é mais rápido fazer você mesmo (DIY) do que procurar plugins por aí.

Por exemplo, outro dia eu precisava que um conteúdo fosse trocado por outro quando o user clicasse em "próximo", alguns chamam de slideshow, outros de apresentação, tem muitos plugins por aí, que fazem todo tipo de coisa com todo tipo de animação, mil tipos de piruetas psicodélicas...

Até encontrar um que fizesse o necessário e sem bugs e fácil de usar demoraria um pouco, e para piorar o sistema em que eu estava mexendo não permitia incluir outros arquivos javascripts e tinha pouco tempo para entregar. Muitas vezes a gente perde um tempão procurando plugins e no final nenhum dos 15 encontrados servem, esse parecia ser o caso, os plugins eram bem diferentes um do outro. Então resolvi fazer eu mesmo.

# [zero](http://codexico.com.br/projetos/slideshow/zero.html): html e css

Este será o html usado neste exemplo, todos os slides estão em uma lista e aparecem um abaixo do outro:

`anterior próximo  - 1 - 2 - 3 - 4 - 5`

Demo [zero](http://codexico.com.br/projetos/slideshow/zero.html)

# [Um](http://codexico.com.br/projetos/slideshow/um.html): javascript inicial

A ideia é pegar o html, esconder os slides e mostrar o primeiro.

Então adicionar um listener em cada botão, ao clicar o slide ativo é escondido substituído pelo próximo.

Mais uma linhazinha para quando chegar ao último voltar ao primeiro.

Em 17 linhas (descontando os comentários) já está montado um slideshow funcional:

`   <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js" type="text/javascript"></script>  <script type="text/javascript">jQuery(document).ready(function($) { //identifica o slideshow $slideshow = $("#slideshow"); //inicialmente esconde os slides $slideshow.find("li.slide").hide(); //encontra o prmeiro slide e ativa-o $slideativo = $slideshow.find("li.slide").first().addClass('slideatual').show(); //ao clicar mostra o proximo slide $('#slideproximo').click(function(){ //esconde o slide atual $slideativo.hide(); //procura o proximo $slideativo = $slideshow.find("li.slideatual").next(); if(!$slideativo.size()) $slideativo = $slideshow.find("li.slide").first();//volta ao primeiro //remove o marcador do slide anterior $slideshow.find("li.slideatual").removeClass("slideatual"); //coloca o marcador e mostra $slideativo.addClass("slideatual").show(); }); //ao clicar mostra o slide anterior $('#slideanterior').click(function(){ $slideativo.hide(); $slideativo = $slideshow.find("li.slideatual").prev(); if(!$slideativo.size()) $slideativo = $slideshow.find("li.slide").last();//volta ao ultimo $slideshow.find("li.slideatual").removeClass("slideatual"); $slideativo.addClass("slideatual").show(); }); });</script>   `

Demo [um](http://codexico.com.br/projetos/slideshow/um.html)

# [Dois](http://codexico.com.br/projetos/slideshow/dois.html): animação

Tá, funcionou, mas ficou sem graça, os slides trocam automaticamente sem efeito nenhum.

Vamos trocar o show() e hide() por um animate().

`//ao clicar mostra o proximo slide $('#slideproximo').click(function(){ //esconde o slide atual $slideativo.animate({ "width": "toggle", "opacity": "toggle" }, "slow", function() {//com callback // //procura o proximo $slideativo = $slideshow.find("li.slideatual").next(); if(!$slideativo.size()) $slideativo = $slideshow.find("li.slide").first();//volta ao primeiro  //remove o marcador do slide anterior $slideshow.find("li.slideatual").removeClass("slideatual"); //coloca o marcador e mostra $slideativo.addClass("slideatual").animate({ "width": "toggle", "opacity": "toggle" }, "slow"); }); });  //ao clicar mostra o slide anterior $('#slideanterior').click(function(){ $slideativo.animate({ "width": "toggle", "opacity": "toggle" }, "slow");//sem callback  $slideativo = $slideshow.find("li.slideatual").prev(); if(!$slideativo.size()) $slideativo = $slideshow.find("li.slide").last();//volta ao ultimo $slideshow.find("li.slideatual").removeClass("slideatual"); $slideativo.addClass("slideatual").animate({ "width": "toggle", "opacity": "toggle" }, "slow"); });`

Demo [dois](http://codexico.com.br/projetos/slideshow/dois.html)

Repare que a animação de recolher usa um callback para começar a mostrar o outro slide só depois que o primeiro já terminou de recolher.

Mas ainda está meio estranha, tanto a animação "anterior" quanto "próxima" estão iguais, seria melhor que fossem diferentes.

# [Três](http://codexico.com.br/projetos/slideshow/tres.html): um pra cada lado

Para animar dqa esquerda para a direita primeiro o elemento precisa estar à esquerda _$slideativo.show().css("left", $slideativo.outerWidth()\*-1).css('opacity', '0');_. Vários truques se escondem nessa linha:

_outerWidth()_ serve para determinar o tamanho do slide

_css("left", $slideativo.outerWidth()\*-1)_ \*-1 para colocar o slide à esquerda

_show()_, mas só funciona se o elemento estiver com "show"

_css('opacity', '0')_ está com "show" mas ainda não deve aparecer.

`$slideativo = $slideshow.find("li.slide").first().addClass('slideatual').css("left","0").show();  //ao clicar mostra o proximo slide $('#slideproximo').click(function(){ //esconde o slide atual para a direita $slideativo.animate({ "left": "+="+$slideativo.outerWidth(), "opacity": "0" }, "slow", function() {//callback //procura o proximo $slideativo = $slideshow.find("li.slideatual").next(); if(!$slideativo.size()) $slideativo = $slideshow.find("li.slide").first();//volta ao primeiro  //remove o marcador do slide anterior $slideshow.find("li.slideatual").removeClass("slideatual");  //posiciona na esquerda $slideativo.show().css("left", $slideativo.outerWidth()*-1).css('opacity', '0'); //coloca o marcador e mostra $slideativo.addClass("slideatual").animate({ "left": "0", "opacity": "1" }, "slow"); }); });  //ao clicar mostra o slide anterior $('#slideanterior').click(function(){ //esconde o slide atual para a esquerda $slideativo.animate({ "left": "-="+$slideativo.outerWidth(), "opacity": "0" }, "slow"); //procura o proximo $slideativo = $slideshow.find("li.slideatual").prev(); if(!$slideativo.size()) $slideativo = $slideshow.find("li.slide").last();//volta ao ultimo  //remove o marcador do slide anterior $slideshow.find("li.slideatual").removeClass("slideatual");  //posiciona na direita $slideativo.show().css("left", $slideativo.outerWidth()).css('opacity', '0'); //coloca o marcador e mostra $slideativo.addClass("slideatual").animate({ "left": "0", "opacity": "1" }, "slow"); });`

Repare que em uma está usando callback e na outra não, dessa maneira uma espera desaparecer para mostrar enquanto na outra os slides correm grudados, fica à escolha do freguês, veja a [demo três](http://codexico.com.br/projetos/slideshow/tres.html).

Foi necessário também adicionar um `.css("left","0")` para posicionar corretamente os slides.

O css também teve que mudar um pouco:

`#slides{ list-style-type: none; width: 200px; overflow: hidden; } .slide{ width: 200px; height: 200px; border: 1px solid #000; left: -200px; position: absolute; }`

Pronto, agora a animação é diferente, ao clicar em "anterior" os slides correm para a esquerda e em "próximo" os slides correm para a direita.

Demo [Três](http://codexico.com.br/projetos/slideshow/tres.html)

# [Quatro](http://codexico.com.br/projetos/slideshow/quatro.html): Plugin

Beleza, agora se quiser mesmo fazer um plugin fica fácil, esse DIY não é sobre fazer plugin então vou economizar e usar o [starter](http://starter.pixelgraphics.us/), um gerador de código que gera um template para plugins jQuery.

O código então fica assim ([jquery.slideshow.js](http://codexico.com.br/projetos/slideshow/jquery.slideshow.js)) (um pouco maior que as 17 linhas iniciais):

`(function ($) { //http://starter.pixelgraphics.us/ $.slideshow = function (el, options) { // To avoid scope issues, use 'base' instead of 'this' // to reference this class from internal events and functions. var base = this; // Access to jQuery and DOM versions of element base.$el = $(el); base.el = el; // Add a reverse reference to the DOM object base.$el.data("slideshow", base);  base.init = function(){ //junta as opcoes default com as passadas na chamada do plugin base.options = $.extend({},$.slideshow.defaultOptions, options);  //um nome mais pratico para base.$el $slideshow = base.$el; //inicialmente esconde os slides $slideshow.find("li.slide").hide(); //encontra o prmeiro slide e ativa-o $slideativo = $slideshow.find("li.slide").first().addClass('slideatual').css("left","0").show();  base.proximo(); base.anterior(); };  base.proximo = function(paramaters){ //ao clicar mostra o proximo slide $('#slideproximo').click(function(){ //esconde o slide atual para a direita $slideativo.animate({ "left": "+="+$slideativo.outerWidth(), "opacity": "0" }, "slow"); //procura o proximo $slideativo = $slideshow.find("li.slideatual").next(); if(!$slideativo.size()) $slideativo = $slideshow.find("li.slide").first();//volta ao primeiro  //remove o marcador do slide anterior $slideshow.find("li.slideatual").removeClass("slideatual");  //posiciona na esquerda $slideativo.show().css("left", $slideativo.outerWidth()*-1).css('opacity', '0'); //coloca o marcador e mostra $slideativo.addClass("slideatual").animate({ "left": "0", "opacity": "1" }, "slow"); }); };  base.anterior = function(paramaters){ //ao clicar mostra o slide anterior $('#slideanterior').click(function(){ //esconde o slide atual para a esquerda $slideativo.animate({ "left": "-="+$slideativo.outerWidth(), "opacity": "0" }, "slow"); //procura o proximo $slideativo = $slideshow.find("li.slideatual").prev(); if(!$slideativo.size()) $slideativo = $slideshow.find("li.slide").last();//volta ao ultimo  //remove o marcador do slide anterior $slideshow.find("li.slideatual").removeClass("slideatual");  //posiciona na direita $slideativo.show().css("left", $slideativo.outerWidth()).css('opacity', '0'); //coloca o marcador e mostra $slideativo.addClass("slideatual").animate({ "left": "0", "opacity": "1" }, "slow"); }); };  // Run initializer base.init(); };  $.slideshow.defaultOptions = { //colocar aqui opcoes default };  $.fn.slideshow = function(options){ return this.each(function () { (new $.slideshow(this, options)); }); }; })(jQuery);`

E para chamar o plugin basta incluir o script acima e _"$('#slideshow').slideshow();"_

`   <script src="jquery.slideshow.js" type="text/javascript"></script>  <script type="text/javascript">jQuery(document).ready(function($) { <div></div> //chama o plugin $('#slideshow').slideshow(); });</script>   `

Demo [quatro](http://codexico.com.br/projetos/slideshow/quatro.html)

No total demorou 1 hora para chegar na etapa 3, acho que demoraria mais ou menos a mesma coisa para encontrar um plugin que fizesse algo parecido, mas também poderia gastar esse tempo todo e não encontrar nenhum adequado.

Você já passou por isso também? Deixe um comentário.

_PS:_ este post foi feito em html5, confira o código na [demo principal](http://codexico.com.br/projetos/slideshow/index.html)

Também no github: [https://github.com/codexico/diy-slideshow-jQuery](https://github.com/codexico/diy-slideshow-jQuery)
