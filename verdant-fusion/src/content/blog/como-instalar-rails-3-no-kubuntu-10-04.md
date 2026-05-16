---
title: "Como instalar Rails 3 no (k) ubuntu"
description: ""
pubDate: "2010-06-09"
categories:
  - "linux"
  - "rails"
tags:
  - "10-04"
  - "apt-get"
  - "git"
  - "install"
  - "kubuntu"
  - "rails3"
  - "ror"
  - "ruby"
  - "rubygems"
  - "ubuntu"
---

Instalação básica do Rails 3 em um linux (K)ubuntu zero km, depois de muitos testes cheguei a esse conjunto de 6 etapas (testado nas versões 10.04 e 10.10):

1. Instalar os pre-requisitos e ruby

```
sudo apt-get install curl bison build-essential zlib1g-dev libssl-dev libreadline6-dev libxml2-dev git-core subversion autoconf sqlite3 libsqlite3-dev ruby-full rake rubygems
```

Atualização (03/12/2010): As instruções funcionam também no Debian. A única diferença é no debian stable "lenny" onde basta trocar _libreadline6-dev_ por _libreadline5-dev_.

Atualização (18/03/2011): Como o Felypeguimaraes lembrou nos comentários, só use "sudo" nos comandos onde estiver escrito "sudo", se usar sudo para instalar o rvm ou gem, etc, não vai funcionar.

Depois de +50MB de download, já dá para conferir qual a versão instalada:

```
ruby -v
```

2. Instalar o rvm [http://rvm.beginrescueend.com/](http://rvm.beginrescueend.com/), ele tem muitas vantagens, auxilia a instalação e a manutenção de vários ambientes:

```
bash < <(curl https://rvm.beginrescueend.com/install/rvm)
```

3. Editar o arquivo  .bashrc. Esse passo pode ser um pouco chato.

Após instalar o rvm aparece esse aviso:

> You must now finish the install manually:
>
> 1. Place the folowing line at the end of your shell's loading files(.bashrc or .bash_profile for bash and .zshrc for zsh), after all path/variable settings:
>
> \[\[ -s $HOME/.rvm/scripts/rvm \]\] && source $HOME/.rvm/scripts/rvm
>
> 2. Ensure that there is no 'return' from inside the .bashrc file. (otherwise rvm will be prevented from working properly).
>
> This means that if you see '\[ -z  \] && return' then you must change this line to:
>
> if \[\[ ! -z  \]\] ; then
>
> ... original content that was below the && return line ...
>
> fi # <= be sure to close the if.
>
> #EOF .bashrc
>
> Be absolutely \*sure\* to REMOVE the '&& return'.
>
> If you wish to DRY up your config you can 'source ~/.bashrc' at the bottom of your .bash_profile.
>
> placing all non-interactive items in the .bashrc, including the 'source' line above

No linux Mint foi só adicionar a linha no final. Já no Ubuntu a maneira mais fácil encontrei nesse fóum [http://ubuntuforums.org/archive/index.php/t-1392189.html](http://ubuntuforums.org/archive/index.php/t-1392189.html)

3.1) renomear o .bashrc para .bashrc_part2

```
cp .bashrc .bashrc_part2
```

3.2) remover no .bashrc_part2 a linha com '... && return', linha 6

3.3) esvaziar o .bashrc e colocar o conteúdo:

```
[[ -s $HOME/.rvm/scripts/rvm ]] && source $HOME/.rvm/scripts/rvm
if [[ ! -z "$PS1" ]] ; then
  source ~/.bashrc_part2
fi
```

4) Feche o terminal e abra um novo terminal para recarregar o bashrc e o rvm funcionar direitinho.

```
rvm info
```

A versao atual do ruby ainda deve ser a mesma de antes:

```
ruby -v
```

4.1) Instalar ruby pelo rvm

(rvm install ruby-head) instalou o 1.9.3dev, testando mais um pouco vi que o head dá problema quando vai usar o console do rails, então é melhor instalar o 1.9.2 mesmo

```
rvm install 1.9.2
```

Demora alguns minutos, aguenta firme. Após a instalação ainda não vai aparecer:

```
ruby -v
```

4.2) Escolher a versão do ruby como default

(rvm --default ruby-head)

```
rvm --default 1.9.2
```

Agora já aparece a versão head do ruby

```
ruby -v
```

4.3) O ruby mais novo ja está instalado e funcionando, só falta uma coisa antes de instalar o rails, também demora, uns 5~10 minutos:

```
gem install sqlite3-ruby
```

5. Chegou a hora, mais uns 10 minutos:

```
gem install rails
```

Atualização (29/11/2010): Parece haver um bugzinho na versão 3.0.3, se aparecer este erro:

```
ERROR:  Error installing rails:
	mail requires i18n (~> 0.4.1, runtime)
```

A solução é instalar o mail antes:

```
gem install mail
```

E depois desinstalar o i18n versão 5

```
gem uninstall i18n
```

> ```
> Select gem to uninstall:
>  1. i18n-0.4.2
>  2. i18n-0.5.0
>  3. All versions
> ```

Escolha a opção 2.

Então é só repetir o comando de instalação do rails.

6) Testar:

#criar a aplicacao

```
rails new appteste1
```

#ir para a aplicacao

```
cd appteste1
```

#ligar o servidor

```
rails s
```

```
bash < <(curl https://rvm.beginrescueend.com/install/rvm)

```

#acessar no navegador

[http://localhost:3000](http://localhost:3000)

#### Extras:

##### Mysql

`sudo apt-get install mysql-server` `gem install mysql2`

Se por algum motivo aparecer esse erro:

```
ERROR:  Error installing mysql:
	ERROR: Failed to build gem native extension.
...
```

A solução é:

`sudo apt-get install libmysqlclient-dev`

Agora já dá para gerar um rails usando mysql.

`rails new appmysql1 -d mysql`

#### Problemas:

Instalando no virtualbox não reconhecia o repositório de gems, dava timeout.

Trocar o endereço padrão melhorou um pouco, no fundo dá na mesma, parece que depende de dns, conexão, provedor, firewall, sei lá..:

`gem sources -a http://gems.rubyforge.org gem sources -r http://rubygems.org/`

Algumas vezes não vai de primeira, mas na segunda, ou terceira tentativa vai. Não sei se ajudou, mas algumas vezes copiei o endereço de erro (por exemplo: http://gems.rubyforge.org/gems/sqlite3-ruby-1.3.0.gem) e acessei pelo navegador, aí o script acordou e encontrou a gem, vai entender...

#### Refs:

[http://rvm.beginrescueend.com/rvm/install/](http://rvm.beginrescueend.com/rvm/install/)

Será que vale um vídeozinho? Ou um script para fazer tudo de uma vez?
