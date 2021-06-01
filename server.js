
require('./email.js')()
const { parse } = require('querystring');

const http = require('http')

const port = 3000

server = http.createServer();

server.on('request', solicitacao);

function solicitacao(req, res) {
  	var metodo = req.method;
	var link = req.url.split('?')[0];
	var id = req.url.split('?')[0].split('/').filter((e)=>{
		return e!='';
	})[2];
	var nome = getNome(req.url);
	res.setHeader('Access-Control-Allow-Origin', '*');
	if (metodo == 'GET'){
		GET(req, res, link, id, nome);
	}else if (metodo == 'POST'){
	collectRequestData(req, result => {
		POST(req, res, result, link, id, nome);
	});
	}

}

server.listen(port, () => {
	console.log(`Servidor iniciou em http://localhost:${port}/`);
	inicializar();
});

function GET(req, res, link, id, nome){
	var valores = getValores(req.url);
	console.log(id);
	if (link == '/email'){
		if (semDados(valores, res)) return;
			existeConta(valores[0][1], res);
	}else if (link == '/email/'+nome){//ver se nome existe
		listarEmails(nome, res);
	}else if (link == '/email/'+nome+'/'+id){
		listarEmail(nome, id, res);
	}

}

function POST(req, res, valores, link, id, nome){
	if (link == '/email'){
		criarConta(valores.nome, res);
	}else if (link == '/email/'+nome){//ver se nome existe
		criarEmail(valores, nome, res);
	}else if (link == '/email/'+nome+'/'+id){
		submeterEmail(valores, nome, id, res);
	}

}


function getNome(url){
	var ende = [];
	try{
	url.split('?')[0].split('/').map((e)=>{
		if (e != '') ende.push(e);
	});
	} catch (e) {
		console.log('erro');
	}
	if (ende.length>1)
		return ende[1];
	return null;
}

function getValores(url){
	var valores = [];
	console.log(url);
	try{
		let aux = url.split('?')[1].split('&').map((element)=>{
			valores.push(element.split('='));
		});
	}catch(e){
		//console.log(e);
		return valores;
	}
	return valores;
}

function semDados(valores, res){
	if (valores.length==0){//sem dados
        erroHttp(res, 400);
		return true;
	}
	return false;
}

function collectRequestData(request, callback) {
	const FORM_URLENCODED = 'application/x-www-form-urlencoded';
	if(request.headers['content-type'] === FORM_URLENCODED) {
		let body = '';
		request.on('data', chunk => {
			body += chunk.toString();
		});
		request.on('end', () => {
			callback(parse(body));
		});
	}
	else {
		callback(null);
	}
}