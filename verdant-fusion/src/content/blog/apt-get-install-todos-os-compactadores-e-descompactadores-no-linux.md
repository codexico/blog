---
title: "apt-get install todos os compactadores e descompactadores no linux"
description: "comando para instalar compactadores de arquivos extras no ubuntu"
pubDate: "2010-02-07"
categories:
  - "linux"
tags:
  - "apt-get-linux-zip-rar"
---

Sempre que insatalo um sistema novo como o Ubuntu ficam faltando alguns detalhes, um deles é o suporte a todos os formatos de zip, além do gzip e bz2.

Instale tudo que precisa para compactar e descompactar em sistemas derivados do debian, como kubuntu, mint...

```
sudo apt-get install p7zip-full p7zip-rar lzma lzma-dev rar unrar-free p7zip ark ncompress
```

Assim devem aparecer também os menus de contexto nos gerenciadores de arquivo.
