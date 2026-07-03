const fs = require('fs')
const { JSDOM } = require('jsdom')
const arrayNovosLinks = [
  "https://meli.la/1DcUBFY",
  "https://meli.la/26GrU19",
  "https://meli.la/2kd1vyh",
  "https://meli.la/2xiVmjC",
  "https://meli.la/16jXXoB",
  "https://meli.la/2UG4wk7",
  "https://meli.la/1CLrAqd",
  "https://meli.la/2mMcVG1",
  "https://meli.la/2BXb3T2",
  "https://meli.la/2sXCBqA",
  "https://meli.la/2n1qNXk",
  "https://meli.la/1KNt5ph",
  "https://meli.la/1dmUAYL",
  "https://meli.la/2gEm6YS",
  "https://meli.la/1XThKzQ",
  "https://meli.la/1712G1R",
  "https://meli.la/1CsPfdG",
  "https://meli.la/2LY8zTr",
  "https://meli.la/1YVekEP",
  "https://meli.la/1Lq8cy2",
  "https://meli.la/1Grsyy9",
  "https://meli.la/151JmrF",
  "https://meli.la/1jsVhoR",
  "https://meli.la/2TZoZtw",
  "https://meli.la/1kUvhJa",
  "https://meli.la/19M1Dji",
  "https://meli.la/1L6LFNH",
  "https://meli.la/1N9Qw49",
  "https://meli.la/2fN8Zdd",
  "https://meli.la/2YHtrJg",
  "https://meli.la/1nDfbfV",
  "https://meli.la/2wBDh6d",
  "https://meli.la/1YZq19V",
  "https://meli.la/2FQCZqR",
  "https://meli.la/2KF5fmh",
  "https://meli.la/26zXMPo",
  "https://meli.la/2VgHUmG",
  "https://meli.la/1Hyw1EM",
  "https://meli.la/2V2MV7G",
  "https://meli.la/1V1x254",
  "https://meli.la/1ojKWWh",
  "https://meli.la/1RNvTKc",
  "https://meli.la/26A3Au7",
  "https://meli.la/2Lm44V2",
  "https://meli.la/1V1x254",
  "https://meli.la/2gnLVeD",
  "https://meli.la/27azJ4k",
  "https://meli.la/1bzqi3F",
  "https://meli.la/2bnzqpJ",
  "https://meli.la/2et19Be",
  "https://meli.la/1qXRW7t",
  "https://meli.la/28VMKgu",
  "https://meli.la/28WjL8L",
  "https://meli.la/1Xpbnmp",
  "https://meli.la/2foCBrA",
  "https://meli.la/2gdbo3Y",
  "https://meli.la/1BW4kSa",
  "https://meli.la/2hVW2BU",
  "https://meli.la/2W6yv2J",
  "https://meli.la/1c8Cv5X",
  "https://meli.la/2S7xTPE",
  "https://meli.la/2UQgD5Q",
  "https://meli.la/1NVQBgk",
  "https://meli.la/1nzYxWc",
  "https://meli.la/1BUkujJ",
  "https://meli.la/1b1DtSU",
  "https://meli.la/1EKgjdq",
  "https://meli.la/2UUB8Zs",
  "https://meli.la/1RVJsTr",
  "https://meli.la/2VUn4jx",
  "https://meli.la/2fZV5xq",
  "https://meli.la/1UZb7fX",
  "https://meli.la/2pyoVgG",
  "https://meli.la/1zV6KFZ",
  "https://meli.la/1eyLh4i",
  "https://meli.la/1eyLh4i",
  "https://meli.la/1KaDBxE",
  "https://meli.la/2pMjeNk",
  "https://meli.la/2Fpv2Ap",
  "https://meli.la/2ojLpjc",
  "https://meli.la/1gCN8Mf",
  "https://meli.la/14b6JG3",
  "https://meli.la/2fQTfUo",
  "https://meli.la/24LyPvo",
  "https://meli.la/1d157wK",
  "https://meli.la/1aUYsoq",
  "https://meli.la/1b7YMFm",
  "https://meli.la/28eR3Gu",
  "https://meli.la/2kHKjCb",
  "https://meli.la/141VhYm",
  "https://meli.la/2zAqhKT",
  "https://meli.la/2FDw7ZE",
  "https://meli.la/12W9EMA",
  "https://meli.la/1MhEpQA",
  "https://meli.la/2ooDwvx",
  "https://meli.la/2LVNrzM",
  "https://meli.la/2ckLTVq",
  "https://meli.la/2sAJwmy",
  "https://meli.la/1KKbMwv",
  "https://meli.la/1RFjmdv",
  "https://meli.la/2wcwp7C",
  "https://meli.la/2X5JPih",
  "https://meli.la/1NcjuVe",
  "https://meli.la/2QkqGtD",
  "https://meli.la/1Vz1Emi",
  "https://meli.la/2w7skZe",
  "https://meli.la/2xqfg5o",
  "https://meli.la/1ELwnpi",
  "https://meli.la/17NqjQN",
  "https://meli.la/2yZsGUS",
  "https://meli.la/2yZsGUS",
  "https://meli.la/2HM74YZ",
  "https://meli.la/2inyZXF",
  "https://meli.la/1raZXtM",
  "https://meli.la/1vwSFiQ",
  "https://meli.la/167Lwss",
  "https://meli.la/2FEAqxm",
  "https://meli.la/1trhS6M",
  "https://meli.la/1cGuQHj",
  "https://meli.la/11W3F7Z",
  "https://meli.la/2RsPsWE",
  "https://meli.la/2vvNreD",
  "https://meli.la/1V9QL1k",
  "https://meli.la/2wQ89NS",
  "https://meli.la/2EMe6Qd",
  "https://meli.la/2Afxdkk",
  "https://meli.la/2WQYF9a",
  "https://meli.la/1yuLM6Y",
  "https://meli.la/2iHeFvW",
  "https://meli.la/1dr7e4v",
  "https://meli.la/21eURV2",
  "https://meli.la/1KxTfc1",
  "https://meli.la/2Xu1tsy",
  "https://meli.la/2eDyUNg",
  "https://meli.la/1ZfWgjS",
  "https://meli.la/2Nu1Rk2",
  "https://meli.la/1hHRDrf",
  "https://meli.la/2jq6od7",
  "https://meli.la/13mEnG9",
  "https://meli.la/2m4scDC",
  "https://meli.la/2zD1Kya",
  "https://meli.la/196YRhy",
  "https://meli.la/2n3LY2E"
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