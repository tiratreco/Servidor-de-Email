

id = null;
endereco = 'http://localhost';
porta = 3000;
link = endereco+':'+porta.toString()+'/email';
nome = '';
destinatarios = []
tela = null;
/*elementos*/

function app(){
	tela = document.getElementById('tela');
	tela.appendChild(login());
	//toast.show();
	


}

function logar(){
	let ajax = new XMLHttpRequest();
	ajax.crossDomain= true,
	
	nome = document.getElementById('form_login').value;
	ajax.open('GET', link+'?nome='+nome, true, );
	ajax.send();
	ajax.onreadystatechange = () => {
		if(ajax.readyState == 4){
			if (ajax.status==200){//sucesso
				limparTela();
				listarEmails();
			} else if (ajax.status==404)//conta nao encontrada
				setToast('Conta Inexistente', 'vermelho');
				console.log('Conta Inexistente');
			//data = JSON.parse(ajax.responseText);
			//console.log(ajax.responseText);
		}
	}
}

function limparTela(){
	tela.innerHTML='';
}

function acao(elemento){
	destinatarios = [];
	tipo = elemento.id.split('-')[0];
	id = elemento.id.split('-')[1];
	let ajax = new XMLHttpRequest();
	ajax.crossDomain= true,
	ajax.open('GET', link+'/'+nome+'/'+id, true, );
	ajax.send();
	ajax.onreadystatechange = () => {
		if(ajax.readyState == 4){
			if (ajax.status==200){//sucesso
				if (tipo=='enc'){
					limparTela();
					tela.appendChild(emailEnc(JSON.parse(ajax.response)));
				}else if (tipo=='res'){
					limparTela();
					tela.appendChild(emailRes(JSON.parse(ajax.response)));
				}
			} else if (ajax.status==404)//conta nao encontrada
				console.log('Conta Inexistente');
			//data = JSON.parse(ajax.responseText);
			//console.log(ajax.responseText);
		}
	}
	
}

function emailEnc(dados){
	var doc = document.createElement('div');
	doc.id = 'emailEnc'
	doc.innerHTML = '<div id="email" class="m-5">'+
	'<div class="input-group mb-3">'+
	'<input id="remet" type="text" class="form-control" placeholder="" aria-label="" aria-describedby="button-addon2">'+
	'<button onClick="addDestinatario()" class="btn btn-outline-secondary" type="button" id="button-addon2"><i class="fas fa-user-plus"></i>'+
	'</button>'+
	'</div>'+
	'<div id="remete" style="height: 30px;" class="my-3"></div><div class="input-group mb-3">'+
	'<span class="input-group-text" id="basic-addon3">Assunto</span>'+
	`<input id="assunto" type="text" class="form-control" readonly aria-describedby="basic-addon3" value="${dados.assunto}">`+
	'</div>'+
	'<div class="input-group-text">Corpo</div>'+
	`<textarea id="corpo" class="form-control" readonly style="height:400px">${dados.corpo}</textarea>`+
	'<div class="text-center">'+
	'<button onClick="submeterEmail(-2)" type="button" class="btn btn-outline-primary my-3">Enviar<i class="fas fa-paper-plane ms-2"></i></button>'+
	'</div>'+
	'</div>';
	return doc;
}

function emailRes(dados){
	var doc = document.createElement('div');
	doc.id = 'emailEnc'
	doc.innerHTML = '<div id="email" class="m-5">'+
	`<h4>Respondendo ${dados.remetente} sobre "${dados.assunto}"</h4>`+
	'<div id="remete" style="height: 30px;" class="my-3"></div><div class="input-group mb-3">'+
	'<span class="input-group-text" id="basic-addon3">Assunto</span>'+
	`<input id="assunto" type="text" class="form-control" aria-describedby="basic-addon3"">`+
	'</div>'+
	'<div class="input-group-text">Corpo</div>'+
	`<textarea id="corpo" class="form-control" style="height:400px"></textarea>`+
	'<div class="text-center">'+
	'<button onClick="submeterEmail(id)" type="button" class="btn btn-outline-primary my-3">Enviar<i class="fas fa-paper-plane ms-2"></i></button>'+
	'</div>'+
	'</div>';
	return doc;
}

function getAssunto(n, i, ide){
	let ajax = new XMLHttpRequest();
	ajax.crossDomain= true,
	ajax.open('GET', link+'/'+n+'/'+i, true);
	console.log(link+'/'+n+'/'+i);
	ajax.send();
	ajax.onreadystatechange = () => {
		if(ajax.readyState == 4)
			if (ajax.status==200)
				document.getElementById('campor-'+ide).innerHTML='resposta de "'+JSON.parse(ajax.response).assunto+'"';
	}
}

