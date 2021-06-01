var fs = require('fs');

usuarios = null;
emails = null;

module.exports = function() { 
    this.sendArquivo = sendArquivo;
    this.inicializar = inicializar;
    this.existeConta = existeConta;
    this.criarConta = criarConta;
    this.listarEmails = listarEmails;
    this.criarEmail = criarEmail;
    this.listarEmail = listarEmail;
    this.submeterEmail = submeterEmail;
    this.erroHttp = erroHttp;
    
}

function erroHttp(res, codigo, mensagem = ''){
    res.writeHead(codigo);
    res.end(mensagem);
    return;
}

function erroArquivo(arq){
    console.log('Erro de abertura de arquivo.');
    fs.writeFile('./dados/'+arq, '[]', ()=>{});
}

function salvarArquivo(arquivo){
    if (arquivo == 'emails')
        fs.writeFile('./dados/emails.json', JSON.stringify(emails, null, 2), ()=>{});
    if (arquivo == 'usuarios')
        fs.writeFile('./dados/usuarios.json', JSON.stringify(usuarios, null, 2), ()=>{});
}

function criarEmail(dados, nome, res){
    if (dados == null){
        console.log('DADOS = NULL');
        return;
    }
    console.log(dados);
    var destinatarios = dados.destinatario.split(',').filter((e)=>{
        return (e!='');
    });
    var flag = false;
    destinatarios.map((d)=>{
        console.log(d);
        if (existeUsuario(d))
            emails.push({id: emails.length+1,remetente:nome, destinatario:d, assunto:dados.assunto, corpo:dados.corpo,encaminhada: false, resposta: null});
        else 
            flag=true;
    });
    salvarArquivo('emails');
    if (flag || destinatarios.length==0){
        console.log('u nao encontrado')
        res.writeHead(406);
        res.end();
        return;
    }
    res.writeHead(200);
    res.end();
}

function criarConta (nome, res){
    //ver se nome é vazio
	if (existeUsuario(nome)){//conta ja existe
        erroHttp(res, 409, 'Conta já Existente.');
        return;
    }
    usuarios.push({nome: nome});
    salvarArquivo('usuarios');
    res.writeHead(200);
    res.end();
}

function existeUsuario (nome){
    if (nome=='')
        return false;
    for (var i=0 ; i<usuarios.length ; i++){
        if (usuarios[i].nome==nome)
            return true;
    }
    return false;
}

function existeConta(nome, res){
    if (existeUsuario(nome)){
        res.writeHead(200);
        res.end();
    }
    else{
        erroHttp(res, 404);
    }
}

function listarEmails(nome, res){
    var lista = []
    emails.map((e)=>{
        if (e.destinatario==nome){
            lista.push(e);
        }
    })
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(lista));
    res.end();
}

function listarEmail(nome, id, res){
    var email = getEmail(id);
    if (email.destinatario != nome){
        erroHttp(res, 401);
        return;
    }
    if (email==null){
        erroHttp(res, 404);
        return;
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(email));
    res.end();
}

function submeterEmail(valores, nome, id, res){//recebe um tipo de ação
    var email = getEmail(id);
    if (email.destinatario != nome){
        erroHttp(res, 401);
        return;
    }
    var flag = false;
    if (valores.tipo == 'encaminhar'){//recebe lista de encaminhanmento 
        var val = valores.encaminhamento.split(',').filter((e)=>{return e!=''})
        val.map((e)=>{
            console.log(e);
            if (existeUsuario(e))
                emails.push({id: emails.length+1,remetente:nome, destinatario:e, assunto:email.assunto, corpo:email.corpo,encaminhada: true, resposta: null});
            else
                flag = true;
        });
        salvarArquivo('emails');
        if (flag || val.length==0){
            console.log("Alguns remetentes não existem")
            res.writeHead(406);
            res.end();
            return;
        }
        res.writeHead(200);
        res.end();
    }else if (valores.tipo == 'responder'){//recebe assunto e corpo
        emails.push({id: emails.length+1, remetente:nome, destinatario:email.remetente, assunto:valores.assunto, corpo:valores.corpo,encaminhada: false, resposta: email.id});
        salvarArquivo('emails');
        res.writeHead(200);
        res.end();
    }else{
        //erro ação invalida
    }
}

function sendArquivo(arquivo, res, tipo) {
    if (tipo == 'http')
        res.writeHeader(200, {"Content-Type": "text/html"});
    if (tipo == 'json')
        res.writeHeader(200, {'Content-Type': 'application/json'});
    fs.createReadStream(arquivo).pipe(res);
}

function getEmail(id){
    for (var i=0 ; i<emails.length ; i++){
        if (emails[i].id==id){
            return emails[i];
        }
    }
    return null;
}

function inicializar(){
    try{
        usuarios = require('./dados/usuarios.json');
    } catch{
        erroArquivo('usuarios.json');
    }
    try{
        emails = require('./dados/emails.json');
    } catch{  
        erroArquivo('emails.json');
    }  
}