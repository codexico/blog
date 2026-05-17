---
title: "jQuery Lancelot Plugin"
pubDate: "2010-08-05"
description: "Este plugin serve para substituir o click do mouse por um hover. Não é mais necessario clicar no link, basta passar o mouse pelo link que aparece um ícone e depois deixar o mouse em cima um tempinho. O navegador irá automaticamente para o link. A ideia deste plugin veio do menu Lancelot do KDE,"
categories:
  - "jquery"
tags:
  - "diy"
  - "html5"
  - "jquery"
  - "plugin"

# heroImage: "../../assets/blog-placeholder-3.jpg"
---

Este plugin serve para substituir o click do mouse por um hover.

Não é mais necessario clicar no link, basta passar o mouse pelo link que aparece um ícone e depois deixar o mouse em cima um tempinho. O navegador irá automaticamente para o link.

A ideia deste plugin veio do menu [Lancelot](http://lancelot.fomentgroup.org) do KDE, que é um menu "Iniciar" onde não é necessário clicar, tudo funciona somente movendo o mouse.

O funcionamento padrão é simples:

`$(".lancelot").lancelot();`

Ao passar o mouse em qualquer link com a classe "lancelot" aparecerá uma imagem de link ao lado, ao manter o mouse sobre a imagem o navegador será redirecionado para o endereço do link.

A imagem que aparece pode ser trocada pelo css, o padrão é esse (com a imagem usada pelo wikipedia):

\[cc lang="css"\] .lancelotGo{ background:url("images/external-link-ltr-icon.png") no-repeat scroll left center transparent; padding:0 0 0 13px; } \[/cc\]

É claro que exitem mais opções!

`$('.lancelot').lancelot({ hoverTime: 3000, aclass: "lancelotGo2", atext: "hover here!", show: "true", display: "block", linkAction: "_blank", alink: "http://ttlocal.info" //passing url });`

Acima foram alterados o tempo que o usuário deve deixar o mouse sobre o link(hoverTime), o estilo foi alterado mudando a classe(aclass), aparece um texto além da imagem(atext), o link para o hover aparece sempre(show), o link aparece como block e não inline(display), o link tentará abrir em uma nova janela(linkAction), e o endereço será o passado em (alink).

Que tal montar o endereço do link dinâmicamente?

`var googleSearch = function(){ //obj is a reference to each $('.lancelot2') var search = obj.text(); return "http://www.google.com/search?q="+search }; $('.lancelot2').lancelot({ speed: "fast", alink: googleSearch //passing function! });`

Neste exemplo a animação para o link foi acelerada(speed) e estamos passando uma função para montar uma busca no google com o texto do link!

obj é um elemento interno do plugin que referencia cada elemento onde está sendo executado o plugin, internamente aconte o seguinte:

`obj = $(this);`

Esta função está sendo usada no site [http://ttlocal.info](http://ttlocal.info),visite.

O desenvolvimento foi feito com ajuda do pivotal tracker, veja como foi em [http://www.pivotaltracker.com/projects/104617](http://www.pivotaltracker.com/projects/104617)

Para mais exemplos baixe o demo.

Download:

zip: [http://github.com/codexico/jquery-plugin-lancelot-autolink/zipball/master](http://github.com/codexico/jquery-plugin-lancelot-autolink/zipball/master)

tar: [http://github.com/codexico/jquery-plugin-lancelot-autolink/tarball/master](http://github.com/codexico/jquery-plugin-lancelot-autolink/tarball/master)

Veja, faça um fork, melhore, corrija, faça o que quiser com o código fonte no github:

[http://github.com/codexico/jquery-plugin-lancelot-autolink](http://github.com/codexico/jquery-plugin-lancelot-autolink)

Bugs, sugestões? Escreva, eu gostaria de ouvir.
