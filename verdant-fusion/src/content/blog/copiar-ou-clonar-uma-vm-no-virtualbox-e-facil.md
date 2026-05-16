---
title: "Copiar ou clonar uma VM no VirtualBox é fácil"
description: ""
pubDate: "2010-08-31"
categories:
  - "linux"
  - "virtualizacao"
---

Em dois simples passos (ou três se tiver snapshots) a VM está clonada.

Só um detalhe exige atenção, se a VM tiver snapshots, o estado clonado será o do snapshot mais antigo, se quiser o mais novo será necessário eliminar os snapshots até que reste somente o estado atual que é desejado clonar.

Vá até a pasta onde ficam as VM's (~/.VirtualBox/HardDisks) e use o comando:

```
VBoxManage clonehd nome_vm_existente.vdi nome_do_clone.vdi
```

Vai aparecer algo do tipo:

> Oracle VM VirtualBox Command Line Management Interface Version 3.2.8 (C) 2005-2010 Oracle Corporation All rights reserved.
>
> 0%...10%...20%...30%...40%...50%...60%...70%...80%...90%...100% Clone hard disk created in format 'VDI'. UUID: 8c97595a-08a9-4333-9ce9-dcbe4cd8f2a3

O que este comando fez foi criar um novo hd, a vantagem é que ele clona o conteúdo da VM anterior. Se ainda não usou o disco e quiser deletá-lo (por exemplo se criou com nome errado, ou desistiu da cópia), basta ir até a pasta _~/.VirtualBox/HardDisks_ e apagar o .vdi que acabou de criar. Se já está em uso, pode apagá-lo no Gerenciador de Mídias Virtuais (Ctrl+D).

Então basta criar uma nova máquina virtual (Máquina > Novo) e quando for solicitado se gostaria de criar um novo disco ou usar um existente, clique para escolher um existente. Na tela que aparece ainda não mostrará o clone, para que apareça clique em "Acrescentar" e adicione o disco que criou no passo anterior.

Pronto, mais fácil que isso só se tivesse um botão "Clonar"!

Todos os tutoriais ou blogs que encontrei estavam desatualizados, tinham uns passos a mais e não eram em português, por isso escrevi esse. Pensei em colocar umas imagens ou fazer um screencast, mas ficou tão simples que vai só o texto mesmo. Qualquer dúvida ou sugestão mande um comentário.

Comentário extra: experimente Ctrl(direita)+L quando estiver usando a VM, é muito legal!

### Possíveis contratempos:

Se acontecer um erro do tipo:

> VBoxManage: error: Cannot register the hard disk '/....vdi' {ae40c3b3-0b98-4395-a1d0-4f2530312215} because a hard disk '/....vdi' with UUID {ae40c3b3-0b98-4395-a1d0-4f2530312215} already exists VBoxManage: error: Details: code NS_ERROR_INVALID_ARG (0x80070057), component VirtualBox, interface IVirtualBox, callee nsISupports Context: "OpenMedium(Bstr(pszFilenameOrUuid).raw(), enmDevType, AccessMode_ReadWrite, pMedium.asOutParam())" at line 209 of file VBoxManageDisk.cpp

A solução é trocar o UUID da vdi, não há nenhum problema em trocar o UUID basta um comando simples:

```
VBoxManage internalcommands sethduuid nome_vm_existente.vdi
```

Então repita o camando clonehd.

Outro problema que pode ocorrer é depois de trocar o UUID a VM não iniciar porque o UUID ficou diferente do registrado.

Na mensagem de erro aparece o UUID, copie e substitua no comando:

```
VBoxManage internalcommands sethduuid nome_vm_existente.vdi 82caefd3-be95-4736-80e7-268d4a2558e0

```

Refs: [http://www.virtualbox.org/manual/ch05.html#cloningvdis](http://www.virtualbox.org/manual/ch05.html#cloningvdis) [http://www.virtualbox.org/manual/ch08.html#vboxmanage-clonevdi](http://www.virtualbox.org/manual/ch08.html#vboxmanage-clonevdi) [http://srackham.wordpress.com/cloning-and-copying-virtualbox-virtual-machines/](http://srackham.wordpress.com/cloning-and-copying-virtualbox-virtual-machines/)