function listarEmails(mostrarToast=false, texto=null, cor=null){
	let ajax = new XMLHttpRequest();
	ajax.crossDomain= true,
	ajax.open('GET', link+'/'+nome, true);
	ajax.send();
	var doc = document.createElement('div');
	doc.id = 'emails';
	var txt = navbar();
	aux = [];
	ajax.onreadystatechange = () => {
		if(ajax.readyState == 4){
			if (ajax.status==200){
				JSON.parse(ajax.response).map((email)=>{
					txt += '<div class="card m-5">'+
					'<div class="card-header">'+
					'<div class="row">'+
					'<div class="col-md-9">';
					if (email.resposta!=null){
						txt += `<h3>${email.assunto}</h3><h5 id="campor-${email.id}"></h5>`;
						aux.push([email.remetente, email.resposta, email.id]);
					}
					else if(email.encaminhado)
						txt += `<h3>${email.assunto}</h3><h5> encaminhado</h5>`;
					else
						txt += `<h3>${email.assunto}</h3>`;
					txt +='</div>'+
					'<div class="col-md-3 text-end">'+
					'<div class="float-right">'+
					`<button id="res-${email.id}" onClick="acao(this)" type="button" class="btn text-success" title="Responder"><i class="fas fa-reply"></i></button>`+
					`<button id="enc-${email.id}" onClick="acao(this)" type="button" class="btn text-success me-1" title="Encaminhar"><i class="fas fa-share"></i></button>`+
					'</div>'+
					'</div>'+
					'</div>'+
					'</div>'+
					'<div class="card-body">'+
					`<p class="card-text">${email.corpo.replace(/\n/g,'<br/>')}</p>`+
					'<blockquote class="blockquote mb-0">'+
					`<footer class="blockquote-footer">${email.remetente}</footer>`+
					'</blockquote>'+
					'</div>'+
					'</div>';
				});

				doc.innerHTML = txt;
				limparTela();
				tela.appendChild(doc);
				aux.map((e)=>{
					getAssunto(e[0],e[1],e[2]);
				})
				if(mostrarToast)
					setToast(texto, cor);
			} else if (ajax.status==404)//conta nao encontrada
			console.log('Conta Inexistente');
		}
	}
}

function enviarEmail(){
	limparTela();
	destinatarios = [];
	tela.appendChild(email());
}


function criarConta (){
	let ajax = new XMLHttpRequest();
	ajax.open('POST', link);
	ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.send("nome="+document.getElementById('form_login').value);
	ajax.onreadystatechange = () => {
		if(ajax.readyState == 4){
			if (ajax.status==200){//sucesso
				setToast('Conta criada com sucesso.', 'verde');
			} else if (ajax.status==409){//conta ja existe
				setToast('Conta já existe.', 'vermelho');
			}

			//data = JSON.parse(ajax.responseText);
			//console.log(ajax.responseText);
		}
	}
}

function submeterEmail(tipo = -1){
	let ajax = new XMLHttpRequest();
	var msg;
	if (tipo == -1){//normal
		ajax.open('POST', link+'/'+nome);
		ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		msg = 'destinatario=';
		destinatarios.map((e)=>{
			msg+=e+',';
		});
		msg += '&assunto='+document.getElementById('assunto').value+
			'&corpo='+document.getElementById('corpo').value;
		console.log(msg);
	}else{
		ajax.open('POST', link+'/'+nome+'/'+id);
		console.log(id)
		ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		if (tipo == -2){//encaminhado
			msg = 'tipo=encaminhar&encaminhamento=';
			destinatarios.map((e)=>{
				msg+=e+',';
			});
			console.log(msg);
		}else{//id resposta corpo
			msg = 'tipo=responder';
			msg += '&assunto='+document.getElementById('assunto').value+
			'&corpo='+document.getElementById('corpo').value;
			console.log(msg);
		}
	}	
	ajax.send(msg);
	ajax.onreadystatechange = () => {
		if(ajax.readyState == 4){
			if (ajax.status==200){//sucesso
				console.log('Sucesso');
				limparTela();
				listarEmails(true, 'Enviado com Sucesso', 'verde');
			} else if (ajax.status==406){//conta nao encontrada
				limparTela();
				listarEmails(true, 'Algumas mensagens não foram enviadas.', 'vermelho');
			}
		}
	}
}

