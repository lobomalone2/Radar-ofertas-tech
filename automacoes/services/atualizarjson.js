const fs = require('fs')
const { JSDOM } = require('jsdom')

const arrayNovosLinks = [
  "https://meli.la/1dmUAYL",
  "https://meli.la/1E4JxYe",
  "https://meli.la/1q14T2N",
  "https://meli.la/1LSjWcA",
  "https://meli.la/1UF4PJu",
  "https://meli.la/1fVHPtK",
  "https://meli.la/2bdKMqj",
  "https://meli.la/1RyH7Y8",
  "https://meli.la/2xLYKw2",
  "https://meli.la/1XSCc3k",
  "https://meli.la/14gYDg2",
  "https://meli.la/1Zn5bpW",
  "https://meli.la/22cBJZ4",
  "https://meli.la/2s57QFK",
  "https://meli.la/1cBwWLW",
  "https://meli.la/1Aa29Rv",
  "https://meli.la/18Xw8Je",
  "https://meli.la/2EoR1qr",
  "https://meli.la/1MQDjyi",
  "https://meli.la/2NFwQQ7",
  "https://meli.la/2nE8j29",
  "https://meli.la/1ousd12",
  "https://meli.la/1m5fDFq",
  "https://meli.la/1eVvB52",
  "https://meli.la/1SLz8z5",
  "https://meli.la/1mKskVK",
  "https://meli.la/2e2zLNX",
  "https://meli.la/1nNmTvZ",
  "https://meli.la/2JBmJHJ",
  "https://meli.la/1Tvcn5F",
  "https://meli.la/1nzYxWc",
  "https://meli.la/1KaDBxE",
  "https://meli.la/1f9AYWi",
  "https://meli.la/2tPegeu",
  "https://meli.la/2inyZXF",
  "https://meli.la/2FqhEXX",
  "https://meli.la/2dKCZBa",
  "https://meli.la/2bnzqpJ",
  "https://meli.la/2QQzDEg",
  "https://meli.la/2zX2mmi",
  "https://meli.la/2QE7Pds",
  "https://meli.la/24y9NGH",
  "https://meli.la/1Ym3fRn",
  "https://meli.la/1PhvuKc",
  "https://meli.la/1bactBp",
  "https://meli.la/1ojKWWh",
  "https://meli.la/25L5S23",
  "https://meli.la/2TZoZtw",
  "https://meli.la/2R4M8JH",
  "https://meli.la/2qZEfS7",
  "https://meli.la/1MhEpQA",
  "https://meli.la/167Lwss",
  "https://meli.la/1Vz1Emi",
  "https://meli.la/33XC3bf",
  "https://meli.la/1BUkujJ",
  "https://meli.la/2kY5Qz5",
  "https://meli.la/2kpjqfr",
  "https://meli.la/1swJ6jW",
  "https://meli.la/2mQsw83",
  "https://meli.la/1fCpb3W",
  "https://meli.la/1iqW7qk",
  "https://meli.la/1dmUAYL",
  "https://meli.la/1JEKETf",
  "https://meli.la/2e8rp5J",
  "https://meli.la/2xGugaP",
  "https://meli.la/2vmi9qm",
  "https://meli.la/1k7MswL",
  "https://meli.la/1tfY2kg",
  "https://meli.la/168nMf8",
  "https://meli.la/2wksFr6",
  "https://meli.la/1E4JxYe",
  "https://meli.la/1vWoNSu",
  "https://meli.la/2ggha6y",
  "https://meli.la/29zSjhN",
  "https://meli.la/2EiENV3",
  "https://meli.la/1HjAGyJ",
  "https://meli.la/1wfj5MG",
  "https://meli.la/2e5g35h",
  "https://meli.la/1n7DhvZ",
  "https://meli.la/2fxpKWg",
  "https://meli.la/16fxJiy",
  "https://meli.la/2CDAsXh",
  "https://meli.la/2FMmFnp",
  "https://meli.la/2tPegeu",
  "https://meli.la/2QQzDEg",
  "https://meli.la/2TZoZtw",
  "https://meli.la/2vmi9qm",
  "https://meli.la/29zSjhN",
  "https://meli.la/2SF2ibq",
  "https://meli.la/2kY5Qz5",
  "https://meli.la/12XbLMX",
  "https://meli.la/2odNJJR",
  "https://meli.la/1U8V3bA",
  "https://meli.la/16gTcib",
  "https://meli.la/1Uhw17v",
  "https://meli.la/2ZGdEd8",
  "https://meli.la/2K2XRD6",
  "https://meli.la/1a8EXQa",
  "https://meli.la/2CzvPi9",
  "https://meli.la/16e1E9p",
  "https://meli.la/1yWtSMp",
  "https://meli.la/2VqUZDF",
  "https://meli.la/2MjbtBR",
  "https://meli.la/2uoc9FH",
  "https://meli.la/2onC9wZ",
  "https://meli.la/15ohkn3",
  "https://meli.la/1Aa29Rv",
  "https://meli.la/1dmUAYL",
  "https://meli.la/18Xw8Je",
  "https://meli.la/1E4JxYe",
  "https://meli.la/2EoR1qr",
  "https://meli.la/1MQDjyi",
  "https://meli.la/1q14T2N",
  "https://meli.la/2NFwQQ7",
  "https://meli.la/1LSjWcA",
  "https://meli.la/2nE8j29",
  "https://meli.la/1UF4PJu",
  "https://meli.la/1ousd12",
  "https://meli.la/1m5fDFq",
  "https://meli.la/1fVHPtK",
  "https://meli.la/2bdKMqj",
  "https://meli.la/1RyH7Y8",
  "https://meli.la/2gPfdKi",
  "https://meli.la/1JoXvnf",
  "https://meli.la/2xLYKw2",
  "https://meli.la/1XSCc3k",
  "https://meli.la/1eVvB52",
  "https://meli.la/14gYDg2",
  "https://meli.la/1SLz8z5",
  "https://meli.la/1mKskVK",
  "https://meli.la/1Zn5bpW",
  "https://meli.la/22cBJZ4",
  "https://meli.la/2s57QFK",
  "https://meli.la/2e2zLNX",
  "https://meli.la/1nNmTvZ",
  "https://meli.la/1cBwWLW",
  "https://meli.la/2JBmJHJ",
  "https://meli.la/1Tvcn5F",
  "https://meli.la/1N9Qw49",
  "https://meli.la/2xUYLz9",
  "https://meli.la/1RFjmdv",
  "https://meli.la/2m4scDC",
  "https://meli.la/2QP1cnB",
  "https://meli.la/1dK6rbk",
  "https://meli.la/1dr7e4v",
  "https://meli.la/1UyLj9j",
  "https://meli.la/196YRhy",
  "https://meli.la/2xiVmjC",
  "https://meli.la/1CLrAqd",
  "https://meli.la/2FEAqxm",
  "https://meli.la/2HDdzgT",
  "https://meli.la/2xoU9mx",
  "https://meli.la/16DLCGG",
  "https://meli.la/1yuLM6Y",
  "https://meli.la/1sboxMx",
  "https://meli.la/2aA4RXa",
  "https://meli.la/1nKZ59e",
  "https://meli.la/1xyse71",
  "https://meli.la/19M1Dji",
  "https://meli.la/18UvW5A",
  "https://meli.la/2Trceos",
  "https://meli.la/2fN8Zdd",
  "https://meli.la/1o1F6QV",
  "https://meli.la/1DJr8VW",
  "https://meli.la/1712G1R",
  "https://meli.la/2cLcr3y",
  "https://meli.la/14xPaXJ",
  "https://meli.la/1V9QL1k",
  "https://meli.la/1Pno3bq",
  "https://meli.la/27Gaw4a",
  "https://meli.la/1wBU2zS",
  "https://meli.la/1trhS6M",
  "https://meli.la/1PiT11Z",
  "https://meli.la/2FDw7ZE",
  "https://meli.la/1vf5q87",
  "https://meli.la/1CXzuBz",
  "https://meli.la/1Gfke2v",
  "https://meli.la/141VhYm",
  "https://meli.la/2jF6kDP",
  "https://meli.la/2zAqhKT",
  "https://meli.la/1bFznjx",
  "https://meli.la/2vvNreD",
  "https://meli.la/1Se8iJt",
  "https://meli.la/1vZwZp8",
  "https://meli.la/1h3oeki",
  "https://meli.la/1b1DtSU",
  "https://meli.la/1n98bHA",
  "https://meli.la/1zNBP9H",
  "https://meli.la/2rHDQkF",
  "https://meli.la/2Lq33PL",
  "https://meli.la/1TvPG7z",
  "https://meli.la/1Xqx9ae",
  "https://meli.la/1VSt69w",
  "https://meli.la/1gsX9bG",
  "https://meli.la/23w1zTF",
  "https://meli.la/2HgPyQ9",
  "https://meli.la/2KGEi5N",
  "https://meli.la/2pWxmTC",
  "https://meli.la/2Gsz6mq",
  "https://meli.la/24pjPyj",
  "https://meli.la/2K8cNtF",
  "https://meli.la/2ZxHJX5",
  "https://meli.la/1BEvGXL",
  "https://meli.la/2kgAy8U",
  "https://meli.la/1hU9uin",
  "https://meli.la/1v2ctrZ",
  "https://meli.la/1mdnWs8",
  "https://meli.la/2gxZfVA",
  "https://meli.la/2HUgZT9",
  "https://meli.la/2gThf9q",
  "https://meli.la/1QhB1Mb",
  "https://meli.la/1iG2K9g",
  "https://meli.la/2Y3wPu6",
  "https://meli.la/2FeK1Wf",
  "https://meli.la/1qEq6tE",
  "https://meli.la/2kd1vyh",
  "https://meli.la/1vwSFiQ",
  "https://meli.la/2inyZXF",
  "https://meli.la/29UphTw",
  "https://meli.la/1bzqi3F",
  "https://meli.la/1xyse71",
  "https://meli.la/11W3F7Z",
  "https://meli.la/2jt3iBu",
  "https://meli.la/24y9NGH",
  "https://meli.la/19M1Dji",
  "https://meli.la/2uVXX7N",
  "https://meli.la/2VwPLjE",
  "https://meli.la/2sXCBqA",
  "https://meli.la/27azJ4k",
  "https://meli.la/2iSp3d5",
  "https://meli.la/2VgHUmG",
  "https://meli.la/2WyDnp1",
  "https://meli.la/1o1F6QV",
  "https://meli.la/2RicXA5",
  "https://meli.la/1ChnVA3",
  "https://meli.la/23kmn1S",
  "https://meli.la/1Z85srE",
  "https://meli.la/2BXNJD9",
  "https://meli.la/1zV6KFZ",
  "https://meli.la/1Hyw1EM",
  "https://meli.la/2Nu1Rk2",
  "https://meli.la/2r7CS2C",
  "https://meli.la/2FQCZqR",
  "https://meli.la/1trhS6M",
  "https://meli.la/1PiT11Z",
  "https://meli.la/1NcjuVe",
  "https://meli.la/2X5JPih",
  "https://meli.la/1SNb6s1",
  "https://meli.la/141VhYm",
  "https://meli.la/2e5g35h",
  "https://meli.la/2gAirwb",
  "https://meli.la/2LvaQ1a",
  "https://meli.la/1mZKG5K",
  "https://meli.la/1AJPwQa",
  "https://meli.la/1b1DtSU",
  "https://meli.la/1UacWfL",
  "https://meli.la/1Sb4b66",
  "https://meli.la/1sAVknY",
  "https://meli.la/2E4uVjN",
  "https://meli.la/28mxDro",
  "https://meli.la/21jC2Sy",
  "https://meli.la/2FEAqxm",
  "https://meli.la/1sboxMx",
  "https://meli.la/1xyse71",
  "https://meli.la/19M1Dji",
  "https://meli.la/1o1F6QV",
  "https://meli.la/1712G1R",
  "https://meli.la/14xPaXJ",
  "https://meli.la/1Pno3bq",
  "https://meli.la/1trhS6M",
  "https://meli.la/1PiT11Z",
  "https://meli.la/141VhYm",
  "https://meli.la/2zAqhKT",
  "https://meli.la/1bFznjx",
  "https://meli.la/1Se8iJt",
  "https://meli.la/1vZwZp8",
  "https://meli.la/1h3oeki",
  "https://meli.la/1b1DtSU",
  "https://meli.la/2uEu3Ya",
  "https://meli.la/1qrBCxh",
  "https://meli.la/1sAVknY",
  "https://meli.la/1bbMxXa",
  "https://meli.la/28HNtE8",
  "https://meli.la/29gMmhN",
  "https://meli.la/2Y5zXVS",
  "https://meli.la/1MiM1MH",
  "https://meli.la/2uHWLZp",
  "https://meli.la/2LgiKJz",
  "https://meli.la/1cqkV3J",
  "https://meli.la/1WDhoHV",
  "https://meli.la/1ocH2oQ",
  "https://meli.la/1T1uswm",
  "https://meli.la/1m682Sc",
  "https://meli.la/1GtimbP",
  "https://meli.la/1oPgJ4b",
  "https://meli.la/1SD31fA",
  "https://meli.la/28Lt7a4",
  "https://meli.la/14w8Vbe",
  "https://meli.la/25a7B8c",
  "https://meli.la/2GnNSed",
  "https://meli.la/33o57BP",
  "https://meli.la/18EoruA",
  "https://meli.la/1jveL1L"
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