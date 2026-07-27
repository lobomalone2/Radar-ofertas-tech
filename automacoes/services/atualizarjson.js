const fs = require('fs')
const { JSDOM } = require('jsdom')

const arrayNovosLinks = [
  "https://meli.la/1E4JxYe",
  "https://meli.la/1P7haB6",
  "https://meli.la/2x8RhWQ",
  "https://meli.la/1dmUAYL",
  "https://meli.la/1q14T2N",
  "https://meli.la/19grVZZ",
  "https://meli.la/1LSjWcA",
  "https://meli.la/2pdCkoT",
  "https://meli.la/2VmWGaL",
  "https://meli.la/1qjsNwb",
  "https://meli.la/2Ct7Tqt",
  "https://meli.la/1RyH7Y8",
  "https://meli.la/2Uxg8Ng",
  "https://meli.la/1XSCc3k",
  "https://meli.la/2xLYKw2",
  "https://meli.la/22cBJZ4",
  "https://meli.la/1iBKhXh",
  "https://meli.la/1Aa29Rv",
  "https://meli.la/18Xw8Je",
  "https://meli.la/21V2RK6",
  "https://meli.la/32ep7cJ",
  "https://meli.la/1VmoFG4",
  "https://meli.la/26amNmi",
  "https://meli.la/1NCA2PJ",
  "https://meli.la/2r4NLCF",
  "https://meli.la/1ii3p6j",
  "https://meli.la/1Mqec35",
  "https://meli.la/1CLVSZ1",
  "https://meli.la/129j4Wv",
  "https://meli.la/158spWM",
  "https://meli.la/2Niohbw",
  "https://meli.la/1BxpDsQ",
  "https://meli.la/2HefmEF",
  "https://meli.la/2ib9ArY",
  "https://meli.la/2E5wEG1",
  "https://meli.la/2bnzqpJ",
  "https://meli.la/2inyZXF",
  "https://meli.la/1E4JxYe",
  "https://meli.la/1XMxc7F",
  "https://meli.la/1P7haB6",
  "https://meli.la/167Lwss",
  "https://meli.la/2yZsGUS",
  "https://meli.la/2KF5fmh",
  "https://meli.la/198x1Gr",
  "https://meli.la/2W9N7oc",
  "https://meli.la/1nzYxWc",
  "https://meli.la/1v6XAQp",
  "https://meli.la/147JX4f",
  "https://meli.la/1Ym3fRn",
  "https://meli.la/2Hay1vT",
  "https://meli.la/2wksFr6",
  "https://meli.la/2x8RhWQ",
  "https://meli.la/1V1x254",
  "https://meli.la/2eDyUNg",
  "https://meli.la/1BUkujJ",
  "https://meli.la/2B9qqbq",
  "https://meli.la/1hjJPk4",
  "https://meli.la/1vWoNSu",
  "https://meli.la/1sziWVH",
  "https://meli.la/1srKkse",
  "https://meli.la/1VbPARE",
  "https://meli.la/32BbsPB",
  "https://meli.la/2w7skZe",
  "https://meli.la/2wBDh6d",
  "https://meli.la/1dmUAYL",
  "https://meli.la/1JEKETf",
  "https://meli.la/2eu3sjh",
  "https://meli.la/1eLmKrb",
  "https://meli.la/1QD7T6T",
  "https://meli.la/1Us2omP",
  "https://meli.la/1RVJsTr",
  "https://meli.la/2WQYF9a",
  "https://meli.la/2P7ByE5",
  "https://meli.la/1q14T2N",
  "https://meli.la/17JHLgE",
  "https://meli.la/1rZzfmy",
  "https://meli.la/1pQbftL",
  "https://meli.la/2ReABM9",
  "https://meli.la/1ip9GFN",
  "https://meli.la/28VMKgu",
  "https://meli.la/3346zVx",
  "https://meli.la/2x7NcQA",
  "https://meli.la/2jcdLJ6",
  "https://meli.la/2e5g35h",
  "https://meli.la/1KhxPqC",
  "https://meli.la/1iYp1ex",
  "https://meli.la/16fxJiy",
  "https://meli.la/1LzuDr5",
  "https://meli.la/2CgwLMr",
  "https://meli.la/1Cutp83",
  "https://meli.la/2CDAsXh",
  "https://meli.la/1n7DhvZ",
  "https://meli.la/26N99ia",
  "https://meli.la/1WyMv3E",
  "https://meli.la/15KyAM4",
  "https://meli.la/2fxpKWg",
  "https://meli.la/2eDyUNg",
  "https://meli.la/1sziWVH",
  "https://meli.la/2pctE9e",
  "https://meli.la/2Lhxigp",
  "https://meli.la/2AQE1wj",
  "https://meli.la/1yD4prf",
  "https://meli.la/1cUqGo9",
  "https://meli.la/1f52vSq",
  "https://meli.la/1jpAqZN",
  "https://meli.la/1zxQQfV",
  "https://meli.la/2uoc9FH",
  "https://meli.la/1E4JxYe",
  "https://meli.la/1P7haB6",
  "https://meli.la/1Aa29Rv",
  "https://meli.la/18Xw8Je",
  "https://meli.la/2x8RhWQ",
  "https://meli.la/1dmUAYL",
  "https://meli.la/2aj7Um8",
  "https://meli.la/1q14T2N",
  "https://meli.la/19grVZZ",
  "https://meli.la/1LSjWcA",
  "https://meli.la/21V2RK6",
  "https://meli.la/32ep7cJ",
  "https://meli.la/2pdCkoT",
  "https://meli.la/1VmoFG4",
  "https://meli.la/2VmWGaL",
  "https://meli.la/26amNmi",
  "https://meli.la/1NCA2PJ",
  "https://meli.la/1qjsNwb",
  "https://meli.la/2r4NLCF",
  "https://meli.la/1ii3p6j",
  "https://meli.la/2Ct7Tqt",
  "https://meli.la/1Mqec35",
  "https://meli.la/1RyH7Y8",
  "https://meli.la/1CLVSZ1",
  "https://meli.la/129j4Wv",
  "https://meli.la/2Uxg8Ng",
  "https://meli.la/1XSCc3k",
  "https://meli.la/158spWM",
  "https://meli.la/1C2PkgP",
  "https://meli.la/2xLYKw2",
  "https://meli.la/2Niohbw",
  "https://meli.la/1BxpDsQ",
  "https://meli.la/2PkoBwd",
  "https://meli.la/2ZncwaJ",
  "https://meli.la/22cBJZ4",
  "https://meli.la/1iBKhXh",
  "https://meli.la/2HefmEF",
  "https://meli.la/2ib9ArY",
  "https://meli.la/1dK6rbk",
  "https://meli.la/14Uio7S",
  "https://meli.la/26A3Au7",
  "https://meli.la/2m4scDC",
  "https://meli.la/1N9Qw49",
  "https://meli.la/1TJZZQQ",
  "https://meli.la/2jb7YtK",
  "https://meli.la/2cLcr3y",
  "https://meli.la/196YRhy",
  "https://meli.la/1UyLj9j",
  "https://meli.la/2xoU9mx",
  "https://meli.la/1kUvhJa",
  "https://meli.la/2FEAqxm",
  "https://meli.la/19M1Dji",
  "https://meli.la/2jSvsoS",
  "https://meli.la/1o1F6QV",
  "https://meli.la/2zAqhKT",
  "https://meli.la/16rcnvx",
  "https://meli.la/1bPUd3X",
  "https://meli.la/1trhS6M",
  "https://meli.la/1CXzuBz",
  "https://meli.la/17KbiRr",
  "https://meli.la/2FDw7ZE",
  "https://meli.la/2s1j1pB",
  "https://meli.la/1Lj6v8e",
  "https://meli.la/1WPt2EU",
  "https://meli.la/2YH3eEY",
  "https://meli.la/1xyse71",
  "https://meli.la/1mZs7Dy",
  "https://meli.la/1712G1R",
  "https://meli.la/25Cjy62",
  "https://meli.la/12cvg7r",
  "https://meli.la/1nKZ59e",
  "https://meli.la/2foCBrA",
  "https://meli.la/2cn18Wx",
  "https://meli.la/1EKmcPi",
  "https://meli.la/1sAVknY",
  "https://meli.la/2Leb23i",
  "https://meli.la/29gMmhN",
  "https://meli.la/2gXxpkz",
  "https://meli.la/1JDs4vp",
  "https://meli.la/2PirGam",
  "https://meli.la/1CkK19N",
  "https://meli.la/1z9LjsF",
  "https://meli.la/1n98bHA",
  "https://meli.la/1bdPpCd",
  "https://meli.la/2eK8Nyt",
  "https://meli.la/1Xqx9ae",
  "https://meli.la/31NHx4Q",
  "https://meli.la/2LAVoj4",
  "https://meli.la/1HCdyf3",
  "https://meli.la/1NWdYqf",
  "https://meli.la/1kqggCy",
  "https://meli.la/2ZqMgFB",
  "https://meli.la/2fxqfaj",
  "https://meli.la/2HUgZT9",
  "https://meli.la/1CEL7sS",
  "https://meli.la/2d3vVbM",
  "https://meli.la/1TvPG7z",
  "https://meli.la/2yHNeKP",
  "https://meli.la/2o9GKrN",
  "https://meli.la/2BGc87D",
  "https://meli.la/2rscRg7",
  "https://meli.la/2ED11hN",
  "https://meli.la/2SnYH56",
  "https://meli.la/2RaQQqX",
  "https://meli.la/2CHpiCT",
  "https://meli.la/1iG2K9g",
  "https://meli.la/2Y3wPu6",
  "https://meli.la/2Gnahkq",
  "https://meli.la/1pQirEL",
  "https://meli.la/2FQCZqR",
  "https://meli.la/1qEq6tE",
  "https://meli.la/1P2r1kv",
  "https://meli.la/2sXCBqA",
  "https://meli.la/2inyZXF",
  "https://meli.la/11W3F7Z",
  "https://meli.la/2RicXA5",
  "https://meli.la/1bzqi3F",
  "https://meli.la/2KAdcZS",
  "https://meli.la/19M1Dji",
  "https://meli.la/2uVXX7N",
  "https://meli.la/2yZsGUS",
  "https://meli.la/1Hyw1EM",
  "https://meli.la/1sY5XSt",
  "https://meli.la/2xTA8yu",
  "https://meli.la/2XyQGBc",
  "https://meli.la/1Z85srE",
  "https://meli.la/1aUYsoq",
  "https://meli.la/1V1x254",
  "https://meli.la/1ChnVA3",
  "https://meli.la/2qmn9iE",
  "https://meli.la/25b4j9k",
  "https://meli.la/2iSp3d5",
  "https://meli.la/1o1F6QV",
  "https://meli.la/2e5g35h",
  "https://meli.la/2X5JPih",
  "https://meli.la/1J35ZPR",
  "https://meli.la/1trhS6M",
  "https://meli.la/2gAirwb",
  "https://meli.la/2s1j1pB",
  "https://meli.la/27azJ4k",
  "https://meli.la/23kmn1S",
  "https://meli.la/1xyse71",
  "https://meli.la/2PFzo7f",
  "https://meli.la/2kd1vyh",
  "https://meli.la/29Ravvi",
  "https://meli.la/1zV6KFZ",
  "https://meli.la/2PXv9xM",
  "https://meli.la/1Azetiz",
  "https://meli.la/2VVJD8o",
  "https://meli.la/2Nu1Rk2",
  "https://meli.la/2c7pV9v",
  "https://meli.la/2ogNivo",
  "https://meli.la/33WRfv2",
  "https://meli.la/1JtviVt",
  "https://meli.la/1sAVknY",
  "https://meli.la/29gMmhN",
  "https://meli.la/1TJZZQQ",
  "https://meli.la/2FEAqxm",
  "https://meli.la/19M1Dji",
  "https://meli.la/2jSvsoS",
  "https://meli.la/1o1F6QV",
  "https://meli.la/2zAqhKT",
  "https://meli.la/1trhS6M",
  "https://meli.la/2s1j1pB",
  "https://meli.la/1Lj6v8e",
  "https://meli.la/1xyse71",
  "https://meli.la/1712G1R",
  "https://meli.la/25Cjy62",
  "https://meli.la/2cn18Wx",
  "https://meli.la/1EKmcPi",
  "https://meli.la/1sAVknY",
  "https://meli.la/29gMmhN",
  "https://meli.la/1CkK19N",
  "https://meli.la/2GBPqvY",
  "https://meli.la/2XGCXqZ",
  "https://meli.la/252DFsB",
  "https://meli.la/1sboxMx",
  "https://meli.la/2U6jxrs",
  "https://meli.la/1UCz6wD",
  "https://meli.la/19QawVH",
  "https://meli.la/1y44eWP",
  "https://meli.la/1cqkV3J",
  "https://meli.la/1FEKuxT",
  "https://meli.la/2XiCAqt",
  "https://meli.la/25rqa8C",
  "https://meli.la/1n9HtEK",
  "https://meli.la/1SuVmU5",
  "https://meli.la/2uHWLZp",
  "https://meli.la/279gCyt",
  "https://meli.la/1TfRRZj",
  "https://meli.la/2MyyT1n",
  "https://meli.la/1n6iGW8",
  "https://meli.la/2MHfedj",
  "https://meli.la/2B881Ga",
  "https://meli.la/2ZueVKY",
  "https://meli.la/1GwcTGX",
  "https://meli.la/1Hc4J3s",
  "https://meli.la/2iqjQSC"
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