function attDestinatario(){
	var lista = document.getElementById('remete');
	lista.innerHTML='';
	destinatarios.map((e, i)=>{
		if (i==destinatarios.length-1)
			lista.innerHTML += e;
		else
			lista.innerHTML += e+', ';
	});
}

function addDestinatario(){
	var r = document.getElementById('remet').value;
	if (r!='')
		destinatarios.push(r);
	document.getElementById('remet').value='';
	attDestinatario();
}

function setToast(texto, cor='verde'){
	try{
		document.getElementById('toast-atual').remove();
	} catch{}
	var t;
	t = '<div id="toas" class="position-fixed bottom-0 end-0 p-3" style="z-index: 5">';
	if (cor=='verde'){
		t += '<div id="toast" class="toast align-items-center text-white bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">';
	}else if (cor=='vermelho'){
		t +='<div id="toast" class="toast align-items-center text-white bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">';
	}else if (cor=='amarelo'){
		t +='<div id="toast" class="toast align-items-center text-dark bg-warning border-0" role="alert" aria-live="assertive" aria-atomic="true">';
	}
	t += '<div class="d-flex">'+
			'<div id="toast-texto" class="toast-body">'+
			'</div>'+
			'<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>'+
			'</div>'+
			'</div>'+
			'</div>';

	var doc = document.createElement('div');
	doc.id = 'toast-atual';
	doc.innerHTML=t;
	tela.appendChild(doc);
	document.getElementById('toas').innerHTML=t;
	document.getElementById('toast-texto').innerHTML=texto;
	console.log('exibindo toast');
	new bootstrap.Toast(document.getElementById('toast'), 'show').show();
}


function login (){
	var doc = document.createElement('div');
	doc.id = 'login'
	doc.innerHTML = '<div style="margin-top:300px; width:300px" class="card mx-auto" style="width: 18rem;">'+
  	'<div class="card-body">'+
	'<div name="form_login" class="input-group input-group-lg">'+
	'<span class="input-group-text" id="inputGroup-sizing-lg">@</span>'+
	'<input id="form_login" name="nome" type="text" class="form-control" aria-label="Nome de Usuário" aria-describedby="inputGroup-sizing-lg">'+
	'</div>'+
	'<div class="text-center">'+
	'<button class="mx-2 mt-3 btn btn-outline-primary" onClick="logar()">Logar</button>'+
	'<button class="mx-2 mt-3 btn btn-outline-info" onClick="criarConta()">Criar Conta</button>'+
	'<div>'+
	'</div>'+
	'</div>';

	return doc;
}

function navbar(){
	return '<nav class="navbar navbar-expand-lg navbar-light bg-light">'+
	'<div class="container-fluid">'+
	`<a class="navbar-brand"><h3><i class="fas fa-inbox mx-3"></i>${nome}</h3></a>`+
	'<button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">'+
	'<span class="navbar-toggler-icon"></span>'+
	'</button>'+
	'<div class="collapse navbar-collapse" id="navbarSupportedContent">'+
	'<ul class="navbar-nav me-auto mb-2 mb-lg-0">'+
	'</ul>'+
	'<form class="d-flex">'+
	'<button onClick="enviarEmail()" class="btn btn-outline-success" type="submit">Escrever Email</button>'+
	'</form>'+
	'</div>'+
	'</div>'+
	'</nav>';
}

function email(){
	var doc = document.createElement('div');
	doc.id = 'email';
	doc.innerHTML = '<div id="email" class="m-5">'+
        '<div class="input-group mb-3">'+
		'<input id="remet" type="text" class="form-control" placeholder="" aria-label="" aria-describedby="button-addon2">'+
		'<button onClick="addDestinatario()" class="btn btn-outline-secondary" type="button" id="button-addon2"><i class="fas fa-user-plus"></i>'+
		'</button>'+
        '</div>'+
        '<div id="remete" style="height: 30px;" class="my-3"></div><div class="input-group mb-3">'+
		'<span class="input-group-text" id="basic-addon3">Assunto</span>'+
		'<input id="assunto" type="text" class="form-control" aria-describedby="basic-addon3">'+
        '</div>'+
        '<div class="input-group-text">Corpo</div>'+
        '<textarea id="corpo" class="form-control"style="height:400px" aria-label="With textarea"></textarea>'+
        '<div class="text-center">'+
		'<button onClick="submeterEmail()" type="button" class="btn btn-outline-primary my-3">Enviar<i class="fas fa-paper-plane ms-2"></i></button>'+
        '</div>'+
    	'</div>';
	return doc;
}
