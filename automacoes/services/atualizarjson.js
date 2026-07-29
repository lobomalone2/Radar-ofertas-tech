const fs = require('fs')
const { JSDOM } = require('jsdom')

const arrayNovosLinks = [
  "https://meli.la/1ht3gvC",
  "https://meli.la/1ZjYmGi",
  "https://meli.la/2brSbpe",
  "https://meli.la/2wbTYJM",
  "https://meli.la/1KiQNUg",
  "https://meli.la/1zqth92",
  "https://meli.la/2v2iJHp",
  "https://meli.la/2NwzDqa",
  "https://meli.la/2qkHBgX",
  "https://meli.la/1jhjmL2",
  "https://meli.la/2WyDnp1",
  "https://meli.la/1nVnWa1",
  "https://meli.la/1ysjon4",
  "https://meli.la/2v2ogZt",
  "https://meli.la/1UacWfL",
  "https://meli.la/294vMAy",
  "https://meli.la/11J8Rcx",
  "https://meli.la/134F9SE",
  "https://meli.la/1Q3dU8B",
  "https://meli.la/1JtviVt",
  "https://meli.la/1vWoNSu",
  "https://meli.la/14Uio7S",
  "https://meli.la/2iv9TBD",
  "https://meli.la/1n8mKCm",
  "https://meli.la/1sfLqWY",
  "https://meli.la/32i1Vxs",
  "https://meli.la/2Adpjtt",
  "https://meli.la/2sXCBqA",
  "https://meli.la/13sEwpU",
  "https://meli.la/2uY8YAC",
  "https://meli.la/2BTVbUk",
  "https://meli.la/2Tsv4FW",
  "https://meli.la/2m4scDC",
  "https://meli.la/2rH2axX",
  "https://meli.la/2uoc9FH",
  "https://meli.la/1NnHqkD",
  "https://meli.la/12sBtpe",
  "https://meli.la/2VgHUmG",
  "https://meli.la/1N9Qw49",
  "https://meli.la/2cvcB4Q",
  "https://meli.la/2SEB6rZ",
  "https://meli.la/33cQaK3",
  "https://meli.la/2hCdota",
  "https://meli.la/2URjExj",
  "https://meli.la/2N2df3Y",
  "https://meli.la/1nzYxWc",
  "https://meli.la/196YRhy",
  "https://meli.la/1LG5UbW",
  "https://meli.la/1f5TDht",
  "https://meli.la/1n4JXKG",
  "https://meli.la/2tCBuQD",
  "https://meli.la/2KxvbvS",
  "https://meli.la/2UQas8z",
  "https://meli.la/2h4kgWc",
  "https://meli.la/1HxKC2K",
  "https://meli.la/26eYwQ5",
  "https://meli.la/24dRbMG",
  "https://meli.la/2MvxSEo",
  "https://meli.la/1NnspbZ",
  "https://meli.la/2N8yiCz",
  "https://meli.la/1vna6X4",
  "https://meli.la/2AjRtnD",
  "https://meli.la/19SyXJ1",
  "https://meli.la/2t7NQUV",
  "https://meli.la/2cdSqBA",
  "https://meli.la/1weAvnA",
  "https://meli.la/2WpHgej",
  "https://meli.la/2G2mdzc",
  "https://meli.la/1aTTbKE",
  "https://meli.la/27TutoK",
  "https://meli.la/2hPLrvx",
  "https://meli.la/28JJu7u",
  "https://meli.la/2QFGtLm",
  "https://meli.la/1cQYs4u",
  "https://meli.la/2YNEDWY",
  "https://meli.la/1wnSv5o",
  "https://meli.la/1a39hWZ",
  "https://meli.la/29BKZqv",
  "https://meli.la/2hV4bHZ",
  "https://meli.la/1KGTX9G",
  "https://meli.la/2chG443",
  "https://meli.la/1GXyCNd",
  "https://meli.la/1mJZmMc",
  "https://meli.la/1A44dKP",
  "https://meli.la/13xvMMZ",
  "https://meli.la/16C9tpF",
  "https://meli.la/2Q4RYWs",
  "https://meli.la/2bcemJp",
  "https://meli.la/1jhjmL2",
  "https://meli.la/2WyDnp1",
  "https://meli.la/1nVnWa1",
  "https://meli.la/1ysjon4",
  "https://meli.la/2v2ogZt",
  "https://meli.la/1UacWfL",
  "https://meli.la/294vMAy",
  "https://meli.la/11J8Rcx",
  "https://meli.la/134F9SE",
  "https://meli.la/1Q3dU8B",
  "https://meli.la/1JtviVt",
  "https://meli.la/1vWoNSu",
  "https://meli.la/14Uio7S",
  "https://meli.la/2iv9TBD",
  "https://meli.la/1n8mKCm",
  "https://meli.la/1sfLqWY",
  "https://meli.la/32i1Vxs",
  "https://meli.la/2Adpjtt",
  "https://meli.la/2sXCBqA",
  "https://meli.la/13sEwpU",
  "https://meli.la/2uY8YAC",
  "https://meli.la/2BTVbUk",
  "https://meli.la/2Tsv4FW",
  "https://meli.la/2m4scDC",
  "https://meli.la/2rH2axX",
  "https://meli.la/2uoc9FH",
  "https://meli.la/1NnHqkD",
  "https://meli.la/12sBtpe",
  "https://meli.la/2VgHUmG",
  "https://meli.la/1N9Qw49",
  "https://meli.la/2cvcB4Q",
  "https://meli.la/2SEB6rZ",
  "https://meli.la/33cQaK3",
  "https://meli.la/2hCdota",
  "https://meli.la/2URjExj",
  "https://meli.la/2N2df3Y",
  "https://meli.la/1nzYxWc",
  "https://meli.la/196YRhy",
  "https://meli.la/1LG5UbW",
  "https://meli.la/1f5TDht",
  "https://meli.la/1n4JXKG"
];
function exportarLinksParaConversao(arquivoOrigem, arquivoDestino, arquivoTxt) {
    try {
        const dadosBrutos = fs.readFileSync(arquivoOrigem, 'utf-8')
        const listaProdutos = JSON.parse(dadosBrutos)

        let conteudoTxt = ''
        const tamanhoBloco = 30

        const listaFiltrada = listaProdutos.map((produto, index) => {
            let linkOriginal = produto.link.trim()

            // Organiza os blocos visuais de 30 em 30 no TXT
            if (index % tamanhoBloco === 0) {
                const numeroBloco = Math.floor(index / tamanhoBloco) + 1
                conteudoTxt += `\n=== BLOCO ${numeroBloco} ===\n`
            }
            conteudoTxt += `${linkOriginal}\n`

            // RETORNA O OBJETO COMPLETO: Mantém o id, o link e agora o título para a validação!
            return { 
                id: produto.id, 
                titulo: produto.titulo, // Crucial para o Passo 2 não quebrar
                link: linkOriginal 
            }
        })

        // Salva o JSON temporário com a estrutura id, titulo e link
        fs.writeFileSync(arquivoDestino, JSON.stringify(listaFiltrada, null, 2), 'utf-8')
        fs.writeFileSync(arquivoTxt, conteudoTxt.trim(), 'utf-8')

        console.log(`📦 Arquivos gerados com sucesso! O "para_converter.json" agora contém os títulos para validação.`)
    } catch (erro) {
        console.error('❌ Erro ao exportar:', erro.message)
    }
}

