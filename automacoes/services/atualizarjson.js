const fs = require('fs')
const { JSDOM } = require('jsdom')

const arrayNovosLinks = [
  "https://meli.la/18gMtR2",
  "https://meli.la/2LY8zTr",
  "https://meli.la/1dmUAYL",
  "https://meli.la/1jxnuN2",
  "https://meli.la/11dtGCE",
  "https://meli.la/2skdpRc",
  "https://meli.la/1LgTTai",
  "https://meli.la/2p3spGx",
  "https://meli.la/1EsPGP1",
  "https://meli.la/1wEqDt9",
  "https://meli.la/259Wv66",
  "https://meli.la/1Erz9RX",
  "https://meli.la/1QZAGr9",
  "https://meli.la/1X1tFkd",
  "https://meli.la/1KrkitR",
  "https://meli.la/2xLYKw2",
  "https://meli.la/1RyH7Y8",
  "https://meli.la/32vYr7i",
  "https://meli.la/2iBccsY",
  "https://meli.la/1aSdsUL",
  "https://meli.la/1BpJqg7",
  "https://meli.la/2YGGjEE",
  "https://meli.la/1Aa29Rv",
  "https://meli.la/2AEg9g3",
  "https://meli.la/2BjYnma",
  "https://meli.la/2NTBSSy",
  "https://meli.la/2nPzKWe",
  "https://meli.la/1UQK5bV",
  "https://meli.la/2Sz67UF",
  "https://meli.la/1mKskVK",
  "https://meli.la/1pCsuQB",
  "https://meli.la/1WZXhxp",
  "https://meli.la/2e2zLNX",
  "https://meli.la/2euFmmj",
  "https://meli.la/2b669Pw",
  "https://meli.la/1Mqec35",
  "https://meli.la/2DsRwea",
  "https://meli.la/2E5wEG1",
  "https://meli.la/2ecqyLB",
  "https://meli.la/1KC4oHE",
  "https://meli.la/1nzYxWc",
  "https://meli.la/1f9AYWi",
  "https://meli.la/2wBDh6d",
  "https://meli.la/1KaDBxE",
  "https://meli.la/2WLckva",
  "https://meli.la/1mu1sQj",
  "https://meli.la/2inyZXF",
  "https://meli.la/2SEB6rZ",
  "https://meli.la/2e8rp5J",
  "https://meli.la/1Ym3fRn",
  "https://meli.la/1sbXgSM",
  "https://meli.la/24y9NGH",
  "https://meli.la/1PhvuKc",
  "https://meli.la/2R4M8JH",
  "https://meli.la/2jHgiQ3",
  "https://meli.la/2TZoZtw",
  "https://meli.la/1omUrFh",
  "https://meli.la/1bactBp",
  "https://meli.la/1oNWgwa",
  "https://meli.la/2rxR2PB",
  "https://meli.la/18gMtR2",
  "https://meli.la/2QE7Pds",
  "https://meli.la/2w7skZe",
  "https://meli.la/2xGugaP",
  "https://meli.la/2bEFzat",
  "https://meli.la/2LY8zTr",
  "https://meli.la/2z372tZ",
  "https://meli.la/2wksFr6",
  "https://meli.la/1BW4kSa",
  "https://meli.la/2tPegeu",
  "https://meli.la/1ATCL5b",
  "https://meli.la/16E7VdY",
  "https://meli.la/1MhEpQA",
  "https://meli.la/2EiENV3",
  "https://meli.la/1eLmKrb",
  "https://meli.la/2jaNGnd",
  "https://meli.la/2sAJwmy",
  "https://meli.la/167Lwss",
  "https://meli.la/1V1x254",
  "https://meli.la/1M7memg",
  "https://meli.la/1TgT3fk",
  "https://meli.la/2JQNcjr",
  "https://meli.la/14bMpU2",
  "https://meli.la/1HjAGyJ",
  "https://meli.la/1QxA7Dc",
  "https://meli.la/1AJPwQa",
  "https://meli.la/2e5g35h",
  "https://meli.la/1WeQX9M",
  "https://meli.la/2bpV7LP",
  "https://meli.la/1HxfDny",
  "https://meli.la/1tTkeSS",
  "https://meli.la/2VnYWma",
  "https://meli.la/2o92xkj",
  "https://meli.la/1nsrNXR",
  "https://meli.la/2Ya6BpG",
  "https://meli.la/1YZmi1A",
  "https://meli.la/2fxpKWg",
  "https://meli.la/2ug8pWA",
  "https://meli.la/2TZoZtw",
  "https://meli.la/2tPegeu",
  "https://meli.la/21NPwY1",
  "https://meli.la/2QQzDEg",
  "https://meli.la/2Lhxigp",
  "https://meli.la/2uNF22c",
  "https://meli.la/2vQetVx",
  "https://meli.la/1PN3biV",
  "https://meli.la/2z372tZ",
  "https://meli.la/2kY5Qz5",
  "https://meli.la/1mWiK1L",
  "https://meli.la/2CzvPi9",
  "https://meli.la/21UKsm2",
  "https://meli.la/16e1E9p",
  "https://meli.la/2B3CHmc",
  "https://meli.la/2GmrKoK",
  "https://meli.la/16cYdeD",
  "https://meli.la/16gTcib",
  "https://meli.la/2aN9bLj",
  "https://meli.la/17exj43",
  "https://meli.la/12yycMU",
  "https://meli.la/1ZNKsHx",
  "https://meli.la/2yLFxMP",
  "https://meli.la/327XMAs",
  "https://meli.la/2V9ryC9",
  "https://meli.la/1FWJ9TT",
  "https://meli.la/2684XT4",
  "https://meli.la/2K2XRD6",
  "https://meli.la/1N8ER8d",
  "https://meli.la/2uoc9FH",
  "https://meli.la/18gMtR2",
  "https://meli.la/1Aa29Rv",
  "https://meli.la/2LY8zTr",
  "https://meli.la/2rFBbbs",
  "https://meli.la/2AEg9g3",
  "https://meli.la/2onC9wZ",
  "https://meli.la/1dmUAYL",
  "https://meli.la/2BjYnma",
  "https://meli.la/2NTBSSy",
  "https://meli.la/2nPzKWe",
  "https://meli.la/1jxnuN2",
  "https://meli.la/11dtGCE",
  "https://meli.la/2skdpRc",
  "https://meli.la/1LgTTai",
  "https://meli.la/2p3spGx",
  "https://meli.la/1EsPGP1",
  "https://meli.la/1wEqDt9",
  "https://meli.la/1UQK5bV",
  "https://meli.la/2Sz67UF",
  "https://meli.la/259Wv66",
  "https://meli.la/1mKskVK",
  "https://meli.la/1pCsuQB",
  "https://meli.la/1Erz9RX",
  "https://meli.la/1WZXhxp",
  "https://meli.la/1QZAGr9",
  "https://meli.la/2e2zLNX",
  "https://meli.la/2euFmmj",
  "https://meli.la/1X1tFkd",
  "https://meli.la/1KrkitR",
  "https://meli.la/2xLYKw2",
  "https://meli.la/1RyH7Y8",
  "https://meli.la/32vYr7i",
  "https://meli.la/2iBccsY",
  "https://meli.la/1aSdsUL",
  "https://meli.la/2b669Pw",
  "https://meli.la/1Mqec35",
  "https://meli.la/2DsRwea",
  "https://meli.la/1BpJqg7",
  "https://meli.la/2YGGjEE",
  "https://meli.la/1G5qaT7",
  "https://meli.la/2E5wEG1",
  "https://meli.la/14Uio7S",
  "https://meli.la/196YRhy",
  "https://meli.la/1RFjmdv",
  "https://meli.la/1kHMqcr",
  "https://meli.la/13pj4Wq",
  "https://meli.la/2DmCLr2",
  "https://meli.la/1dr7e4v",
  "https://meli.la/1rCaiVA",
  "https://meli.la/2QP1cnB",
  "https://meli.la/1EVWsHf",
  "https://meli.la/18UvW5A",
  "https://meli.la/1UyLj9j",
  "https://meli.la/1jUve4Q",
  "https://meli.la/2xoU9mx",
  "https://meli.la/2frqbvA",
  "https://meli.la/19M1Dji",
  "https://meli.la/2vvNreD",
  "https://meli.la/1N9Qw49",
  "https://meli.la/1712G1R",
  "https://meli.la/19WtbLr",
  "https://meli.la/2jF6kDP",
  "https://meli.la/1bPUd3X",
  "https://meli.la/2qeYNeo",
  "https://meli.la/2YA8pXB",
  "https://meli.la/2L4eSi2",
  "https://meli.la/1RFVMwN",
  "https://meli.la/2UQgD5Q",
  "https://meli.la/1V9QL1k",
  "https://meli.la/1siTnLx",
  "https://meli.la/2Trceos",
  "https://meli.la/141VhYm",
  "https://meli.la/24LyPvo",
  "https://meli.la/1wBU2zS",
  "https://meli.la/2FEAqxm",
  "https://meli.la/1trhS6M",
  "https://meli.la/2FDw7ZE",
  "https://meli.la/17KbiRr",
  "https://meli.la/18rYCzx",
  "https://meli.la/1PiT11Z",
  "https://meli.la/2zAqhKT",
  "https://meli.la/23nYmhi",
  "https://meli.la/1nKZ59e",
  "https://meli.la/2jSvsoS",
  "https://meli.la/18nJPyR",
  "https://meli.la/2tnZmpC",
  "https://meli.la/18u5WiU",
  "https://meli.la/1WtpUv4",
  "https://meli.la/18AYnxU",
  "https://meli.la/1QzurJH",
  "https://meli.la/1farm85",
  "https://meli.la/21UgsZ5",
  "https://meli.la/2nkCZKe",
  "https://meli.la/24pjPyj",
  "https://meli.la/1gsX9bG",
  "https://meli.la/1Xqx9ae",
  "https://meli.la/1gKpuJB",
  "https://meli.la/2iANE88",
  "https://meli.la/1bD6cw5",
  "https://meli.la/2pxM8fY",
  "https://meli.la/12oqmhr",
  "https://meli.la/1gzksXE",
  "https://meli.la/15yqY2h",
  "https://meli.la/2jBbVsZ",
  "https://meli.la/1CEL7sS",
  "https://meli.la/16cdwqx",
  "https://meli.la/1uPVMb8",
  "https://meli.la/148nMr2",
  "https://meli.la/1AWYi3Z",
  "https://meli.la/23w1zTF",
  "https://meli.la/15TbudC",
  "https://meli.la/13866Yv",
  "https://meli.la/2Z3HHQ5",
  "https://meli.la/1UXKhvP",
  "https://meli.la/1edZw9f",
  "https://meli.la/1UqqLvw",
  "https://meli.la/2qGdiYb",
  "https://meli.la/15vvQAa",
  "https://meli.la/2kWLGoZ",
  "https://meli.la/1znv3xJ",
  "https://meli.la/1nQx5VH",
  "https://meli.la/2d3vVbM",
  "https://meli.la/1v2ctrZ",
  "https://meli.la/1BEvGXL",
  "https://meli.la/2XCHwCf",
  "https://meli.la/1wAPYBN",
  "https://meli.la/2RvWKFX",
  "https://meli.la/1qEq6tE",
  "https://meli.la/11W3F7Z",
  "https://meli.la/2n3LY2E",
  "https://meli.la/1vwSFiQ",
  "https://meli.la/1Zj8h8a",
  "https://meli.la/1bzqi3F",
  "https://meli.la/2FQCZqR",
  "https://meli.la/2URjExj",
  "https://meli.la/2inyZXF",
  "https://meli.la/1EVWsHf",
  "https://meli.la/24y9NGH",
  "https://meli.la/2WyDnp1",
  "https://meli.la/27azJ4k",
  "https://meli.la/1Hyw1EM",
  "https://meli.la/19M1Dji",
  "https://meli.la/2X5JPih",
  "https://meli.la/1ChnVA3",
  "https://meli.la/2RicXA5",
  "https://meli.la/1vtjKMQ",
  "https://meli.la/2T5Bwnp",
  "https://meli.la/1nBv9Tv",
  "https://meli.la/2Nu1Rk2",
  "https://meli.la/2VwPLjE",
  "https://meli.la/1hHRDrf",
  "https://meli.la/2YLtSwg",
  "https://meli.la/1zV6KFZ",
  "https://meli.la/22FD9D6",
  "https://meli.la/1Z85srE",
  "https://meli.la/1J35ZPR",
  "https://meli.la/2fMSKD6",
  "https://meli.la/2BXNJD9",
  "https://meli.la/2ub5mgT",
  "https://meli.la/2uVXX7N",
  "https://meli.la/23kmn1S",
  "https://meli.la/2h5ZWxd",
  "https://meli.la/12W9EMA",
  "https://meli.la/1V1x254",
  "https://meli.la/2e5g35h",
  "https://meli.la/2iSp3d5",
  "https://meli.la/2K96B9z",
  "https://meli.la/2E4uVjN",
  "https://meli.la/2WaMRrD",
  "https://meli.la/2VgHUmG",
  "https://meli.la/2kd1vyh",
  "https://meli.la/141VhYm",
  "https://meli.la/1AJPwQa",
  "https://meli.la/1EVWsHf",
  "https://meli.la/19M1Dji",
  "https://meli.la/1712G1R",
  "https://meli.la/1RFVMwN",
  "https://meli.la/141VhYm",
  "https://meli.la/2FEAqxm",
  "https://meli.la/1trhS6M",
  "https://meli.la/18rYCzx",
  "https://meli.la/1PiT11Z",
  "https://meli.la/2zAqhKT",
  "https://meli.la/2jSvsoS",
  "https://meli.la/1Se8iJt",
  "https://meli.la/1vZwZp8",
  "https://meli.la/2ub6poN",
  "https://meli.la/2k71YZN",
  "https://meli.la/1fQ7QGG",
  "https://meli.la/2ZTxW3k",
  "https://meli.la/1uqayPn",
  "https://meli.la/2jKGknr",
  "https://meli.la/25zjovK",
  "https://meli.la/1oMkfEX",
  "https://meli.la/1jMxy8x",
  "https://meli.la/1cxLyXh",
  "https://meli.la/1ocH2oQ",
  "https://meli.la/32TWbhX",
  "https://meli.la/1HL8BFS",
  "https://meli.la/2FEHKqZ",
  "https://meli.la/1Jzdv5L",
  "https://meli.la/1sGevNK",
  "https://meli.la/27SmBQr",
  "https://meli.la/21aAwFh",
  "https://meli.la/1Qmy5FC",
  "https://meli.la/1YNc4Fr",
  "https://meli.la/2wfCT8M",
  "https://meli.la/1hZo8MB",
  "https://meli.la/2SAEx3z",
  "https://meli.la/1p8dXqv",
  "https://meli.la/1vXcXeB"
]

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