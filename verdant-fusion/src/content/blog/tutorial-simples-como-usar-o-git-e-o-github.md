---
title: "Tutorial simples: Como usar o git e o github"
description: "Como usar o github em poucos minutos"
pubDate: "2010-03-11"
categories:
  - "git"
  - "linux"
tags:
  - "git"
  - "github"
---

Ultimamente estou envolvido em vários projetos ao mesmo tempo com várias equipes diferentes, então controle de versão é essencial.

Segue um manualzinho básico para iniciar com o git, espero atualizar e complementar este passo-a-passo com mais exemplos logo.

O git serve para versionamento local, você pode compartilhar de algumas maneiras, a mais fácil é com serviços online. Neste exemplo vou usar o [github](http://github.com "github - Social Coding"), testei também o [projectlocker](http://projectlocker.com/ "Project Locker"), que dá repositórios private grátis,  mas não gostei. Outro que parece legal é o [Codaset](http://codaset.com/ "Codaset"), ainda não testei.

### 1) Instalar git

```
$ sudo apt-get install git-core
```

É necessário gerar uma chave ssh e fazer um cadastro em algum repositório git. ( Esta etapa não é exatamente sobre o git, mas sobre a segurança dos repositórios. )

Confira se vc já tem alguma chave com um "ls ~/.ssh/", se já existir uma você pode utilizá-la ou gerar uma nova:

```
ssh-keygen -t rsa -C "comment"
```

"comment" é só um lembrete para saber do que se trata a chave, normalmente usa-se o seu nome de usuário do serviço que vai usar, por exemplo o github.

Falando nisso, está na hora de criar um usuário lá ([http://github.com](http://github.com)), vai lá que eu espero...

Depois de logado vá para [https://github.com/account](https://github.com/account) e clique em "SSH Public Keys" e "add another public key". A cópia da chave precisa ser exata(eu ia escrever que 'precisa ser precisa' mas é feio né), então pode-se fazer assim:

```
sudo apt-get install xclip
cat ~/.ssh/id_rsa.pub | xclip -sel clip
```

Aí é só colar com um Ctrl+V normal. Agora já dá para se comunicar com o github:

```
ssh git@github.com
```

Vai aparecer "ERROR: Hi codexico! You've successfully authenticated, but GitHub does not provide shell access", não se assuste com o ERROR, o que interessa é que o github te reconheceu. Qualquer duvida tem o help do github: [Generating SSH keys (Linux).](http://help.github.com/linux-key-setup/ "Generating SSH keys (Linux)")

Por padrão o git vai pegar o usuário do sistema, para que seu nome de usuário do github apareça corretamente use os comandos:

```
git config --global user.name "Your Name"
git config --global user.email codexico@gmail.com
```

### 2) Criar Projeto no github

1. Podemos criar um novo projeto ou usar um existente. Para criar um novo vá até o github e no alto da página clique em "Dashboard" e depois em "New Repository".

Crie um espaço para o projeto no comnputador:

```
$ mkdir nomedoprojeto
$ cd nomedodiretorio
```

2. Iniciar um git neste diretório:

```
$ git init
```

Saída do comando:

`Initialized empty Git repository in /nomedodiretorio/.git/`

Deve aparecer um diretorio oculto **.git**, neste **.git** ficam as configurações que serão usadas para este projeto.

Por exemplo:

`$ ls .git branches config description FETCH_HEAD HEAD hooks index info logs objects refs`

3. Adicionar o repositório, neste exemplo vou usar um que criei para este tutorial, pode ser também o repositório criado no passo 1, o endereço fica na página do projeto (neste caso https://github.com/codexico/tutorial-github):

```
$ git remote add origin git@github.com:codexico/tutorial-github.git
```

Formato do comando:

"git remote add" adiciona um repositório ao git que foi iniciado neste diretório, "origin" é o apelido para o projeto, "git@github.com:codexico/tutorial-github.git" é o endereço do projeto.

Resultado:(apareceu a parte _\[remote "origin"\]_)

`$ cat .git/config [core] repositoryformatversion = 0 filemode = true bare = false logallrefupdates = true [remote "origin"] url = git@github.com:codexico/tutorial-github.git fetch = +refs/heads/*:refs/remotes/origin/*`

4. Baixar(pull=puxar) o projeto:

```
$ git pull origin master
```

Formato do comando:

`git pull apelidoDaOrigem apelidoParaDestino`

Saída do comando:

`remote: Counting objects: 52278, done. remote: Compressing objects: 100% (10917/10917), done. remote: Total 52278 (delta 40975), reused 51715 (delta 40669) Receiving objects: 100% (52278/52278), 8.33 MiB | 189 KiB/s, done. Resolving deltas: 100% (40975/40975), done. From git@github.com:codexico/tutorial-github.git * branch master -> FETCH_HEAD`

### 3) Usar o git

Exemplo (escolha um nome diferente para o arquivo teste):

```
$ touch testegit
```

1. Adicionar as alterações:

\- Podemos adicionar somente uma alteração:

```
$ git add testegit
```

\- Ou adicionar todas as alterações:

```
$ git add .
```

Neste passo as alterações ainda não estão sob o controle de versão, elas somente foram adicionadas para quando der um commit.

2. Comitar as alterações:

```
$ git commit -m "mensagem teste para o tutorial"
```

É obrigatório acrescentar uma mensagem.

Saída do comando:

`[master de2f5ce] teste para o tutorial 1 files changed, 1 insertions(+), 0 deletions(-) create mode 100644 testegit`

Agora as alterações foram adicionadas ao controle de versão. Mas ainda estão somente na máquina local.

3. Enviar(push=empurrar) as alterações:

```
$ git push origin master
```

Saída do comando:

`Counting objects: 4, done. Delta compression using up to 2 threads. Compressing objects: 100% (2/2), done. Writing objects: 100% (3/3), 288 bytes, done. Total 3 (delta 1), reused 0 (delta 0) To git@github.com:codexico/tutorial-github.git 3be4c21..de2f5ce  master -> master`

Se durante o tempo em que fez o pull e o push outra pessoa que também participe do projeto fez alterações o push será rejeitado. Então é necessário atualizar o projeto local antes de enviar novas alterações.

```
$ git fetch origin
```

Atualizar antes de enviar é uma boa prática a ser seguida para quem usa svn ou cvs e é obrigatória no git.

4)Pronto, confira as alterações no navegador acessando o endereço do projeto ([http://github.com/codexico/tutorial-github](http://github.com/codexico/tutorial-github) neste exemplo).

Dica final: para que não precise digitar sempre a senha do ssh siga os passos desse link: [http://help.github.com/working-with-key-passphrases/](http://help.github.com/working-with-key-passphrases/)

Atualizado em 09/09/2010, mudei o repositório e adicionei instruções para gerar a chave ssh.