function limparTexto(texto) {
    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Remove acentos
        .replace(/[^a-z0-9]/g, "")       // Remove tudo que não for letra ou número
}

async function atualizarListaTemporaria(arquivoTemporario, listaLinks) {

try {

const dadosBrutos = fs.readFileSync(arquivoTemporario, 'utf-8')

const listaTemp = JSON.parse(dadosBrutos)



console.log(`⏳ Analisando ${listaLinks.length} links via conferência de título...`)

let atualizados = 0



for (const linkEncurtado of listaLinks) {

if (!linkEncurtado.startsWith('http')) continue



try {

const resposta = await fetch(linkEncurtado, {

headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }

})



const html = await resposta.text()

const dom = new JSDOM(html)

const documento = dom.window.document



// Busca cirúrgica usando a classe exata do título do Mercado Livre (.ui-pdp-title)

const elementoTitulo = documento.querySelector('.ui-pdp-title, h1.ui-pdp-title, .poly-component__title')


if (elementoTitulo) {

const tituloPagina = elementoTitulo.textContent.trim()

const tituloPaginaLimpo = limparTexto(tituloPagina)



// Procura no seu JSON o produto que tem o título correspondente

const produto = listaTemp.find(p => {

if (!p.titulo) return false

const tituloJsonLimpo = limparTexto(p.titulo)


return tituloJsonLimpo.includes(tituloPaginaLimpo) ||

tituloPaginaLimpo.includes(tituloJsonLimpo)

})



if (produto) {

produto.link = linkEncurtado

atualizados++

console.log(`✅ Produto localizado: "${produto.titulo}" -> Link salvo!`)

} else {

console.log(`⚠️ Título encontrado ["${tituloPagina}"], mas não bateu com nenhum item do JSON.`);

}

} else {

console.log(`❌ Não foi possível encontrar a tag .ui-pdp-title na página para o link: ${linkEncurtado}`)

}



} catch (erroLink) {

console.error(`❌ Erro ao processar o link ${linkEncurtado}:`, erroLink.message)

}

}



fs.writeFileSync(arquivoTemporario, JSON.stringify(listaTemp, null, 2), 'utf-8')

console.log(`\n📦 Processo concluído! ${atualizados} de ${listaLinks.length} produtos atualizados.`);



} catch (erro) {

console.error('❌ Erro geral:', erro.message)

}

}








function aplicarLinksConvertidos(arquivoPrincipal, arquivoEditado) {

    try {
        const dadosPrincipal = JSON.parse(fs.readFileSync(arquivoPrincipal, 'utf-8'))
        const dadosEditados = JSON.parse(fs.readFileSync(arquivoEditado, 'utf-8')) // O arquivo que você alterou na mão

        const listaAtualizada = dadosPrincipal.map(produto => {

            // Procura o ID correspondente 

            const itemEditado = dadosEditados.find(item => item.id === produto.id)
            
            if (itemEditado) {
                return {
                    ...produto,

                    link: itemEditado.link // Injeta o link de afiliado
                }
            }
            return produto
        });

        fs.writeFileSync(arquivoPrincipal, JSON.stringify(listaAtualizada, null, 2), 'utf-8')
        console.log(`✅ O arquivo principal "${arquivoPrincipal}" foi atualizado com sucesso!`)
    } catch (erro) {
        console.error('Erro ao aplicar os links:', erro.message)
    }
}



// exportarLinksParaConversao('ofertas_mercadolivre.json', 'para_converter.json', 'links_para_gerar.txt')

// atualizarListaTemporaria('para_converter.json',arrayNovosLinks)


aplicarLinksConvertidos('ofertas_mercadolivre.json', 'para_converter.json');