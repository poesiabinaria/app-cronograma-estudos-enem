$(document).ready(function(){

	// INÍCIO DAS FUNÇÕES

	function formatarNumero(valor){ return valor.replace(",", ".") }
	function ehNumero(valor){ return isNaN(Number(formatarNumero(valor))) ? false : true; }

	function validarInputESelect(str_nomeClasse){
		var valido;

		$(str_nomeClasse).each(function(index, value){
			var inputs = $(this).find(':input').val();
			var selects = $(this).find('select').val();

			if(!inputs.length || (selects == null)){ 
				valido = false;
				return false;
			
			} else{ valido = true; }
		}) 

		return valido;
	}

	function validarInputNumerico(str_nomeClasse){
		var valido;
		
		$(str_nomeClasse).each(function(index, value){
			var inputs = $(this).val();

			if (!ehNumero(inputs) || !inputs.length){
				valido = false;
				return false;
				
			} else{ valido = true; }
		})	

		return valido;
	}

	function validarEtapa1(){

		var inputsNumericosValidos = 
		validarInputNumerico(".box-coletar-peso-curso .input-numerico");

		return inputsNumericosValidos ? true : false; 
	}
	

	function validarEtapa3(){

		var inputsNumericosValidos = 
		validarInputNumerico(".box-coletar-numeros-tempo .input-numerico");

		console.log(inputsNumericosValidos);

		return inputsNumericosValidos ? true : false;
	}

	// FIM DAS FUNÇÕES
	

	

	



	var listaAreasConhecimento = [
	{ nomeArea: "Linguagens, Códigos e suas Tecnologias" },
	{ nomeArea: "Ciências Humanas e suas Tecnologias" },
	{ nomeArea: "Ciências da Natureza e suas Tecnologias" },
	{ nomeArea: "Matemática e suas Tecnologias" },
	{ nomeArea: "Redação" }
	];
	
	var somaTotalPesoFinal = 0;

	

	
	
	// INÍCIO - ETAPA 1
	
	$("#btn-concl-etapa1").click(function(){ // Executa 

		prosseguir = validarEtapa1();

		if(prosseguir){

			$(".input-peso-curso").each(function(index, valor){ 
				
				var pesoCurso = $(this).val();
				
				listaAreasConhecimento[index].pesoCurso = pesoCurso;
			});

			console.log(listaAreasConhecimento)

			$("#conteudo-secundario-etapa1").hide();
			$("#conteudo-secundario-etapa2").fadeIn();

			$("#indicacao-etp1").attr("src", "img/v-check.png")
			$("#reticencias-etp-2").hide();
			$("#href-etp1").attr("href", "#etapa2");

		} else{ alert("Parece que há algo errado e/ou incompleto. Por gentileza, revise essa primeira etapa.") };

	}); // FIM - ETAPA 1

	
		

	// INÍCIO - ETAPA 2

	$("#btn-concl-etapa2").click(function(){

		$(".select-peso-pessoal").each(function(index, valor){ 
			
			var pesoPessoal = $(this).val();
			
			listaAreasConhecimento[index].pesoPessoal = pesoPessoal;
		});

		
		$(listaAreasConhecimento).each(function(){

			var pesoFinal = 0;

			pesoFinal = this.pesoCurso * this.pesoPessoal;

			this.pesoFinal = pesoFinal;

			somaTotalPesoFinal += pesoFinal;

		})

		console.log(listaAreasConhecimento)


		$("#conteudo-secundario-etapa2").hide();
		$("#conteudo-secundario-etapa3").fadeIn();

		$("#indicacao-etp2").attr("src", "img/v-check.png")
		$("#reticencias-etp-3").hide();
		$("#href-etp2").attr("href", "#etapa3");
		
	}); // FIM - ETAPA 2

	

	// INÍCIO - ETAPA 3 

	$("#btn-mostrar-resultado").click(function(){

		var prosseguir = validarEtapa3();

		if (prosseguir){
			var qtdHorasSemanais = parseFloat(Math.abs($("#qtd-horas-semanais").val()));
			var qtdMinutosSecao = parseFloat(Math.abs($("#qtd-minutos-secao").val()));
			var qtdMinutosIntervalo = parseFloat(Math.abs($("#qtd-minutos-intervalo").val()));
			
			var qtdCompartimento = Math.round((60/(qtdMinutosSecao + qtdMinutosIntervalo))*qtdHorasSemanais);
			
			var equivPesoeCompart = parseFloat((qtdCompartimento/(somaTotalPesoFinal * 100)) * 100);

			$.each(listaAreasConhecimento, function(index, valor){
				var numCompartFinal = 0;

				numCompartFinal = this.pesoFinal * equivPesoeCompart;

				this.numCompartSemanal = numCompartFinal;
			})
			

			
			// INÍCIO DO RESULTADO FINAL

			var tabelaPrincipal = $("#tabela-principal");

			$(listaAreasConhecimento).each(function(index, valor){
				
				var tr = $("<tr></tr>").appendTo(tabelaPrincipal);

				$("<td></td>").text(this.nomeArea).appendTo(tr);
				$("<td></td>").text(this.pesoCurso).appendTo(tr);
				$("<td></td>").text(this.pesoPessoal).appendTo(tr);
				$("<td></td>").text(this.pesoFinal).appendTo(tr);
				$("<td></td>").text(Math.round(this.numCompartSemanal)).appendTo(tr);
			})

			$("#conteudo-secundario-etapa3").hide();
			$("#conteudo-secundario-resultado").fadeIn();

			$("#indicacao-etp3").attr("src", "img/v-check.png");
			$("#indicacao-resultado").attr("src", "img/flag-check.png");
			$("#reticencias-etp-resultado").hide();
			$("#href-etp3").attr("href", "#etapa-resultado");

			var AreaNomeEx = listaAreasConhecimento[0].nomeArea;
			var AreaSessoesEx = Math.round(listaAreasConhecimento[0].numCompartSemanal);

			$("#area-nome-ex").append(AreaNomeEx);
			$("#area-sessoes-ex").append(AreaSessoesEx + " sessões");
			$("#duracao-sessao-ex").append(qtdMinutosSecao + " minutos");
			$("#intervalo-descanso-ex").append(qtdMinutosIntervalo + " minutos");
			$("#horas-semanais-ex").append(qtdHorasSemanais + " horas");

			$("#btn-ver-detalhes").click(function(){
				
				$("#td-horas-semanais").append(qtdHorasSemanais);
				$("#td-duracao-secao").append(qtdMinutosSecao);
				$("#td-duracao-intervalo").append(qtdMinutosIntervalo);
				$("#td-total-compart").append(qtdCompartimento);
				$("#td-soma-peso-final").append(somaTotalPesoFinal.toFixed(1));
				$("#td-relacao-peso-compart").append(equivPesoeCompart.toFixed(1));

				$(".detalhes-calculo-conteudo").fadeIn();
				$("#btn-ver-detalhes").hide();
			})

		} else{
			alert("Parece que há algo errado e/ou incompleto. Por gentileza, revise essa terceira etapa.")
		}

	}) // FIM - ETAPA 3
});

