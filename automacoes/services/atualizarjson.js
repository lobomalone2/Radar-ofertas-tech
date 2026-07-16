const fs = require('fs')
const { JSDOM } = require('jsdom')
const arrayNovosLinks = [
  "https://meli.la/1DcUBFY",
  "https://meli.la/2uohG85",
  "https://meli.la/2kd1vyh",
  "https://meli.la/16jXXoB",
  "https://meli.la/14Uio7S",
  "https://meli.la/32wWnxb",
  "https://meli.la/1WPt2EU",
  "https://meli.la/1KKbMwv",
  "https://meli.la/1CLrAqd",
  "https://meli.la/2jKGknr",
  "https://meli.la/2mMcVG1",
  "https://meli.la/1qUueUr",
  "https://meli.la/2sXCBqA",
  "https://meli.la/18FkD9r",
  "https://meli.la/1h3oeki",
  "https://meli.la/1KNt5ph",
  "https://meli.la/2jSvsoS",
  "https://meli.la/2WJmDbS",
  "https://meli.la/1dmUAYL",
  "https://meli.la/2frqbvA",
  "https://meli.la/1XThKzQ",
  "https://meli.la/1712G1R",
  "https://meli.la/1CsPfdG",
  "https://meli.la/2TZoZtw",
  "https://meli.la/2LY8zTr",
  "https://meli.la/1kHMqcr",
  "https://meli.la/151JmrF",
  "https://meli.la/1kUvhJa",
  "https://meli.la/1L6LFNH",
  "https://meli.la/2fN8Zdd",
  "https://meli.la/19M1Dji",
  "https://meli.la/2hu1Tgj",
  "https://meli.la/1N9Qw49",
  "https://meli.la/1DCwmzo",
  "https://meli.la/2fBjq59",
  "https://meli.la/1DCwmzo",
  "https://meli.la/2wBDh6d",
  "https://meli.la/1o8TmTm",
  "https://meli.la/1sjynE9",
  "https://meli.la/2FEAqxm",
  "https://meli.la/1trhS6M",
  "https://meli.la/1aUYsoq",
  "https://meli.la/11W3F7Z",
  "https://meli.la/2RsPsWE",
  "https://meli.la/1V9QL1k",
  "https://meli.la/2xoU9mx",
  "https://meli.la/2EMe6Qd",
  "https://meli.la/2xzf2tC",
  "https://meli.la/2eV3ngr",
  "https://meli.la/25GQ1Tt",
  "https://meli.la/1dr7e4v",
  "https://meli.la/21eURV2",
  "https://meli.la/2R4M8JH",
  "https://meli.la/2eDyUNg",
  "https://meli.la/1ZfWgjS",
  "https://meli.la/13pj4Wq",
  "https://meli.la/2Nu1Rk2",
  "https://meli.la/1uYRBbF",
  "https://meli.la/1hHRDrf",
  "https://meli.la/1y2Sq25",
  "https://meli.la/1N8h5kc",
  "https://meli.la/2ni7q1J",
  "https://meli.la/2X2GFBZ",
  "https://meli.la/196YRhy",
  "https://meli.la/2n3LY2E",
  "https://meli.la/2FQCZqR",
  "https://meli.la/2xTA8yu",
  "https://meli.la/1k9mNys",
  "https://meli.la/141VhYm",
  "https://meli.la/1PMyPmb",
  "https://meli.la/2LVNrzM",
  "https://meli.la/2ckLTVq",
  "https://meli.la/1RFjmdv",
  "https://meli.la/2wcwp7C",
  "https://meli.la/25Cjy62",
  "https://meli.la/2MXcL55",
  "https://meli.la/2fyEdLq",
  "https://meli.la/2xqfg5o",
  "https://meli.la/1vwSFiQ",
  "https://meli.la/1xzScxm",
  "https://meli.la/2awe9FC",
  "https://meli.la/1bzqi3F",
  "https://meli.la/17NqjQN",
  "https://meli.la/1aF4tMF",
  "https://meli.la/1RAMTDe",
  "https://meli.la/1Ym3fRn",
  "https://meli.la/2inyZXF",
  "https://meli.la/26A3Au7",
  "https://meli.la/2dR1UBq",
  "https://meli.la/2HM74YZ",
  "https://meli.la/2inyZXF",
  "https://meli.la/1Hjzb3C",
  "https://meli.la/2bUDE2x",
  "https://meli.la/2bUDE2x",
  "https://meli.la/167Lwss",
  "https://meli.la/21uEztJ",
  "https://meli.la/1ChnVA3",
  "https://meli.la/2VgHUmG",
  "https://meli.la/1Hyw1EM",
  "https://meli.la/1V1x254",
  "https://meli.la/1ojKWWh",
  "https://meli.la/2ix3vS4",
  "https://meli.la/1foxP5o",
  "https://meli.la/1b6kugM",
  "https://meli.la/1V1x254",
  "https://meli.la/2iA32Wp",
  "https://meli.la/27azJ4k",
  "https://meli.la/2bnzqpJ",
  "https://meli.la/1avbqqo",
  "https://meli.la/2dBZCDj",
  "https://meli.la/28VMKgu",
  "https://meli.la/28WjL8L",
  "https://meli.la/1sY5XSt",
  "https://meli.la/2KYHerW",
  "https://meli.la/1srKkse",
  "https://meli.la/1vUnW3w",
  "https://meli.la/1Xpbnmp",
  "https://meli.la/2foCBrA",
  "https://meli.la/2gdbo3Y",
  "https://meli.la/2hVW2BU",
  "https://meli.la/266Mx4b",
  "https://meli.la/2CETcb7",
  "https://meli.la/2UQgD5Q",
  "https://meli.la/2c9C8up",
  "https://meli.la/1G1sVjT",
  "https://meli.la/1nzYxWc",
  "https://meli.la/1rmedj8",
  "https://meli.la/14pR31J",
  "https://meli.la/1EKgjdq",
  "https://meli.la/2gAirwb",
  "https://meli.la/1RVJsTr",
  "https://meli.la/2RNwENt",
  "https://meli.la/2fZV5xq",
  "https://meli.la/1zV6KFZ",
  "https://meli.la/1eyLh4i",
  "https://meli.la/1eyLh4i",
  "https://meli.la/1KaDBxE",
  "https://meli.la/19grVZZ",
  "https://meli.la/2Fpv2Ap",
  "https://meli.la/2ojLpjc",
  "https://meli.la/2Fpv2Ap",
  "https://meli.la/1BUkujJ",
  "https://meli.la/2D98QfD",
  "https://meli.la/1SUo33d"
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