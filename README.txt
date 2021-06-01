Utilizando WebServices no modelo REST, desenvolva um servidor de email simplificado. Ele deve implementar, pelo menos, as seguintes funcionalidades:

- Enviar mensagem
- Listar mensagens
- Apagar mensagens
- Abrir mensagem
- Encaminhar mensagem
- Responder Mensagem

Desenvolva também um cliente que utilize o servidor através de chamadas às funcionalidades implementadas. Ao conectar, o usuário deve informar seu nome. Esta será a forma de identificação. Não é necessário preocupar-se com autenticação. As mensagens podem ser armazenadas em um simples arquivo texto. Cada mensagem deve conter, pelo menos, os seguintes campos:
- Remetente
- Destinatário
- Assunto
- Corpo

Observações:

1. As aplicações cliente e servidor devem executar facilmente em um computador, sem a necessidade de instalação de grandes pacotes de desenvolvimento. Não serão aceitas aplicações executando na web.

2. Deve ser anexado juntamente com o código, um documento em modo texto(README) contendo as informações necessárias para a instalação e testes da aplicação.

3. Utilize os métodos HTTP de acordo com o que é especificado pelo modelo REST.

4. Não devem ser utilizadas frameworks no desenvolvimento do servidor que ocultem detalhes do modelo REST. Afinal, a proposta principal é que vocês entendam como esse modelo funciona. Utilize uma biblioteca semelhante a apresentada na videoaula(JAX-WS).

5. No desenvolvimento do cliente, podem ser utilizadas quaisquer ferramentas e frameworks disponíveis.



get / post / update / delete

/login
get - login
post - cria conta

/nome
get - receber lista de emails
post - enviar email
update - att dados

/

-- Ambiente e Execução --

Projeto desenvolvido utilizando:

-Ubuntu 20.04 LTS 
Versão baixada na Microsoft Store do Windows 10

-NodeJS versão 10.24
curl -fsSL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs



