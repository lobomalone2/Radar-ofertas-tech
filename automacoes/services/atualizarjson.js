const fs = require('fs')
const { JSDOM } = require('jsdom')
const arrayNovosLinks = [
  "https://meli.la/2KF5fmh",
  "https://meli.la/1nzYxWc",
  "https://meli.la/2bnzqpJ",
  "https://meli.la/1mu1sQj",
  "https://meli.la/24y9NGH",
  "https://meli.la/1KaDBxE",
  "https://meli.la/1Ym3fRn",
  "https://meli.la/1RVJsTr",
  "https://meli.la/2tPegeu",
  "https://meli.la/1j291WQ",
  "https://meli.la/167Lwss",
  "https://meli.la/2qZEfS7",
  "https://meli.la/1RNvTKc",
  "https://meli.la/1K6frJL",
  "https://meli.la/2QE7Pds",
  "https://meli.la/18FkD9r",
  "https://meli.la/2EiENV3",
  "https://meli.la/1srKkse",
  "https://meli.la/1V1x254",
  "https://meli.la/2hUAVvL",
  "https://meli.la/1fV4eeb",
  "https://meli.la/1XLKJF5",
  "https://meli.la/2e8rp5J",
  "https://meli.la/2et19Be",
  "https://meli.la/164m9GH",
  "https://meli.la/1sbXgSM",
  "https://meli.la/2qDVsHb",
  "https://meli.la/2sAJwmy",
  "https://meli.la/2LaPiXd",
  "https://meli.la/1dmUAYL",
  "https://meli.la/2jHgiQ3",
  "https://meli.la/2TZoZtw",
  "https://meli.la/2i4NY9s",
  "https://meli.la/2gnLVeD",
  "https://meli.la/33eL1Kh",
  "https://meli.la/29zSjhN",
  "https://meli.la/2R4M8JH",
  "https://meli.la/1ATCL5b",
  "https://meli.la/225VT7g",
  "https://meli.la/1HGsg8Z",
  "https://meli.la/2z372tZ",
  "https://meli.la/2j3BV2y",
  "https://meli.la/1JEKETf",
  "https://meli.la/2LY8zTr",
  "https://meli.la/2VL6Gkc",
  "https://meli.la/1Vtuf7J",
  "https://meli.la/12ERhwT",
  "https://meli.la/2m4scDC",
  "https://meli.la/26zXMPo",
  "https://meli.la/1Wmat6J",
  "https://meli.la/2Tn7pJd",
  "https://meli.la/1RFjmdv",
  "https://meli.la/2frqbvA",
  "https://meli.la/2jb7YtK",
  "https://meli.la/1dr7e4v",
  "https://meli.la/196YRhy",
  "https://meli.la/2xoU9mx",
  "https://meli.la/1UyLj9j",
  "https://meli.la/19M1Dji",
  "https://meli.la/18UvW5A",
  "https://meli.la/2qeYNeo",
  "https://meli.la/2HDdzgT",
  "https://meli.la/1xyse71",
  "https://meli.la/2FEAqxm",
  "https://meli.la/2jSvsoS",
  "https://meli.la/1V9QL1k",
  "https://meli.la/2jF6kDP",
  "https://meli.la/1N9Qw49",
  "https://meli.la/18nJPyR",
  "https://meli.la/1M5rvEv",
  "https://meli.la/28WjL8L",
  "https://meli.la/1712G1R",
  "https://meli.la/2QP1cnB",
  "https://meli.la/1trhS6M",
  "https://meli.la/141VhYm",
  "https://meli.la/2fN8Zdd",
  "https://meli.la/2zAqhKT",
  "https://meli.la/27AfW8Q",
  "https://meli.la/2UQgD5Q",
  "https://meli.la/1C2PVWn",
  "https://meli.la/16jXXoB",
  "https://meli.la/335cwoR",
  "https://meli.la/1EKmcPi",
  "https://meli.la/2hu1Tgj",
  "https://meli.la/2VMJyG2",
  "https://meli.la/25Cjy62",
  "https://meli.la/1qrBCxh",
  "https://meli.la/13NdDpp",
  "https://meli.la/1kTTcBP",
  "https://meli.la/18rYCzx",
  "https://meli.la/1rCaiVA",
  "https://meli.la/1dK6rbk",
  "https://meli.la/1NGindE",
  "https://meli.la/1o5cBbw",
  "https://meli.la/1Wmat6J",
  "https://meli.la/1qEq6tE",
  "https://meli.la/2n3LY2E",
  "https://meli.la/1bzqi3F",
  "https://meli.la/11W3F7Z",
  "https://meli.la/2RicXA5",
  "https://meli.la/2FQCZqR",
  "https://meli.la/1vwSFiQ",
  "https://meli.la/24y9NGH",
  "https://meli.la/19M1Dji",
  "https://meli.la/2tbMFCn",
  "https://meli.la/27azJ4k",
  "https://meli.la/2URjExj",
  "https://meli.la/2WyDnp1",
  "https://meli.la/1hHRDrf",
  "https://meli.la/1Z85srE",
  "https://meli.la/1xyse71",
  "https://meli.la/1V1x254",
  "https://meli.la/1ChnVA3",
  "https://meli.la/2hUAVvL",
  "https://meli.la/1fV4eeb",
  "https://meli.la/2N1Pkmf",
  "https://meli.la/2qDVsHb",
  "https://meli.la/1xzScxm",
  "https://meli.la/12W9EMA",
  "https://meli.la/1aUYsoq",
  "https://meli.la/2sXCBqA",
  "https://meli.la/23kmn1S",
  "https://meli.la/1trhS6M",
  "https://meli.la/2uVXX7N",
  "https://meli.la/2MVBWcJ",
  "https://meli.la/141VhYm",
  "https://meli.la/1qUueUr",
  "https://meli.la/2ni7q1J",
  "https://meli.la/2kd1vyh",
  "https://meli.la/1Hyw1EM",
  "https://meli.la/1UacWfL",
  "https://meli.la/1ZLdD3v",
  "https://meli.la/2VgHUmG",
  "https://meli.la/1zV6KFZ",
  "https://meli.la/2VwPLjE",
  "https://meli.la/2e5g35h",
  "https://meli.la/1AJPwQa"
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