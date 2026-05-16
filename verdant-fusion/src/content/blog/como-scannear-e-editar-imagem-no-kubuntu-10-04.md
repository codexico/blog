---
title: "Como scannear e editar imagem no kubuntu 10.04"
description: ""
pubDate: "2010-05-27"
categories:
  - "linux"
tags:
  - "gimp"
  - "kubuntu"
  - "scanner"
---

Preciso scanear um documento e depois fazer uma edição da imagem no Kubuntu 10.04.

**Beleza, passo 1: scanear.** Outro dia tive q fazer a mesma coisa no w7 e foi só conectar a hp c3180 que o w7 reconheceu, aí só precisei escrever "scan" no menu que já apareceu o aplicativo para scanear. Vamos ver como o kubuntu faz, conectei, reconheceu a impressora sem problema, vou scanear, epa, não tem programa para scanear. Devem ter cortado do cd para poupar espaço ( faz tempo que eu acho que a Canonical devia ter uma edição com mais programas intalados automaticamente ), como chamava o programa q escaneia mesmo? Vamos lá google...

Notícias novas \[[1](http://kubuntuforums.net/forums/index.php?topic=3104909.0)\], parece que tem um aplicativo do kde4 para scanner, chamado '_skanlite_', testado e aprovado, serve pra scannear direitinho. Outras opções são o '_xsane_' ( era esse q eu havia esquecido o nome ) e o '_gimp2.0-quiteinsane_', a vantagem do último é que é integrado ao GIMP, testei e cumpre a função também.

_Conclusão:_ qualquer um dos 3 softwares faz o básico, que é só o que preciso e usei.

**Não doeu nada, passo 2: Editar a imagem.**

Aiaiai, não vem mais o GIMP nos ubuntus, e nenhum dos softwares básicos (okular, gwenview, f-spot) editam as imagens, até servem para o crud (cortar, rodar, u?, dimensionar), mas para algo mais só conheço o GIMP mesmo. Pena q o tuxpaint não abre uma imagem, acho que serviria para várias coisas.

Então, como já instalei o gimp2.0-quiteinsane, vou de gimp mesmo.

Quase bom, quero colocar uma setinha na imagem mas com o lápis ficou muito feio (bem q o gimp podia ter uma maneira fácil de colocar clip-art como no tuxpaint). ¿Será que tem algo no repositório? Hehehe, tem um pacote chamado 'openclipart-png', depois de instalado as imagens ficam em '/usr/share/openclipart/png/', mas são bem feinhas. Lembrei de um site que tem ícones grátis e diferente da maioria dos sites de ícones, estes são bonitos: [Icons Etc](http://icons.mysitemyway.com/) \[2\]. Problema resolvido.

É, até que não foi difícil, acho que vale uma blogada, faz tempo que não escrevo nada. ¿Alguma opinião ou dica de outros programas?

\[1\] http://kubuntuforums.net/forums/index.php?topic=3104909.0 \[2\] http://icons.mysitemyway.com/
